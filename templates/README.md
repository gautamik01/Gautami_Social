# Portal templates

To use one in Claude: "use my <Template name> template", for example "use my Overlap Map template".

Each folder is one reusable template. Every template shares `assets/style.css` (colors and fonts), so all the portals read as one series.

| Template | Use it for | Example |
|---|---|---|
| [Overlap Map](overlap-map/) | Two measures across the same places: where are both high? (or one measure on a gradient) | [Evictions and violations](../portals/evictions-and-violations-2012-2016.html), [Eviction patterns](../portals/eviction-patterns-2003-2016.html) |

## What is in each template folder

- `TEMPLATE.md`: page anatomy, data format, settings, look-and-feel rules
- `starter.html`: the page with `{{TOKENS}}` to fill (copy it into `portals/`)
- the shared code (`portal.css`, `portal.js`) and any helpers (`portal_export.py`)

## Naming

Name a template after what the reader sees, in two plain words: Overlap Map, Side-by-Side Map, Before-After Slider, Story Scroll, Trend Dashboard. The folder uses the same words in lowercase with hyphens (`overlap-map`).

`templates/SKILL.md` is a backup of the one Claude skill ("portal-templates") that knows every template here.

## Adding a new template

1. Build the first page by hand until you like it.
2. Move the reusable parts into `templates/<new-name>/` (one level, no subfolders), and point the first page at them so it doubles as a test.
3. Write its `TEMPLATE.md`, add a row to the table above, and add one line about it to `templates/SKILL.md` (then update the skill in Claude from that file).
