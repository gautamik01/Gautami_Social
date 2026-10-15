# LinkedIn draft: Lab 3, evictions and building violations

(Draft in your voice. Edit freely, then swap {LINK} for the live GitHub Pages link.)

---

In Philadelphia, the neighborhoods with the most evictions are often the same ones with the most building code violations.

I found this in a MUSA 5500 lab at Penn, then rebuilt it as something you can actually explore. Across 384 census tracts, the two counts have a correlation of 0.71. More than half of the tracts with the most evictions also rank among the tracts with the most violations. Chance alone would give you a quarter.

Slide through 2003 to 2016, switch between 15 violation types, and hover over any tract to see both maps and the scatter react together.

A few honest caveats: these are raw counts, so bigger tracts have more of both, and this shows a pattern, not a cause. But it points at where tenant support and targeted inspections could matter most.

Built with Python (pandas, GeoPandas) and rebuilt in D3 with Claude's help after the assignment was graded.

Try it yourself: {LINK}

#UrbanPlanning #SpatialAnalysis #Philadelphia #HousingPolicy #DataViz

---

Video idea (20 to 30 seconds): start on the 2012 to 2016 total, hover one dark-teal tract so both maps light up, hit Play to watch 2003 to 2016, then pick "Plumbing systems, general" and end on the 0.47 correlation.
