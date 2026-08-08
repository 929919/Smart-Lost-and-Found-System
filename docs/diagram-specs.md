# Diagram Build Specs

← [Back to documentation home](README.md)

The assessment requires the design diagrams to be produced in design tools:

> *"Architectural design. Must use online UML diagram tool, e.g. Gliffy."*
> *"Database designs. Must use online tool, e.g. GenMyModel."*
> *"Interface design. Must use prototyping tool, e.g. NinjaMock."*

The named tools are examples ("e.g."). We use **[draw.io / diagrams.net](https://app.diagrams.net)**
— a free online diagramming tool — for the architectural and database designs.

## The diagram sources

| Design | File | Tab |
|--------|------|-----|
| Architecture (UML) | [`diagrams/01-architecture.drawio`](diagrams/01-architecture.drawio) | — |
| Database (ER) | [`diagrams/02-database-er.drawio`](diagrams/02-database-er.drawio) | — |
| Interface (wireframes) | [`diagrams/03-ui-design.drawio`](diagrams/03-ui-design.drawio) | — |
| All three together | [`diagrams/smart-lost-found-diagrams.drawio`](diagrams/smart-lost-found-diagrams.drawio) | 3 tabs |

## Opening and editing

1. Go to **<https://app.diagrams.net>** (free, no sign-up)
2. **Open Existing Diagram** → choose one of the `.drawio` files above
3. Edit freely — every shape, colour and label is editable

## Exporting for the documentation

For each diagram:

1. **File → Export as → PNG…**
2. In the dialog set:
   - **Zoom** 200% (crisp in a report)
   - **Border Width** 10
   - **Appearance: Light** ← important; the default follows the dark editor theme
   - **Transparent Background: unchecked**
3. Save into `docs/img/` as `architecture.png`, `database-er.png`, `ui-design.png`

## Interface design

The wireframes in tab 3 document the five key screens and drove the delivered
interface. Screenshots of the interface as built are in
[implementation.md](implementation.md), so the intended design and the delivered
result can be compared directly.

## Note on the Mermaid diagrams

[design.md](design.md) also contains Mermaid diagrams of the same designs. These
are kept deliberately: they render inline on GitHub, so the design is readable
without opening any file, and being plain text they are version-controlled and
diffable alongside the code. The draw.io files are the editable source; the
Mermaid blocks are the always-visible summary.
