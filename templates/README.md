# Templates

Master designs, one folder each. A project starts as a copy of one of these, so changing a project never changes the master.

To use one in Claude, say "use my <name> template", for example "use my Overlap Map template".

| Template | Use it for | Projects that use it |
|---|---|---|
| [Overlap Map](overlap-map/) | Two measures across the same places: where are both high? Also two linked maps (then vs now) or one measure on a gradient. | 01, 02 |

## Naming a new template

Two plain words for what the reader sees: Overlap Map, Before-After Slider, Story Scroll, Trend Dashboard. The folder uses the same words in lowercase with hyphens (`overlap-map`).

## Adding a new template

1. Build the first project by hand until you like it.
2. Copy its reusable files into `templates/<new-name>/` (`index.html` with `{{TOKENS}}`, `style.css`, the code file, `GUIDE.md`).
3. Add a row to the table above and one line to `SKILL.md`, then update the skill in Claude from that file.

`SKILL.md` is a backup of the Claude skill ("portal-templates") that knows every template here.
