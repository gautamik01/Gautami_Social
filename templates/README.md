# Portal templates

Each folder is one reusable template. Every template shares `assets/style.css` (colors and fonts), so all the portals read as one series.

| Template | Use it for | Example |
|---|---|---|
| [map-overlap](map-overlap/) | Two measures across the same places: where are both high? | [Evictions and violations](../projects/musa-5500-python/assignment-3-evictions-ndvi/overlap/) |

## What is in each template folder

- `TEMPLATE.md`: page anatomy, data format, settings, look-and-feel rules
- `SKILL.md`: the Claude skill text for this template (a backup of the copy saved in Claude)
- `starter/index.html`: the page with `{{TOKENS}}` to fill
- the shared code (`portal.css`, `portal.js`) and any helpers (`portal_export.py`)

## Adding a new template

1. Build the first page by hand until you like it.
2. Move the reusable parts into `templates/<new-name>/`, and point the first page at them so it doubles as a test.
3. Write `TEMPLATE.md` and `SKILL.md`, add a row to the table above, then save the skill in Claude.
