# Map overlap template

Template 1 of the portal series: one hero map where two measures meet. Reference build:
`projects/musa-5500-python/assignment-3-evictions-ndvi/overlap/`.

Goal: one lab or project becomes a clean, interactive page in about 15 minutes.

## What a portal is

One question, answered with one hero map of places (tracts, block groups, neighborhoods), where two measures meet:

- **A**: the outcome you care about (evictions, heat, crashes, ridership). It can have periods (years).
- **B**: the thing you compare it to (violations, tree canopy, income). It can be split into groups.

Each place is colored by whether A, B, both or neither are in the city's top quarter.

## Page anatomy, top to bottom

| Part | What it holds | Rules |
|---|---|---|
| Name | "Gautami Kasat", links to LinkedIn | Nothing else above the title |
| Title | The study as a short, slightly playful question | Example: "Do evictions and building violations cluster in Philly?" |
| Lede | One line: "Let's test it." plus what to do | No method talk |
| Hero map band | Left rail, map, right rail | The map is the hero, about 88% of screen height |
| Left rail (choose) | Round play button, period list, B buttons with match numbers, one short note | Soft pills, only the chosen item is filled |
| Right rail (read) | "Neighborhood" card (hover previews, click pins), 2×2 color legend at the bottom | The card is the only bordered element on the page |
| The test | Scatter with trend line (left), big numbers (right): both-high count, overlap %, correlation, per-period bars | Big numbers live here, never under the title |
| How it was made | Tool pills for Analysis, Portal and Data, one fine-print line, links | Fine print says what a place is, the years, and "a pattern, not proof of cause" |

## Look and feel (do not drift)

- White page, navy ink. Fonts: Bricolage Grotesque (headings, numbers) and Figtree (text).
- Colors: A high `#6fa8dc` blue, B high `#f2a35c` orange, both high `#5a1a63` plum, neither `#dfe5ee`.
- Borders are rare. Group with space and soft fills. No boxes around numbers and no circle-outlined buttons.
- Short text everywhere, with plain words ("neighborhood", not "census tract"). Use one term for each thing across the whole page.
- Leave out sensitive fields (for example the poverty rate) from cards unless the study is about them.
- No watermark text on the map. No em dashes in any copy.

## Files

| File | Job |
|---|---|
| `assets/style.css` | Colors, fonts, buttons, tooltip (shared by every portal) |
| `templates/map-overlap/portal.css` | Page layout: hero band, rails, chips, legend, card, test section |
| `templates/map-overlap/portal.js` | All behavior. Reads `window.PORTAL_DATA` and `window.PORTAL_CONFIG` |
| `templates/map-overlap/starter/index.html` | Page skeleton with `{{TOKENS}}` to fill |
| `templates/map-overlap/portal_export.py` | Turns a GeoDataFrame into the data file |

## Data format (`window.PORTAL_DATA`)

```js
{
  features: [ { type: "Feature", geometry: {...},
                properties: { id: "42101000100", name: "optional",
                              a: [3, 5, 4] or 12,        // A: list per period, or one number
                              b: [0, 2, 7, 1] or 8,      // B: list per type, or one number
                              ren: 63.5, rent: 912 } } ],// optional extras for the card
  types: ["CODE 1", "CODE 2", ...]                       // names for the B list (when B is a list)
}
```

Make it with `templates/map-overlap/portal_export.py` at the end of the notebook. Keep it under about 1.5 MB.

## Config (`window.PORTAL_CONFIG`)

```js
{
  place: { one: "neighborhood", many: "neighborhoods" },
  a: { name: "Evictions", lower: "evictions", field: "a",
       periods: { keys: [2012, 2013], index: [0, 1],           // index = position inside the A list
                  allLabel: "All years", allText: "2012 to 2016" } },   // omit periods if A is one number
  b: { name: "Violations", lower: "violations", field: "b", xSuffix: ", 2012 to 2016",
       allName: "All violations", allDesc: "All 15 violation types",
       groups: [ { name: "Leaks and plumbing", icon: "drop", desc: "shown on hover",
                   codes: ["CODE 1", "CODE 2"] } ] },           // omit groups if B is one number
  context: [ { key: "ren", label: "Renters", unit: "%" }, { key: "rent", label: "Median rent", unit: "$" } ],
  nameFor: p => p.name,                                     // optional; default is "Tract 123.45" from a GEOID
  colors: { neither: "#e3e8e1", a: "#7fb77e", b: "#f2a35c", both: "#7a2a12" }   // optional per-study treatment
}
```

Ready-made treatments (keep "both" the darkest, and keep A and B far apart in hue):

| Theme | neither | a | b | both |
|---|---|---|---|---|
| Housing (default) | `#dfe5ee` | `#6fa8dc` | `#f2a35c` | `#5a1a63` |
| Green and heat | `#e3e8e1` | `#7fb77e` | `#f2a35c` | `#7a2a12` |
| Water and flooding | `#e1e8ee` | `#5fb3c9` | `#c9a26b` | `#1f3f66` |
| Transit and access | `#e6e3ee` | `#8b7fd1` | `#f0b44c` | `#2e2a5c` |

Icons for groups: `layers`, `drop`, `bolt`, `home`, `tree`, `sun`, `bus`, `people`, `dollar`, `all`.
Group B into 3 to 5 plain-language kinds. Never list 10 or more buttons.

## The 15-minute workflow

1. **Upload** the notebook (and the zip, or just the files it reads) and say: "Use my portal template. A is ..., B is ..."
2. **Check the data** (2 min): only the years both measures share, no secrets or private paths, notebook numbers recomputed.
3. **Export** (3 min): `portal_export.py` writes `projects/<course>/<lab>/data/portal-data.js`.
4. **Fill** (5 min): copy `templates/map-overlap/starter/index.html` to `projects/<course>/<lab>/<view>/index.html`, then fill the tokens and config.
5. **Preview** (3 min): test it in a browser and share a private preview link.
6. **Publish** (2 min): add a card to the root `index.html` and a row to `README.md`, write the LinkedIn caption in `posts/`, then commit and push.

## When the kit does not fit

- **One measure only, with no comparison:** keep the hero band and rails, color by a single blue ramp, and drop the 2×2 legend and the test section.
- **Points instead of areas** (trees, stops, crashes): aggregate the points to tracts first, then use the kit as-is.
- **Before and after, or two time periods side by side:** build a second view folder (for example `side-by-side/`) with the same header, rails and footer.
