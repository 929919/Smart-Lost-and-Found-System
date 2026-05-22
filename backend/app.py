from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import create_client, Client
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'
CORS(app, origins="*")

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


# ─── ITEMS ───────────────────────────────────────────────────────────────────

@app.route("/api/items", methods=["GET"])
def get_items():
    """Return all items, optionally filtered by category, status, or search."""
    category = request.args.get("category")
    status   = request.args.get("status")
    search   = request.args.get("search")

    query = supabase.table("items").select("*").order("created_at", desc=True)

    if category:
        query = query.eq("category", category)
    if status:
        query = query.eq("status", status)
    if search:
        query = query.ilike("name", f"%{search}%")

    response = query.execute()
    return jsonify(response.data)


@app.route("/api/items", methods=["POST"])
def create_item():
    """Log a new found or lost item."""
    data = request.get_json()
    required = ["name", "category", "location", "item_type"]
    for field in required:
        if not data.get(field):
            return jsonify({"error": f"Field '{field}' is required."}), 400

    payload = {
        "name":        data["name"],
        "category":    data["category"],
        "location":    data["location"],
        "item_type":   data["item_type"],   # "found" | "lost"
        "description": data.get("description", ""),
        "color":       data.get("color", ""),
        "contact":     data.get("contact", ""),
        "shelf_tag":   data.get("shelf_tag", ""),
        "status":      "Active",
        "created_at":  datetime.utcnow().isoformat(),
    }

    response = supabase.table("items").insert(payload).execute()
    return jsonify(response.data[0]), 201


@app.route("/api/items/<int:item_id>", methods=["PATCH"])
def update_item(item_id):
    """Update item status (Active → Claimed → Returned)."""
    data = request.get_json()
    allowed = {"status", "shelf_tag", "description"}
    update_payload = {k: v for k, v in data.items() if k in allowed}

    if not update_payload:
        return jsonify({"error": "Nothing to update."}), 400

    response = supabase.table("items").update(update_payload).eq("id", item_id).execute()
    if not response.data:
        return jsonify({"error": "Item not found."}), 404
    return jsonify(response.data[0])


@app.route("/api/items/<int:item_id>", methods=["GET"])
def get_item(item_id):
    response = supabase.table("items").select("*").eq("id", item_id).execute()
    if not response.data:
        return jsonify({"error": "Item not found."}), 404
    return jsonify(response.data[0])


# ─── STATS ───────────────────────────────────────────────────────────────────

@app.route("/api/stats", methods=["GET"])
def get_stats():
    """Return dashboard summary counts."""
    all_items = supabase.table("items").select("status").execute().data
    total    = len(all_items)
    active   = sum(1 for i in all_items if i["status"] == "Active")
    claimed  = sum(1 for i in all_items if i["status"] == "Claimed")
    returned = sum(1 for i in all_items if i["status"] == "Returned")
    return jsonify({"total": total, "active": active, "claimed": claimed, "returned": returned})


# ─── CHATBOT ─────────────────────────────────────────────────────────────────

@app.route("/api/chat", methods=["POST"])
def chat():
    """Simple rule-based chatbot that queries the database."""
    data    = request.get_json()
    message = data.get("message", "").lower()

    # Fetch all active items to match against
    items = supabase.table("items").select("*").eq("status", "Active").execute().data

    keywords_policy = ["collect", "pick up", "retrieve", "where", "office", "hours"]
    keywords_time   = ["how long", "days", "keep", "storage", "30"]
    keywords_policy2 = ["policy", "rules", "procedure", "claim"]

    if any(k in message for k in keywords_policy):
        return jsonify({
            "reply": "Lost items are kept at the Security Office in Building 1, ground floor. "
                     "Opening hours: Mon–Fri 8am–6pm, Sat 9am–1pm. Bring your student ID to collect.",
            "match": None
        })

    if any(k in message for k in keywords_time):
        return jsonify({
            "reply": "Items are held for 30 days from the date they are logged. "
                     "After that, unclaimed items are donated to charity. "
                     "We'll email you a reminder if we have your contact details.",
            "match": None
        })

    if any(k in message for k in keywords_policy2):
        return jsonify({
            "reply": "To claim an item: (1) Search the dashboard to confirm it's here. "
                     "(2) Visit the Security Office with your student ID. "
                     "(3) Describe the item to the officer. "
                     "(4) Sign the collection form. Items are only released to verified owners.",
            "match": None
        })

    # Try to match item by keywords in message
    matched = None
    for item in items:
        name_words = item["name"].lower().split()
        if any(word in message for word in name_words if len(word) > 3):
            matched = item
            break

    if matched:
        return jsonify({
            "reply": f"Good news! I found a possible match in our database.",
            "match": matched
        })

    return jsonify({
        "reply": "I searched the database but couldn't find an exact match. "
                 "Try describing your item differently — brand, colour, or where you last had it. "
                 "You can also browse the dashboard directly.",
        "match": None
    })


# ─── HEALTH ──────────────────────────────────────────────────────────────────

@app.route("/", methods=["GET"])
def health():
    return jsonify({"status": "Smart Lost & Found API is running."})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
