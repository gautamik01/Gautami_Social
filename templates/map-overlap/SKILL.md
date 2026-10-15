---
name: map-portal
description: Use when Gautami wants a lab, notebook, assignment or project turned into an interactive map portal, or says "use my portal template" or "make a portal".
---

# Map portal

Turns one study into a clean, interactive one-page map portal in Gautami's house style, published on GitHub Pages and shared on LinkedIn. Target: about 15 minutes from upload to live link.

## Where the templates live

Repo: `gautamik01/gautami_social` (public, GitHub Pages from `main`, root). Live: https://gautamik01.github.io/Gautami_Social/

- `templates/README.md`: the catalog of templates. Pick the one that fits the study. If none fits, build by hand, then offer to turn the result into a new template.
- `templates/map-overlap/` (template 1: two measures across the same places):
  - `TEMPLATE.md`: page anatomy, data format, config options, color treatments. Read it first, every time.
  - `starter/index.html`: page skeleton with `{{TOKENS}}`.
  - `portal.js` and `portal.css`: behavior and layout. Change only if the study truly needs it, since every portal on this template shares them.
  - `portal_export.py`: GeoDataFrame to `data/portal-data.js`.
  - `SKILL.md`: a backup copy of this skill.
- `assets/style.css`: shared colors and fonts.
- Reference build: `projects/musa-5500-python/assignment-3-evictions-ndvi/overlap/`.

Get the repo by attaching it (add_repo, push access) and cloning. If that is not possible, read the files from the public site or ask Gautami to upload the template folder.

## Workflow

1. **Inputs.** The notebook (.ipynb, .qmd or .Rmd) plus the data files it reads. Ask in one line only what is missing: what A is (the outcome), what B is (the comparison), and the course or project folder. Confirm the assignment is already submitted and graded before building.
2. **Check the data.** Unzip into its own folder. Skip checkpoints and __MACOSX. Look for API keys, tokens and personal paths. Recompute every number the notebook claims and use only verified numbers on the page. Limit A and B to the periods they both cover. Flag any unfilled placeholders (like `[AREAS ...]`) in the notebook.
3. **Shape the story.** One question as the title. If B has many types, fold them into 3 to 5 plain-language groups and compute each group's correlation, so the grouping tells the finding.
4. **Export** with `portal_export.py` to `projects/<course>/<lab>/data/portal-data.js`. Keep it under about 1.5 MB. Leave out sensitive fields (for example the poverty rate) unless the study is about them.
5. **Fill** `starter/index.html` into `projects/<course>/<lab>/<view>/index.html`: tokens, config, tool pills for the tools the notebook actually used, and one fine-print line. Pick a color treatment from TEMPLATE.md that fits the theme.
6. **Test** in a headless browser at 1440, 1100 and 390 px wide: no console errors, no sideways scroll, and on-page numbers that match the Python check.
7. **Preview first.** Publish a private single-file preview (inline the CSS, JS and data; load D3 from cdnjs) and wait for Gautami's OK. Never push before she approves.
8. **Publish.** Add a card to the root `index.html` and a row to `README.md`, write a LinkedIn caption to `posts/`, then commit and push to `main` with the session attribution lines. Check that the live URL loads.
9. **Hand off.** Give the live link, the caption file, and a 20 to 30 second video idea.

## House style (her feedback, keep it)

- White page and navy ink. Bricolage Grotesque for headings and numbers, Figtree for text.
- The map is the hero: right after the title, about 88% of screen height.
- Left rail is for choosing: an icon-only round play button, a soft period list, and B buttons with match numbers. Right rail is for reading: a place card that previews on hover and pins on click, with the 2x2 legend at the bottom. Line everything up with the title's left edge.
- Big numbers (both-high count, overlap % against 25% chance, correlation, per-period bars) sit beside the scatter and trend line in "The test", never under the title.
- Borders only on the place card. No boxes around numbers, no circle-outlined buttons, no long button labels, no text watermarks on the map.
- Very little text. One term for each thing across the page. "Neighborhood" instead of "census tract" unless precision matters.
- Title: a short, slightly playful question. Lede: "Let's test it." plus what to do.
- Her name links to https://www.linkedin.com/in/gautamikasat. Her portfolio is not public yet, so do not link it.
- "How it was made" lists tools as pills (Analysis, Portal, Data) and credits Claude. Fine print says what a place is, the years, and "a pattern, not proof of cause."
- Copy sounds like her: warm, clear, a little playful, never robotic. No em dashes anywhere.

## When the template does not fit

See the last section of `templates/map-overlap/TEMPLATE.md` (single measure, point data, side-by-side or before/after). Keep the same header, rails, footer and tokens so every portal still reads as one series. When a new layout works well, offer to save it as the next template in `templates/` with its own `SKILL.md`.
