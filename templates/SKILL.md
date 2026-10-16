---
name: portal-templates
description: Use when Gautami says "use my ... template" (for example "use my Overlap Map template"), "make a portal", or wants a lab, notebook or project turned into an interactive page.
---

# Portal templates

Turns one study into a clean, interactive page in Gautami's house style, published on GitHub Pages and shared on LinkedIn. Target: about 15 minutes from upload to live link.

## Repo layout (keep it flat)

`index.html` landing page, `projects/NN-topic-years/` one folder per project (that folder is one live page), `templates/<name>/` master designs. Nothing else at the top level. Each project folder holds `index.html` (words and settings, with EDIT ME notes), `style.css`, the code file (`map.js`), `data.js`, `notebook.ipynb` and `linkedin.md`. Big raw data stays on her computer, outside the repo.

## Where the templates live

Repo: `gautamik01/gautami_social` (public, GitHub Pages from `main`, root). Live: https://gautamik01.github.io/Gautami_Social/

- `templates/README.md`: the catalog. Match the name she says ("Overlap Map") to its folder (`templates/overlap-map/`). If she names no template, pick the closest one and say which you picked.
- Each template folder has an `index.html` with `{{TOKENS}}`, `style.css`, the code file, and a `GUIDE.md` (anatomy, data format, every option). Read the chosen `GUIDE.md` first, every time.
- This file is backed up at `templates/SKILL.md`. When a new template is added, add one line about it to the list below.

Get the repo by attaching it (add_repo, push access) and cloning. If that is not possible, read the files from the public site or ask her to upload the template folder.

## Templates

- **Overlap Map** (`templates/overlap-map/`): two measures across the same places, colored by where both are high. It can also show two linked maps (`mode: "side"`, used for then vs now) or one measure on a gradient (`mode: "single"`). Examples: `projects/01-evictions-violations-2012-2016/`, `projects/02-eviction-patterns-2003-2016/`.

## Treatment is open, layout is fixed

The master template never changes for one project: edit the project's own copy instead. Each study picks its own colors, legend words, "high" cutoff and map mode through the page config (see GUIDE.md). Choose a treatment that fits the theme: water, heat, green, transit, housing. What stays fixed is the layout and voice, so the series reads as one body of work. If a study needs a new layout, build it by hand, then offer to save it as a new template with a two-word name for what the reader sees (Side-by-Side Map, Before-After Slider, Story Scroll).

## Workflow

1. **Inputs.** The notebook (.ipynb, .qmd or .Rmd) plus the data files it reads. Ask in one line only what is missing: what A is (the outcome), what B is (the comparison), and the course or project folder. Confirm the assignment is already submitted and graded.
2. **Check the data.** Unzip into its own folder. Skip checkpoints and __MACOSX. Look for API keys, tokens and personal paths. Recompute every number the notebook claims and use only verified numbers. Limit A and B to the periods they both cover. Flag any unfilled placeholders in the notebook.
3. **Shape the story.** One question as the title. If B has many types, fold them into 3 to 5 plain-language groups and compute each group's correlation, so the grouping tells the finding.
4. **Copy and export.** Copy the template folder to `projects/NN-topic-years/` (next number), drop `GUIDE.md` and `export.py` from the copy, write `data.js` with the template's `export.py`, and add the notebook as `notebook.ipynb`. Keep it under about 1.5 MB. Leave out sensitive fields (for example the poverty rate) unless the study is about them.
5. **Fill** the copy's `index.html`: tokens, config, a fitting treatment, tool pills for the tools the notebook actually used, and one fine-print line.
6. **Test** in a headless browser at 1440, 1100 and 390 px wide: no console errors, no sideways scroll, and on-page numbers that match the Python check.
7. **Preview first.** Publish a private single-file preview (inline the CSS, JS and data; load D3 from cdnjs) and wait for her OK. Never push before she approves.
8. **Publish.** Add a card to the root `index.html` and a row to `README.md`, write `linkedin.md` in the project folder, then commit and push to `main` with the session attribution lines. Check that the live URL loads.
9. **Hand off.** Give the live link, the caption file, and a 20 to 30 second video idea.

## House style (her feedback, keep it)

- White page and navy ink. Bricolage Grotesque for headings and numbers, Figtree for text.
- The visual is the hero: right after the title, about 88% of screen height.
- Controls are soft and few: an icon-only round play button, soft pill lists, and only the chosen item filled. Line everything up with the title's left edge.
- Big numbers sit beside the chart they explain, never under the title.
- Borders only on the selected-place card. No boxes around numbers, no circle-outlined buttons, no long button labels, no text watermarks on the map.
- Very little text. One term for each thing across the page. Plain words ("neighborhood", not "census tract") unless precision matters.
- Title: a short, slightly playful question with the years it covers. Lede: "Let's test it." plus what to do.
- Her name links to https://www.linkedin.com/in/gautamikasat. Her portfolio is not public yet, so do not link it.
- "How it was made" lists tools as pills (Analysis, Portal, Data) and credits Claude. Fine print says what a place is, the years, and "a pattern, not proof of cause."
- Leave an `EDIT ME` comment above the header and footer so she can change words herself on GitHub.
- Copy sounds like her: warm, clear, a little playful, never robotic. No em dashes anywhere.
