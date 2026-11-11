/* Homepage script: live mini-demos and the Boulder clock.
   Every demo number comes from Liam's project pages. Mount a demo with:
   <div data-demo="ai"></div>  <div data-demo="contoso"></div>  <div data-demo="fair"></div> */
(function () {
  var AI = {
    conds: [
      { id: "A", name: "Schema only", note: "The models write raw SQL from table names. The best one gets 36.7% right." },
      { id: "B", name: "Schema + docs", note: "Column descriptions help qwen reach 46.7%, but not the other two models." },
      { id: "C", name: "Semantic layer", note: "Metrics are defined once. qwen jumps to 61.7%; the weaker models can't use the layer well." }
    ],
    models: [
      ["qwen2.5-coder 3B", [36.7, 46.7, 61.7]],
      ["llama3.2 3B", [30.0, 28.3, 23.3]],
      ["gemma3 4B", [31.7, 28.3, 23.3]]
    ]
  };
  var PROFIT = [
    ["Computers", 1.57], ["Home appliances", 0.69], ["Cell phones", 0.67], ["TV and video", 0.54],
    ["Music, movies, books", 0.27], ["Cameras", 0.26], ["Audio", 0.07], ["Games and toys", 0.03]
  ];
  var SQL = "SELECT p.CategoryName,\n       SUM(s.Quantity * (s.NetPrice - s.UnitCost)) AS Profit\nFROM factSales AS s\nJOIN dimProduct AS p ON s.ProductKey = p.ProductKey\nGROUP BY p.CategoryName\nORDER BY Profit DESC;";
  var FAIR = {
    race: { label: "By race", gap: "11.5", note: "Looked at by race alone, the gap in wrongful flags is 11.5 points.", rows: [
      ["Native American", 26.0], ["Black", 17.2], ["White", 15.7], ["Asian", 14.8], ["Hispanic", 14.5]] },
    inter: { label: "By race × sex", gap: "27.9", note: "Crossed with sex, the gap grows to 27.9 points: Native American men 32.8% vs Hispanic women 4.9%.", rows: [
      ["Native American men", 32.8], ["Black men", 21], ["White men", 19], ["Asian men", 17], ["Hispanic men", 16],
      ["Native American women", 14], ["White women", 6], ["Black women", 5], ["Hispanic women", 4.9], ["Asian women", 2, true]] }
  };

  function h(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  function toggle(options, onPick, label) {
    var g = h("div", "d-toggle"); g.setAttribute("role", "group"); g.setAttribute("aria-label", label);
    var btns = options.map(function (o, i) {
      var b = h("button", null, o); b.type = "button";
      b.addEventListener("click", function () { pick(i); });
      g.appendChild(b); return b;
    });
    function pick(i) { btns.forEach(function (b, j) { b.setAttribute("aria-pressed", String(i === j)); }); onPick(i); }
    g.pick = pick; return g;
  }

  function bars(rows, max, fmt) {
    var list = h("div", "d-bars");
    rows.forEach(function (r) {
      var row = h("div", "d-row");
      row.appendChild(h("span", "d-label", r[0]));
      var track = h("span", "d-track"), bar = h("span", "d-bar");
      track.appendChild(bar); row.appendChild(track);
      var val = h("span", "d-val");
      row.appendChild(val); list.appendChild(row);
      row._bar = bar; row._val = val;
    });
    list.set = function (values) {
      [].forEach.call(list.children, function (row, i) {
        row._bar.style.transform = "scaleX(" + (values[i] / max) + ")";
        row._val.textContent = fmt(values[i]);
      });
    };
    return list;
  }

  function demoAI(el) {
    var read = h("p", "d-read"); read.setAttribute("aria-live", "polite");
    var chart = bars(AI.models, 100, function (v) { return v.toFixed(1) + "%"; });
    var t = toggle(AI.conds.map(function (c) { return c.id + " · " + c.name; }), function (i) {
      chart.set(AI.models.map(function (m) { return m[1][i]; }));
      read.textContent = AI.conds[i].note;
      el.dataset.state = AI.conds[i].id;
    }, "How the model sees the data");
    el.append(h("p", "d-cap", "Share of 60 business questions answered correctly"), t, chart, read);
    t.pick(0);
  }

  // Contoso: a question explorer. Pick a question; the star schema lights up the table it uses,
  // and the answer appears with a chart made for that question. Numbers are from the Power BI report.
  var REPEAT_SQL = "SELECT c.GivenName, c.Surname,\n       COUNT(DISTINCT s.OrderKey) AS Orders\nFROM factSales AS s\nJOIN dimCustomer AS c ON s.CustomerKey = c.CustomerKey\nGROUP BY c.CustomerKey, c.GivenName, c.Surname\nHAVING COUNT(DISTINCT s.OrderKey) > 1;";
  var QUESTIONS = [
    { id: "product", q: "Which category earns the most?", table: "dimProduct",
      answer: "Computers earn $1.57M in profit, more than twice any other category.", sql: SQL, chart: "category" },
    { id: "store", q: "Online or in-store?", table: "dimStore",
      answer: "The online store alone outsold every physical store combined.", chart: "store" },
    { id: "date", q: "How did sales change by year?", table: "OrderDate",
      answer: "2022 was the peak at $3.18M in revenue. Profit followed revenue every year.", chart: "year" },
    { id: "customer", q: "Who comes back?", table: "dimCustomer",
      answer: "74 customers ordered more than once and spent $319K, mostly on computers.", sql: REPEAT_SQL, chart: "repeat" }
  ];
  var YEARS = [["2021", 1.17, 0.66], ["2022", 3.18, 1.78], ["2023", 2.43, 1.37], ["2024*", 0.52, 0.29]];

  function schema() {
    var NS = "http://www.w3.org/2000/svg";
    var s = document.createElementNS(NS, "svg");
    s.setAttribute("viewBox", "0 0 400 150"); s.setAttribute("class", "c-schema"); s.setAttribute("aria-hidden", "true");
    var boxes = { dimStore: [145, 4], dimProduct: [8, 59], dimCustomer: [282, 59], OrderDate: [145, 114] };
    var html = "";
    Object.keys(boxes).forEach(function (k) {
      var b = boxes[k], cx = b[0] + 55, cy = b[1] + 16;
      html += '<line data-t="' + k + '" x1="200" y1="75" x2="' + cx + '" y2="' + cy + '"/>';
    });
    html += '<rect class="fact" x="145" y="59" width="110" height="32" rx="6"/><text x="200" y="79">factSales</text>';
    Object.keys(boxes).forEach(function (k) {
      var b = boxes[k];
      html += '<g data-t="' + k + '"><rect x="' + b[0] + '" y="' + b[1] + '" width="110" height="32" rx="6"' +
        (k === "OrderDate" ? ' stroke-dasharray="4 3"' : "") + '/><text x="' + (b[0] + 55) + '" y="' + (b[1] + 20) + '">' + k + "</text></g>";
    });
    s.innerHTML = html;
    return s;
  }

  function miniChart(kind) {
    var box = h("div", "c-chart");
    if (kind === "category") {
      var list = bars(PROFIT.slice(0, 5), 1.6, function (v) { return "$" + v.toFixed(2) + "M"; });
      list.set(PROFIT.slice(0, 5).map(function (p) { return p[1]; }));
      box.append(list, h("p", "c-note", "Top 5 of 8 categories, profit 2021–2024"));
    } else if (kind === "store") {
      var split = h("div", "c-split");
      [["Online store", 3.92], ["All physical stores", 3.38]].forEach(function (p, i) {
        var part = h("div", "c-part" + (i ? " alt" : ""));
        part.style.flex = p[1];
        part.append(h("b", null, "$" + p[1].toFixed(2) + "M"), h("span", null, p[0]));
        split.appendChild(part);
      });
      box.append(split, h("p", "c-note", "Revenue 2021–2024. Online is 54% of $7.30M."));
    } else if (kind === "year") {
      var cols = h("div", "c-cols");
      YEARS.forEach(function (y) {
        var col = h("div", "c-col");
        var stack = h("div", "c-stack");
        var rev = h("span", "c-rev"); rev.style.height = (y[1] / 3.2 * 100) + "%";
        var pro = h("span", "c-pro"); pro.style.height = (y[2] / 3.2 * 100) + "%";
        stack.append(rev, pro);
        col.append(h("b", null, "$" + y[1].toFixed(2) + "M"), stack, h("span", null, y[0]));
        cols.appendChild(col);
      });
      box.append(cols, h("p", "c-note", "Outlined bar: revenue · filled bar: profit · *2024 runs through April"));
    } else {
      var big = h("div", "c-big");
      big.append(h("b", null, "74"), h("span", null, "repeat customers"), h("b", null, "$319K"), h("span", null, "their revenue, 4.4% of the total"));
      box.append(big, h("p", "c-note", "Repeat = more than one distinct order. Most frequent: three orders each."));
    }
    return box;
  }

  function demoContoso(el) {
    var svg = schema();
    var tabs = h("div", "c-qs"); tabs.setAttribute("role", "group"); tabs.setAttribute("aria-label", "Pick a business question");
    var out = h("div", "c-out"); out.setAttribute("aria-live", "polite");
    var btns = QUESTIONS.map(function (Q, i) {
      var b = h("button", null, Q.q); b.type = "button";
      b.addEventListener("click", function () { pick(i); });
      tabs.appendChild(b); return b;
    });
    function pick(i) {
      var Q = QUESTIONS[i];
      btns.forEach(function (b, j) { b.setAttribute("aria-pressed", String(i === j)); });
      [].forEach.call(svg.querySelectorAll("[data-t]"), function (n) { n.classList.toggle("on", n.getAttribute("data-t") === Q.table); });
      out.textContent = "";
      var head = h("p", "c-answer", Q.answer);
      var via = h("p", "c-via");
      via.innerHTML = "Joins <code>factSales</code> to <code>" + Q.table + "</code>" + (Q.table === "OrderDate" ? " (a date column on the fact table)" : "");
      out.append(head, via, miniChart(Q.chart));
      if (Q.sql) {
        var d = h("details", "c-sqlbox"), sm = h("summary", null, "Show the SQL"), pre = h("pre", "d-sql");
        pre.textContent = Q.sql; d.append(sm, pre); out.appendChild(d);
      }
    }
    el.append(h("p", "d-cap", "Pick a question. The star schema shows which table answers it."), svg, tabs, out);
    pick(0);
  }

  function demoFair(el) {
    var read = h("p", "d-read"); read.setAttribute("aria-live", "polite");
    var plot = h("div", "d-dots");
    var axis = h("div", "d-drow d-axis"), ticks = h("span", "d-ticks");
    [0, 10, 20, 30].forEach(function (v) { var s = h("span", null, v + "%"); s.style.left = (v / 35 * 100) + "%"; ticks.appendChild(s); });
    axis.append(h("span"), ticks, h("span"));
    var gap = h("p", "d-gap");
    var keys = ["race", "inter"];
    var t = toggle([FAIR.race.label, FAIR.inter.label], function (i) {
      var d = FAIR[keys[i]];
      plot.textContent = "";
      d.rows.forEach(function (r) {
        var row = h("div", "d-drow" + (r[2] ? " is-small" : ""));
        row.appendChild(h("span", "d-label", r[0]));
        var track = h("span", "d-track"), dot = h("span", "d-dot");
        dot.style.left = (r[1] / 35 * 100) + "%";
        track.appendChild(dot); row.appendChild(track);
        row.appendChild(h("span", "d-val", r[2] ? r[1] + "%*" : r[1] + "%"));
        plot.appendChild(row);
      });
      gap.innerHTML = "Gap: <b>" + d.gap + " pts</b>" + (i ? " <span>* small sample, not counted</span>" : "");
      read.textContent = d.note;
    }, "Group the defendants");
    el.append(h("p", "d-cap", "Wrongly flagged as high-risk (false positive rate)"), t, plot, axis, gap, read);
    t.pick(0);
  }

  var MAKERS = { ai: demoAI, contoso: demoContoso, fair: demoFair };
  document.querySelectorAll("[data-demo]").forEach(function (el) {
    el.classList.add("demo");
    MAKERS[el.dataset.demo](el);
  });
})();



/* Live time in Boulder. */
(function () {
  var el = document.getElementById("boulder-time");
  if (!el) return;
  var fmt = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/Denver" });
  function tick() { el.textContent = fmt.format(new Date()); }
  tick(); setInterval(tick, 30000);
  el.parentNode.hidden = false;
})();
