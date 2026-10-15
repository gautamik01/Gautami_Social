# Gautami Kasat: interactive portals

Interactive versions of coursework and personal projects in urban spatial analytics.
Each portal is one self-contained `index.html` that opens in any browser.

## Portals

| Portal | Course | Tools |
|---|---|---|
| [Evictions and building violations in Philadelphia](projects/musa-5500-python/assignment-3-evictions-ndvi/) | MUSA 5500, Python | pandas, GeoPandas, D3 |

## How the repo is organized

```
assets/        shared style.css and the D3 library (every portal uses these)
projects/      one folder per course, one subfolder per portal
  musa-5500-python/
  musa-5080-ppa-r/
  personal/
posts/         LinkedIn captions and thumbnails
raw-data/      big original datasets, kept on my computer only (git ignores it)
```

Every portal folder has the same parts: the source notebook (`notebook.ipynb` or a `.qmd`),
a small `data/` folder, and `index.html`.

## Adding a new portal

1. Make `projects/<course>/<portal-name>/` (lowercase, hyphens, no spaces).
2. Put a trimmed data file in its `data/` folder. Keep files small (a few hundred KB is ideal).
3. Link `../../../assets/style.css` and build `index.html`.
4. Add a row to the table above and a card to the root `index.html`.

Built with AI assistance (Claude) after each assignment was submitted and graded.
