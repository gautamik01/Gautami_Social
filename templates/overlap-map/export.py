"""
Export a GeoDataFrame into the data file a map portal reads (window.PORTAL_DATA).

Run this at the end of a lab notebook, or paste the function into a cell.

    from export import export_portal
    export_portal(
        gdf,                                   # one row per place (tract, block group, ...)
        id_col="GEOID",
        a_cols=[f"e-{y:02d}" for y in range(3, 17)],   # measure A: one column, or a list (one per period)
        b_cols=violation_count_columns,                # measure B: one column, or a list (one per type)
        b_types=violation_type_names,                  # names for the B list, in the same order (optional)
        context={"ren": "pro-16", "rent": "mgr-16"},   # extra facts for the card: new_key -> column
        out_path="data/<page-name>.js",
    )

Keeps files small: drops every other column, simplifies shapes, rounds coordinates.
"""
import json
import geopandas as gpd
import pandas as pd


def _num(x):
    if pd.isna(x):
        return None
    x = float(x)
    return int(x) if x.is_integer() else round(x, 2)


def _round(coords, nd=5):
    if isinstance(coords, (list, tuple)):
        return [_round(c, nd) for c in coords]
    return round(coords, nd)


def export_portal(gdf, id_col, a_cols, b_cols, out_path, b_types=None, context=None,
                  name_col=None, simplify=0.00008, years=None):
    gdf = gdf.to_crs(4326).copy()
    gdf["geometry"] = gdf.geometry.simplify(simplify, preserve_topology=True)
    a_list, b_list = isinstance(a_cols, (list, tuple)), isinstance(b_cols, (list, tuple))
    feats = []
    for _, row in gdf.iterrows():
        props = {"id": str(row[id_col])}
        if name_col:
            props["name"] = str(row[name_col])
        props["a"] = [_num(row[c]) or 0 for c in a_cols] if a_list else (_num(row[a_cols]) or 0)
        props["b"] = [_num(row[c]) or 0 for c in b_cols] if b_list else (_num(row[b_cols]) or 0)
        for key, col in (context or {}).items():
            props[key] = _num(row[col])
        geom = json.loads(gpd.GeoSeries([row.geometry]).to_json())["features"][0]["geometry"]
        geom["coordinates"] = _round(geom["coordinates"])
        feats.append({"type": "Feature", "geometry": geom, "properties": props})
    data = {"features": feats}
    if b_types is not None:
        data["types"] = list(b_types)
    if years is not None:
        data["years"] = list(years)
    js = "window.PORTAL_DATA = " + json.dumps(data, separators=(",", ":")) + ";"
    with open(out_path, "w") as f:
        f.write(js)
    print(f"Wrote {out_path}: {len(feats)} places, {len(js) // 1024} KB")
    if len(js) > 1_500_000:
        print("Over 1.5 MB. Raise `simplify` or keep fewer columns so the page loads fast.")
