/* ============================================================
   camera.js — photo capture for log-found.html
   Supports live camera (getUserMedia, rear camera on mobile)
   and file upload. Both produce a base64 data URL exposed via
   CameraTool.getPhoto(). Falls back gracefully if camera denied.
   ============================================================ */

const CameraTool = (function () {
  let stream = null, photo = "", onChange = null;
  let video, canvas, captured, capturedWrap, msg, startBtn, captureBtn, retakeBtn, fileInput, filePreview;

  function setPhoto(url) { photo = url; if (onChange) onChange(photo); }

  async function start() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showMsg("📷 Camera not supported in this browser.<br>Please use the <b>Upload File</b> tab.");
      return;
    }
    showMsg("Requesting camera access…");
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      video.srcObject = stream;
      video.style.display = "block";
      await video.play();
      msg.style.display = "none";
      startBtn.style.display = "none";
      captureBtn.style.display = "inline-flex";
    } catch (err) {
      console.warn("Camera error:", err);
      showMsg("📷 Camera unavailable or permission denied.<br>Please use the <b>Upload File</b> tab instead.");
      startBtn.style.display = "inline-flex";
    }
  }

  function capture() {
    if (!stream) return;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    const url = canvas.toDataURL("image/jpeg", 0.85);
    setPhoto(url);
    captured.src = url;
    capturedWrap.style.display = "block";
    video.style.display = "none";
    stop();
    captureBtn.style.display = "none";
    retakeBtn.style.display = "inline-flex";
  }

  function retake() {
    setPhoto("");
    captured.src = "";
    capturedWrap.style.display = "none";
    retakeBtn.style.display = "none";
    start();
  }

  function stop() { if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; } }

  function handleFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      setPhoto(e.target.result);
      filePreview.src = e.target.result;
      filePreview.style.display = "block";
    };
    reader.readAsDataURL(file);
  }

  function showMsg(html) { msg.style.display = "block"; msg.innerHTML = html; }

  return {
    init(opts) {
      onChange = (opts && opts.onChange) || null;
      video = document.getElementById("camVideo");
      canvas = document.getElementById("camCanvas");
      captured = document.getElementById("camCaptured");
      capturedWrap = document.getElementById("camCapturedWrap");
      msg = document.getElementById("camMsg");
      startBtn = document.getElementById("camStart");
      captureBtn = document.getElementById("camCapture");
      retakeBtn = document.getElementById("camRetake");
      fileInput = document.getElementById("fileInput");
      filePreview = document.getElementById("filePreview");

      startBtn.addEventListener("click", start);
      captureBtn.addEventListener("click", capture);
      retakeBtn.addEventListener("click", retake);
      fileInput.addEventListener("change", e => handleFile(e.target.files[0]));
    },
    getPhoto() { return photo; },
    stop,
  };
})();
