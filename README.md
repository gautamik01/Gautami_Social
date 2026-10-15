# Gautami Kasat: interactive portals

Interactive studies of cities, built from coursework and personal projects.
Live site: https://gautamik01.github.io/Gautami_Social/

## Portals

| Portal | Course | Tools |
|---|---|---|
| [Do evictions and building violations cluster in Philly?](projects/musa-5500-python/assignment-3-evictions-ndvi/overlap/) | MUSA 5500, Python | pandas, GeoPandas, D3 |

## How the repo is organized

```
assets/        shared colors, fonts and the D3 library
kit/           the portal template: layout, behavior, starter page, data exporter (see kit/TEMPLATE.md)
projects/      one folder per course, one subfolder per lab or project
posts/         LinkedIn captions
raw-data/      big original datasets, kept on my computer only (git ignores it)
```

## Making a new portal

Follow `kit/TEMPLATE.md`. In short: export the data with `kit/portal_export.py`,
copy `kit/starter/index.html` into the project folder, fill in the text and config, preview, then push.

Built with AI assistance (Claude) after each assignment was submitted and graded.
