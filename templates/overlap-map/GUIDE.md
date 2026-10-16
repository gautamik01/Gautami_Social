# Overlap Map

Portal template 1. Say "use my Overlap Map template". One hero map where two measures meet, two linked maps side by side (`mode: "side"`), or one measure on a gradient (`mode: "single"`). Examples: `projects/01-evictions-violations-2012-2016/` (overlap) and `projects/02-eviction-patterns-2003-2016/` (side by side, then vs now).

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
| Title | The study as a short, slightly playful question with its years | Example: "Did Philly's eviction pattern change from 2003 to 2016?" |
| Lede | One line: "Let's test it." plus what to do | No method talk |
| Hero map band | Left rail, map, right rail | The map is the hero, about 88% of screen height |
| Left rail (choose) | Round play button, period list, B buttons with match numbers, one short note | Soft pills, only the chosen item is filled |
| Right rail (read) | Place card (hover previews, click pins, no hint text), 2×2 color legend at the bottom | The card is the only bordered element on the page |
| The test | Scatter with trend line (left), big numbers (right): both-high count, overlap %, correlation, per-period bars | Big numbers live here, never under the title |
| How it was made | Tool pills for Analysis, Portal and Data, one fine-print line, links | Fine print says what a place is, the years, and "a pattern, not proof of cause" |

## Look and feel (do not drift)

- White page, navy ink. Fonts: Bricolage Grotesque (headings, numbers) and Figtree (text).
- Colors: A high `#6fa8dc` blue, B high `#f2a35c` orange, both high `#5a1a63` plum, neither `#dfe5ee`.
- Borders are rare. Group with space and soft fills. No boxes around numbers and no circle-outlined buttons.
- Short text everywhere, with plain words ("neighborhood", not "census tract"). Use one term for each thing across the whole page.
- Leave out sensitive fields (for example the poverty rate) from cards unless the study is about them.
- No watermark text on the map. No em dashes in any copy.

## Files (this folder is the master; each project gets its own copy)

| File | Job | Who edits it |
|---|---|---|
| `index.html` | The page: title, text, settings (`PORTAL_CONFIG`), with `{{TOKENS}}` to fill | You, freely (look for `EDIT ME`) |
| `style.css` | How it looks: fonts, colors, layout | Rarely, for look tweaks |
| `map.js` | How it behaves: maps, buttons, legend, card, chart | Claude |
| `export.py` | Turns a GeoDataFrame into the project's `data.js` | Used in the notebook |
| `GUIDE.md` | This guide | |

A new project is this folder copied to `projects/NN-topic-years/`, plus its own `data.js`, `notebook.ipynb` and `linkedin.md`.
Changing a project's copy never changes the master. Improve the master only when a change should apply to future projects.

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

Make it with `export.py` at the end of the notebook. Keep it under about 1.5 MB.

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

  // Everything below is optional. This is how each study gets its own treatment.
  colors: { neither: "#e3e8e1", a: "#7fb77e", b: "#f2a35c", both: "#7a2a12",   // overlap colors
            ramp: ["#fff4e6", "#f2a35c", "#8f2d05"] },                        // used by mode "single"
  labels: { both: "Hot and bare", a: "Busy", b: "Bare", neither: "Calm" },     // legend and card words
  cutoff: 0.8,              // what counts as "high": 0.75 = top quarter (default), 0.8 = top fifth
  mode: "single", single: "a"   // color the map by one measure on a gradient, with a gradient legend
}
```

Nothing about the look is locked. Each study can set its own colors, legend words, "high" cutoff, and whether the map shows the overlap or one measure. What stays fixed is the layout (map as hero, rails, the test, footer) so the series still feels like one body of work.

Starting points for colors (use them as is, mix them, or make new ones; keep "both" the darkest and A and B far apart in hue):

| Theme | neither | a | b | both |
|---|---|---|---|---|
| Housing (default) | `#dfe5ee` | `#6fa8dc` | `#f2a35c` | `#5a1a63` |
| Green and heat | `#e3e8e1` | `#7fb77e` | `#f2a35c` | `#7a2a12` |
| Water and flooding | `#e1e8ee` | `#5fb3c9` | `#c9a26b` | `#1f3f66` |
| Transit and access | `#e6e3ee` | `#8b7fd1` | `#f0b44c` | `#2e2a5c` |

Icons for groups: `layers`, `drop`, `bolt`, `home`, `tree`, `sun`, `bus`, `people`, `dollar`, `all`.
Group B into 3 to 5 plain-language kinds. Never list 10 or more buttons.

## The 15-minute workflow

1. **Upload** the notebook (and the zip, or just the files it reads) and say: "Use my Overlap Map template. A is ..., B is ..."
2. **Check the data** (2 min): only the years both measures share, no secrets or private paths, notebook numbers recomputed.
3. **Copy** (1 min): copy `templates/overlap-map/` to `projects/NN-topic-years/` (next number, topic, years). Delete `GUIDE.md` and `export.py` from the copy.
4. **Export** (3 min): `export.py` writes the copy's `data.js`. Add the notebook as `notebook.ipynb`.
5. **Fill** (5 min): fill the tokens and `PORTAL_CONFIG` in the copy's `index.html`.
6. **Preview** (2 min): test it in a browser and share a private preview link.
7. **Publish** (2 min): add a card to the root `index.html`, write `linkedin.md`, then commit and push.

## When the template does not fit

- **One measure only, with no comparison:** keep the hero band and rails, color by a single blue ramp, and drop the 2×2 legend and the test section.
- **Points instead of areas** (trees, stops, crashes): aggregate the points to tracts first, then use the kit as-is.
- **Before and after, or two time periods:** use `mode: "side"` with `sameScale: true`, `dots: "classes"` and `diagonal` (see the eviction patterns page).
