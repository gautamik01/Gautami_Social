// Gautami's map-portal kit.
// One map of places colored by whether two measures (A and B) are both high, plus a scatter "test".
// A page supplies window.PORTAL_DATA (GeoJSON-like features) and window.PORTAL_CONFIG (names, periods, groups).
// See kit/TEMPLATE.md for the data format and every config option.
(function () {
  "use strict";
  const D = window.PORTAL_DATA, C = window.PORTAL_CONFIG;
  const feats = D.features, N = feats.length;
  const $ = id => document.getElementById(id);
  const fmt = d3.format(","), fmt2 = d3.format(".2f");
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

  // ---------- icons for the B buttons (pick by name in the config) ----------
  const P = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true"';
  const ICONS = {
    all: `<svg viewBox="0 0 24 24" ${P}><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></svg>`,
    layers: `<svg viewBox="0 0 24 24" ${P}><path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/><path d="M3 17.5l9 5 9-5"/></svg>`,
    drop: `<svg viewBox="0 0 24 24" ${P}><path d="M12 3s6 7 6 11.5a6 6 0 0 1-12 0C6 10 12 3 12 3z"/></svg>`,
    bolt: `<svg viewBox="0 0 24 24" ${P}><path d="M13 2L4.5 13.5H11L10 22l8.5-11.5H12z"/></svg>`,
    home: `<svg viewBox="0 0 24 24" ${P}><path d="M3 11.5L12 4l9 7.5"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5h4v5"/></svg>`,
    tree: `<svg viewBox="0 0 24 24" ${P}><path d="M12 3a5 5 0 0 1 4.6 7A4.5 4.5 0 0 1 15 18H9a4.5 4.5 0 0 1-1.6-8A5 5 0 0 1 12 3z"/><path d="M12 13v8"/></svg>`,
    sun: `<svg viewBox="0 0 24 24" ${P}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`,
    bus: `<svg viewBox="0 0 24 24" ${P}><rect x="5" y="3" width="14" height="15" rx="2.5"/><path d="M5 11h14M8 21v-3M16 21v-3"/><circle cx="8.5" cy="14.5" r=".5"/><circle cx="15.5" cy="14.5" r=".5"/></svg>`,
    people: `<svg viewBox="0 0 24 24" ${P}><circle cx="9" cy="8" r="3.5"/><path d="M3 20a6 6 0 0 1 12 0"/><circle cx="17" cy="9" r="2.5"/><path d="M15.5 14.5A5 5 0 0 1 21 19"/></svg>`,
    dollar: `<svg viewBox="0 0 24 24" ${P}><path d="M12 3v18"/><path d="M16.5 7.5C16 6 14.5 5 12 5s-4.5 1.2-4.5 3.2S9.5 11 12 11.5s4.5 1.3 4.5 3.4S14.6 19 12 19s-4.2-1-4.7-2.6"/></svg>`
  };
  const PLAY = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg>';
  const PAUSE = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="4.5" width="4.5" height="15" rx="1"/><rect x="13.5" y="4.5" width="4.5" height="15" rx="1"/></svg>';

  // ---------- config ----------
  const A = C.a, B = C.b, PL = C.place || { one: "neighborhood", many: "neighborhoods" };
  const PERIODS = A.periods ? A.periods.keys : null;                    // e.g. [2012, ..., 2016]
  const pIndex = k => A.periods.index[A.periods.keys.indexOf(k)];       // position inside the A array
  const BTYPES = B.types || D.types || [];
  const GROUPS = (B.groups || []).map(g => ({ ...g, idx: g.idx || g.codes.map(c => BTYPES.indexOf(c)) }));
  GROUPS.forEach(g => { if (g.idx.some(j => j < 0)) console.error("Unknown code in group", g.name); });
  const ALL_IDX = B.groups ? d3.range(BTYPES.length) : null;
  const KEYS = B.groups ? ["ALL"].concat(d3.range(GROUPS.length)) : [];
  const bLabel = k => k === "ALL" ? (B.allName || "All " + B.lower) : GROUPS[k].name;
  const nameFor = C.nameFor || (p => p.name || ("Tract " + parseInt(p.id.slice(5, 9), 10) + (p.id.slice(9, 11) === "00" ? "" : "." + p.id.slice(9, 11))));

  const COL = ["#dfe5ee", "#6fa8dc", "#f2a35c", "#5a1a63"];   // neither, A high, B high, both high
  const VERDICT = ["Neither is high", A.name + " high", B.name + " high", "Both high"];
  const state = { period: "all", group: "ALL", pin: -1 };

  // ---------- values ----------
  const aVal = (p, period) => {
    const v = p[A.field];
    if (!PERIODS) return +v;
    return period === "all" ? d3.sum(PERIODS, k => v[pIndex(k)]) : v[pIndex(period)];
  };
  const bVal = (p, g) => {
    const v = p[B.field];
    if (!B.groups) return +v;
    return d3.sum(g === "ALL" ? ALL_IDX : GROUPS[g].idx, j => v[j]);
  };
  const series = (period, g) => {
    const a = new Float64Array(N), b = new Float64Array(N);
    for (let i = 0; i < N; i++) { const p = feats[i].properties; a[i] = aVal(p, period); b[i] = bVal(p, g); }
    return [a, b];
  };
  function pearson(x, y) {
    const mx = d3.mean(x), my = d3.mean(y); let sxy = 0, sxx = 0, syy = 0;
    for (let i = 0; i < x.length; i++) { const u = x[i] - mx, w = y[i] - my; sxy += u * w; sxx += u * u; syy += w * w; }
    return sxx && syy ? sxy / Math.sqrt(sxx * syy) : 0;
  }
  let av, bv, cls = new Uint8Array(N), aSorted, bSorted, qA, qB, counts;
  function compute() {
    [av, bv] = series(state.period, state.group);
    aSorted = Array.from(av).sort(d3.ascending); bSorted = Array.from(bv).sort(d3.ascending);
    qA = d3.quantileSorted(aSorted, 0.75); qB = d3.quantileSorted(bSorted, 0.75);
    counts = [0, 0, 0, 0];
    for (let i = 0; i < N; i++) { cls[i] = (av[i] >= qA && av[i] > 0 ? 1 : 0) + (bv[i] >= qB && bv[i] > 0 ? 2 : 0); counts[cls[i]]++; }
  }
  const pctBelow = (sorted, v) => Math.round(100 * d3.bisectLeft(sorted, v) / N);
  const periodText = () => state.period === "all" ? (A.periods ? A.periods.allText : "") : String(state.period);

  // ---------- fixed text from the config ----------
  $("bHead").textContent = B.name;
  $("placeHead").textContent = cap(PL.one);
  $("emptyCard").textContent = `Hover or tap any ${PL.one} on the map to see its numbers.`;
  $("lBoth").textContent = `${PL.many} are high on both`;
  $("lOver").textContent = `of the top ${A.lower} ${PL.many} are also top ${B.lower} ${PL.many}. Chance would give 25%.`;
  $("lCorr").textContent = "correlation, where 1 is a perfect match";
  if (!B.groups) $("bBlock").hidden = true;

  // ---------- period rail ----------
  if (PERIODS) {
    const opts = [["all", A.periods.allLabel || "All"]].concat(PERIODS.map(k => [k, String(k)]));
    $("periods").innerHTML = opts.map(([v, t]) => `<input type="radio" name="per" id="per-${v}" value="${v}"${v === "all" ? " checked" : ""}><label for="per-${v}">${t}</label>`).join("");
  } else { $("periodBlock").hidden = true; $("ybarsBlock").hidden = true; }

  // ---------- map ----------
  const W = 600, H = 640;
  const proj = d3.geoMercator().fitExtent([[6, 6], [W - 6, H - 6]], { type: "FeatureCollection", features: feats });
  const geo = d3.geoPath(proj);
  const svg = d3.select("#map").attr("viewBox", `0 0 ${W} ${H}`);
  const paths = svg.append("g").selectAll("path").data(feats).join("path").attr("class", "tract").attr("d", geo).attr("fill", COL[0]);
  const pinPath = svg.append("path").attr("class", "pinp");
  const hlPath = svg.append("path").attr("class", "hl");

  // ---------- B buttons ----------
  $("chips").innerHTML = KEYS.map(k => {
    const g = k === "ALL" ? { icon: "all", name: bLabel("ALL"), desc: B.allDesc || "" } : GROUPS[k];
    return `<button type="button" class="chip" data-k="${k}" aria-pressed="false" title="${g.desc || ""}">${ICONS[g.icon] || ICONS.all}<span class="nm">${g.name}</span><span class="r"></span></button>`;
  }).join("");
  const chips = Array.from(document.querySelectorAll(".chip"));

  // ---------- 2 x 2 legend: up = more A, right = more B ----------
  const CELLS = [1, 3, 0, 2];
  $("biv").innerHTML = `<span class="ylab">More ${A.lower} &rarr;</span><div class="grid">` +
    CELLS.map(c => `<button type="button" class="cell ${c === 3 ? "dark" : "light"}" data-c="${c}" style="background:${COL[c]}" aria-label="${VERDICT[c]}"><b>0</b><span>${VERDICT[c]}</span></button>`).join("") +
    `</div><span class="xlab">More ${B.lower} &rarr;</span>`;
  const cells = Array.from(document.querySelectorAll(".cell"));
  const focusClass = c => paths.attr("opacity", (d, i) => c < 0 || cls[i] === c ? 1 : 0.15);
  cells.forEach(el => {
    const c = +el.dataset.c;
    el.addEventListener("pointerenter", () => focusClass(c)); el.addEventListener("focus", () => focusClass(c));
    el.addEventListener("pointerleave", () => focusClass(-1)); el.addEventListener("blur", () => focusClass(-1));
  });

  // ---------- scatter ----------
  const SW = 600, SH = 420, M = { l: 52, r: 16, t: 14, b: 44 };
  const sc = d3.select("#scatter").attr("viewBox", `0 0 ${SW} ${SH}`);
  const sx = d3.scaleLinear().range([M.l, SW - M.r]), sy = d3.scaleLinear().range([SH - M.b, M.t]);
  const gGrid = sc.append("g").attr("class", "grid");
  const qBox = sc.append("rect").attr("fill", COL[3]).attr("opacity", 0.07).attr("rx", 6);
  const qTxt = sc.append("text").attr("class", "qlabel").text("Both high");
  const gx = sc.append("g").attr("class", "axis").attr("transform", `translate(0,${SH - M.b})`);
  const gy = sc.append("g").attr("class", "axis").attr("transform", `translate(${M.l},0)`);
  const xTitle = sc.append("text").attr("class", "axis-title").attr("x", (M.l + SW - M.r) / 2).attr("y", SH - 6).attr("text-anchor", "middle");
  const yTitle = sc.append("text").attr("class", "axis-title").attr("transform", "rotate(-90)").attr("x", -(M.t + SH - M.b) / 2).attr("y", 14).attr("text-anchor", "middle");
  const fit = sc.append("line").attr("stroke", "#14213d").attr("stroke-dasharray", "6 5").attr("stroke-width", 1.6);
  const fitTxt = sc.append("text").attr("class", "fitlabel").text("Trend line");
  const dots = sc.append("g").selectAll("circle").data(d3.range(N)).join("circle").attr("class", "dot").attr("r", 4.4);
  const ringH = sc.append("circle").attr("r", 8).attr("fill", "none").attr("stroke", "#14213d").attr("stroke-width", 2.4).style("display", "none").style("pointer-events", "none");
  const ringP = sc.append("circle").attr("r", 9.5).attr("fill", "none").attr("stroke", "#14213d").attr("stroke-width", 2.4).attr("stroke-dasharray", "4 3").style("display", "none").style("pointer-events", "none");
  let delaunay = null;
  function drawFit() {
    const mx = d3.mean(bv), my = d3.mean(av); let sxy = 0, sxx = 0;
    for (let i = 0; i < N; i++) { sxy += (bv[i] - mx) * (av[i] - my); sxx += (bv[i] - mx) ** 2; }
    const b = sxx ? sxy / sxx : 0, a = my - b * mx;
    let x0 = 0, x1 = sx.domain()[1];
    if (a < 0 && b > 0) x0 = -a / b;
    const yMax = sy.domain()[1]; if (b > 0 && a + b * x1 > yMax) x1 = (yMax - a) / b;
    fit.attr("x1", sx(x0)).attr("y1", sy(a + b * x0)).attr("x2", sx(x1)).attr("y2", sy(a + b * x1));
    const xl = x0 + (x1 - x0) * 0.82; fitTxt.attr("x", sx(xl) + 6).attr("y", sy(a + b * xl) + 22);
  }

  // ---------- update ----------
  function update(animate) {
    compute();
    const dur = animate ? 400 : 0;
    paths.transition().duration(dur).attr("fill", (d, i) => COL[cls[i]]);

    let nTop = 0, both = 0;
    for (let i = 0; i < N; i++) if (av[i] >= qA) { nTop++; if (bv[i] >= qB) both++; }
    $("rBoth").textContent = counts[3];
    $("rOver").textContent = Math.round(100 * both / nTop) + "%";
    $("rCorr").textContent = fmt2(pearson(av, bv));
    cells.forEach(el => { el.querySelector("b").textContent = counts[+el.dataset.c]; });

    chips.forEach(btn => {
      const k = btn.dataset.k === "ALL" ? "ALL" : +btn.dataset.k;
      const [x, y] = series(state.period, k), r = pearson(x, y);
      btn.querySelector(".r").textContent = fmt2(r);
      btn.setAttribute("aria-pressed", String(String(k) === String(state.group)));
      btn.setAttribute("aria-label", `${bLabel(k)}, match with ${A.lower} ${fmt2(r)}`);
    });

    sx.domain([0, d3.max(bv) * 1.04 || 1]).nice(); sy.domain([0, d3.max(av) * 1.06 || 1]).nice();
    gx.call(d3.axisBottom(sx).ticks(6).tickSizeOuter(0)); gy.call(d3.axisLeft(sy).ticks(5).tickSizeOuter(0));
    gGrid.attr("transform", `translate(${M.l},0)`).call(d3.axisLeft(sy).ticks(5).tickSize(-(SW - M.l - M.r)).tickFormat(""));
    xTitle.text((B.groups ? bLabel(state.group) : B.name) + (B.xSuffix || ""));
    yTitle.text(A.name + (periodText() ? ", " + periodText() : ""));
    dots.sort((x, y) => cls[x] - cls[y]).transition().duration(dur).attr("cx", i => sx(bv[i])).attr("cy", i => sy(av[i])).attr("fill", i => COL[cls[i]]);
    qBox.attr("x", sx(qB)).attr("y", M.t).attr("width", Math.max(0, SW - M.r - sx(qB))).attr("height", Math.max(0, sy(qA) - M.t));
    qTxt.attr("x", sx(qB) + 10).attr("y", M.t + 18);
    drawFit();
    delaunay = d3.Delaunay.from(d3.range(N).map(i => [sx(bv[i]), sy(av[i])]));

    if (PERIODS) {
      const yr = PERIODS.map(k => { const [x, y] = series(k, state.group); return pearson(x, y); });
      $("ybars").innerHTML = PERIODS.map((k, j) => `<div><em>${fmt2(yr[j])}</em><i class="${String(k) === String(state.period) ? "on" : ""}" style="height:${Math.max(4, yr[j] * 56)}px"></i><span>${k}</span></div>`).join("");
    }
    focusClass(-1);
    drawPin(); if (state.pin >= 0) card(state.pin, true);
    if (hoverI >= 0) setHover(hoverI, null);
  }

  // ---------- selected-place card ----------
  const ctxFmt = (v, u) => v == null ? "n/a" : u === "$" ? "$" + fmt(v) : u === "%" ? v + "%" : fmt(v);
  function card(i, pinned) {
    const el = $("pop");
    $("emptyCard").hidden = i >= 0; $("popClose").hidden = !pinned;
    if (i < 0) { el.hidden = true; return; }
    const p = feats[i].properties, c = cls[i], pa = pctBelow(aSorted, av[i]), pb = pctBelow(bSorted, bv[i]);
    const ctx = (C.context || []).map(x => `<div><dt>${x.label}</dt><dd>${ctxFmt(p[x.key], x.unit)}</dd></div>`).join("");
    $("popBody").innerHTML = `<p class="tname">${nameFor(p)}${pinned ? ' <span class="pinned">Pinned</span>' : ""}</p><span class="verdict c${c}">${VERDICT[c]}</span>
      <div class="meter"><div class="mr"><span>${A.name}</span><b>${fmt(av[i])}</b></div><div class="mbar"><i style="width:${pa}%;background:var(--ev)"></i></div><small>More than ${pa}% of ${PL.many}</small></div>
      <div class="meter"><div class="mr"><span>${B.name}</span><b>${fmt(bv[i])}</b></div><div class="mbar"><i style="width:${pb}%;background:var(--vi)"></i></div><small>More than ${pb}% of ${PL.many}</small></div>
      ${ctx ? `<dl class="ctxl">${ctx}</dl>` : ""}`;
    el.hidden = false;
  }

  // ---------- hover and pin ----------
  let hoverI = -1;
  const tip = $("tip");
  function setHover(i, evt) {
    hoverI = i; if (state.pin < 0) card(i, false);
    hlPath.attr("d", geo(feats[i]));
    ringH.style("display", null).attr("cx", sx(bv[i])).attr("cy", sy(av[i]));
    tip.innerHTML = `<b>${nameFor(feats[i].properties)}</b><br><span class="verdict c${cls[i]}" style="margin:4px 0 6px">${VERDICT[cls[i]]}</span><div class="row"><span>${A.name}</span><span class="num">${fmt(av[i])}</span></div><div class="row"><span>${B.name}</span><span class="num">${fmt(bv[i])}</span></div>`;
    tip.classList.add("on");
    if (evt) moveTip(evt.clientX, evt.clientY);
  }
  function moveTip(x, y) {
    const w = tip.offsetWidth, h = tip.offsetHeight; let left = x + 16, top = y + 16;
    if (left + w > innerWidth - 8) left = x - w - 16; if (top + h > innerHeight - 8) top = y - h - 16;
    tip.style.left = Math.max(8, left) + "px"; tip.style.top = Math.max(8, top) + "px";
  }
  function clearHover() { if (state.pin < 0) card(-1, false); hoverI = -1; hlPath.attr("d", null); ringH.style("display", "none"); tip.classList.remove("on"); }
  function drawPin() {
    const i = state.pin;
    if (i < 0) { pinPath.attr("d", null); ringP.style("display", "none"); return; }
    pinPath.attr("d", geo(feats[i])); ringP.style("display", null).attr("cx", sx(bv[i])).attr("cy", sy(av[i]));
  }
  function togglePin(i) { state.pin = state.pin === i ? -1 : i; drawPin(); card(state.pin >= 0 ? state.pin : (hoverI >= 0 ? hoverI : -1), state.pin >= 0); }
  paths.on("pointerenter pointermove", (e, d) => setHover(feats.indexOf(d), e)).on("pointerleave", clearHover).on("click", (e, d) => togglePin(feats.indexOf(d)));
  sc.on("pointermove", e => {
    const [mx, my] = d3.pointer(e, sc.node()), k = delaunay.find(mx, my);
    const dx = sx(bv[k]) - mx, dy = sy(av[k]) - my;
    if (dx * dx + dy * dy < 32 * 32) setHover(k, e); else clearHover();
  }).on("pointerleave", clearHover).on("click", () => { if (hoverI >= 0) togglePin(hoverI); });
  $("popClose").addEventListener("click", () => togglePin(state.pin));
  document.addEventListener("keydown", e => { if (e.key === "Escape" && state.pin >= 0) togglePin(state.pin); });

  // ---------- controls ----------
  const playBtn = $("play");
  let timer = null;
  function playUi(on) { playBtn.setAttribute("aria-pressed", String(on)); playBtn.setAttribute("aria-label", on ? "Pause" : "Play through the periods"); playBtn.title = on ? "Pause" : "Play"; playBtn.innerHTML = on ? PAUSE : PLAY; }
  function stopPlay() { if (timer) { clearInterval(timer); timer = null; } playUi(false); }
  function setPeriod(v, animate) { state.period = v; const r = document.querySelector(`input[name=per][value="${v}"]`); if (r) r.checked = true; update(animate); }
  document.querySelectorAll("input[name=per]").forEach(r => r.addEventListener("change", e => { stopPlay(); const v = e.target.value; setPeriod(v === "all" ? "all" : (isNaN(+v) ? v : +v), true); }));
  chips.forEach(btn => btn.addEventListener("click", () => { state.group = btn.dataset.k === "ALL" ? "ALL" : +btn.dataset.k; update(true); }));
  if (PERIODS) playBtn.addEventListener("click", () => {
    if (timer) { stopPlay(); return; }
    playUi(true); let j = 0; setPeriod(PERIODS[0], true);
    timer = setInterval(() => { j++; if (j >= PERIODS.length) { stopPlay(); setPeriod("all", true); return; } setPeriod(PERIODS[j], true); }, 1300);
  });

  playUi(false); update(false);
})();
