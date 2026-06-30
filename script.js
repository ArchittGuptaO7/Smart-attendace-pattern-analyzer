const chartPalette = {
  blue: "#39a7ff",
  cyan: "#2ff3e0",
  purple: "#8a5cff",
  pink: "#ff5cc8",
  green: "#7dffb2",
  amber: "#ffd166",
  danger: "#ff6b8b",
  grid: "rgba(170, 181, 214, 0.12)",
  text: "#aab5d6"
};

const chartDefaults = {
  color: chartPalette.text,
  font: {
    family: "Inter, sans-serif",
    weight: 700
  }
};

const insightData = {
  heatmap: {
    kicker: "Heatmap Preview",
    title: "Attendance Heatmaps",
    description: "Weekday and course intensity patterns make low-participation windows easy to detect at a glance.",
    visual: "heatmap",
    metrics: [
      ["94%", "Strongest attendance cell"],
      ["58%", "Weakest attendance cell"],
      ["Friday", "Lowest weekday pattern"]
    ]
  },
  correlation: {
    kicker: "Correlation Preview",
    title: "Correlation Matrix",
    description: "Relationships between exam proximity, holiday gaps, weekday slots and attendance percentage are shown as an analytics matrix.",
    visual: "correlation",
    metrics: [
      ["0.71", "Exam proximity relationship"],
      ["-0.48", "Holiday gap effect"],
      ["0.63", "Course consistency signal"]
    ]
  },
  trend: {
    kicker: "Trend Preview",
    title: "Attendance Trend",
    description: "Timeline analysis highlights recovery after holidays, dips before examinations and late-semester stabilization.",
    visual: "trend",
    metrics: [
      ["12", "Weeks tracked"],
      ["+8.5%", "Late-semester lift"],
      ["W7", "Largest attendance dip"]
    ]
  },
  network: {
    kicker: "Network Preview",
    title: "Student Co-Absence Network",
    description: "Connected clusters reveal students who are repeatedly absent together, helping identify social attendance behavior.",
    visual: "network",
    metrics: [
      ["4", "Detected clusters"],
      ["18", "Strong co-absence links"],
      ["0.62", "Network density score"]
    ]
  },
  distribution: {
    kicker: "Distribution Preview",
    title: "Attendance Distribution Plot",
    description: "Distribution summaries separate present, absent, holiday and exam-buffer records for quick data quality review.",
    visual: "distribution",
    metrics: [
      ["72%", "Present records"],
      ["18%", "Absent records"],
      ["10%", "Contextual records"]
    ]
  }
};

window.addEventListener("load", () => {
  document.querySelector("#loader")?.classList.add("hidden");
});

if (window.AOS) {
  AOS.init({
    duration: 850,
    easing: "ease-out-cubic",
    once: true,
    offset: 80
  });
}

if (window.Chart) {
  Chart.defaults.color = chartDefaults.color;
  Chart.defaults.font.family = chartDefaults.font.family;
  Chart.defaults.font.weight = chartDefaults.font.weight;
  Chart.defaults.plugins.legend.labels.usePointStyle = true;
  Chart.defaults.plugins.tooltip.backgroundColor = "rgba(5, 7, 19, 0.92)";
  Chart.defaults.plugins.tooltip.borderColor = "rgba(145, 171, 255, 0.28)";
  Chart.defaults.plugins.tooltip.borderWidth = 1;
}

const gradient = (ctx, top, bottom) => {
  const area = ctx.chart.chartArea;
  if (!area) return top;
  const fill = ctx.chart.ctx.createLinearGradient(0, area.top, 0, area.bottom);
  fill.addColorStop(0, top);
  fill.addColorStop(1, bottom);
  return fill;
};

function createCharts() {
  const gauge = document.querySelector("#gaugeChart");
  const weekly = document.querySelector("#weeklyChart");
  const course = document.querySelector("#courseChart");
  const distribution = document.querySelector("#distributionChart");
  const presence = document.querySelector("#presenceChart");

  if (!window.Chart || !gauge || !weekly || !course || !distribution || !presence) return;

  new Chart(gauge, {
    type: "doughnut",
    data: {
      labels: ["Present", "Gap"],
      datasets: [
        {
          data: [82.4, 17.6],
          borderWidth: 0,
          cutout: "78%",
          circumference: 220,
          rotation: 250,
          backgroundColor: [chartPalette.cyan, "rgba(255,255,255,0.09)"]
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      }
    }
  });

  new Chart(weekly, {
    type: "line",
    data: {
      labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12"],
      datasets: [
        {
          label: "Attendance %",
          data: [76, 81, 79, 84, 88, 74, 69, 83, 86, 91, 87, 92],
          borderColor: chartPalette.cyan,
          backgroundColor: (ctx) => gradient(ctx, "rgba(47, 243, 224, 0.34)", "rgba(47, 243, 224, 0.01)"),
          fill: true,
          tension: 0.42,
          pointRadius: 4,
          pointHoverRadius: 7,
          pointBackgroundColor: chartPalette.blue
        },
        {
          label: "Target",
          data: Array(12).fill(75),
          borderColor: "rgba(255, 209, 102, 0.85)",
          borderDash: [7, 7],
          pointRadius: 0,
          tension: 0
        }
      ]
    },
    options: lineOptions()
  });

  new Chart(course, {
    type: "bar",
    data: {
      labels: ["ML", "DBMS", "Stats", "DSA", "OS", "AI"],
      datasets: [
        {
          label: "Attendance %",
          data: [96, 84, 78, 73, 68, 89],
          borderRadius: 8,
          backgroundColor: [chartPalette.cyan, chartPalette.blue, chartPalette.purple, chartPalette.pink, chartPalette.danger, chartPalette.green]
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: baseScales({ beginAtZero: true, suggestedMax: 100 })
    }
  });

  new Chart(distribution, {
    type: "doughnut",
    data: {
      labels: ["Present", "Absent", "Holiday", "Exam Buffer"],
      datasets: [
        {
          data: [72, 18, 6, 4],
          borderWidth: 0,
          cutout: "68%",
          backgroundColor: [chartPalette.cyan, chartPalette.purple, chartPalette.amber, chartPalette.pink]
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: { padding: 16 }
        }
      }
    }
  });

  new Chart(presence, {
    type: "line",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      datasets: [
        {
          label: "Observed Presence",
          data: [88, 84, 91, 86, 64, 71],
          borderColor: chartPalette.blue,
          backgroundColor: (ctx) => gradient(ctx, "rgba(57, 167, 255, 0.3)", "rgba(57, 167, 255, 0.02)"),
          fill: true,
          tension: 0.4,
          pointBackgroundColor: chartPalette.blue
        },
        {
          label: "Expected Presence",
          data: [82, 82, 83, 82, 80, 78],
          borderColor: chartPalette.green,
          backgroundColor: "transparent",
          tension: 0.4,
          pointBackgroundColor: chartPalette.green
        }
      ]
    },
    options: lineOptions()
  });
}

function baseScales(extraY = {}) {
  return {
    x: {
      grid: { color: chartPalette.grid },
      ticks: { color: chartPalette.text }
    },
    y: {
      ...extraY,
      grid: { color: chartPalette.grid },
      ticks: { color: chartPalette.text }
    }
  };
}

function lineOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "index"
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: { padding: 16 }
      }
    },
    scales: baseScales({ beginAtZero: false, suggestedMin: 55, suggestedMax: 100 })
  };
}

function buildHeatmap() {
  const heatmap = document.querySelector("#heatmap");
  if (!heatmap) return;

  const values = [
    82, 88, 79, 91, 68, 62, 74,
    86, 92, 83, 77, 71, 66, 80,
    75, 81, 89, 94, 72, 58, 69,
    90, 84, 87, 79, 76, 64, 73
  ];

  heatmap.innerHTML = values
    .map((value) => {
      const hue = value >= 85 ? "178, 243, 224" : value >= 75 ? "57, 167, 255" : value >= 65 ? "255, 209, 102" : "255, 107, 139";
      const alpha = Math.min(0.95, Math.max(0.28, value / 100));
      return `<span class="heat-cell" style="background: rgba(${hue}, ${alpha})" title="${value}% attendance">${value}</span>`;
    })
    .join("");
}

function setupInsightModal() {
  const modal = document.querySelector("#insightModal");
  const title = document.querySelector("#insightTitle");
  const kicker = document.querySelector("#insightKicker");
  const description = document.querySelector("#insightDescription");
  const visual = document.querySelector("#insightVisual");
  const metrics = document.querySelector("#insightMetrics");
  const closeButton = document.querySelector("#closeInsight");

  if (!modal || !title || !kicker || !description || !visual || !metrics) return;

  document.querySelectorAll("[data-insight]").forEach((card) => {
    card.addEventListener("click", () => {
      const data = insightData[card.dataset.insight];
      if (!data) return;

      kicker.textContent = data.kicker;
      title.textContent = data.title;
      description.textContent = data.description;
      visual.innerHTML = renderInsightVisual(data.visual);
      metrics.innerHTML = data.metrics.map(([value, label]) => `<div><strong>${value}</strong><span>${label}</span></div>`).join("");
      modal.showModal();
    });
  });

  closeButton?.addEventListener("click", () => modal.close());
  modal.addEventListener("click", (event) => {
    if (event.target === modal) modal.close();
  });
}

function renderInsightVisual(type) {
  if (type === "network") return renderNetworkPreview();
  if (type === "trend") return renderTrendPreview();
  if (type === "distribution") return `<div class="preview-distribution"><div class="distribution-ring"></div></div>`;

  const values = type === "correlation"
    ? [1, 0.62, -0.24, 0.71, -0.48, 0.36, 0.58, -0.12, 0.62, 1, 0.31, 0.44, -0.22, 0.67, 0.18, 0.29, -0.24, 0.31, 1, -0.36, 0.52, 0.41, -0.19, 0.63, 0.71, 0.44, -0.36, 1, -0.58, 0.27, 0.46, 0.35, -0.48, -0.22, 0.52, -0.58, 1, -0.31, 0.16, 0.22, 0.36, 0.67, 0.41, 0.27, -0.31, 1, 0.49, 0.59, 0.58, 0.18, -0.19, 0.46, 0.16, 0.49, 1, 0.33, -0.12, 0.29, 0.63, 0.35, 0.22, 0.59, 0.33, 1]
    : [82, 88, 79, 91, 68, 62, 74, 86, 92, 83, 77, 71, 66, 80, 75, 81, 89, 94, 72, 58, 69, 90, 84, 87, 79, 76, 64, 73, 85, 91, 78, 67];

  const cells = values
    .map((value) => {
      const display = type === "correlation" ? value.toFixed(2) : value;
      const hue = type === "correlation" ? correlationColor(value) : attendanceColor(value);
      return `<span class="preview-cell" style="background: ${hue}">${display}</span>`;
    })
    .join("");

  return `<div class="preview-grid ${type}">${cells}</div>`;
}

function attendanceColor(value) {
  if (value >= 85) return "rgba(47, 243, 224, 0.86)";
  if (value >= 75) return "rgba(57, 167, 255, 0.78)";
  if (value >= 65) return "rgba(255, 209, 102, 0.76)";
  return "rgba(255, 107, 139, 0.82)";
}

function correlationColor(value) {
  const opacity = Math.max(0.28, Math.abs(value));
  if (value >= 0) return `rgba(47, 243, 224, ${opacity})`;
  return `rgba(255, 92, 200, ${opacity})`;
}

function renderTrendPreview() {
  const values = [66, 72, 78, 84, 81, 69, 63, 82];
  const bars = values.map((value) => `<span style="height: ${value}%"></span>`).join("");
  return `
    <div class="preview-trend">
      <div class="trend-bars">${bars}</div>
      <div class="trend-labels"><span>W1</span><span>W2</span><span>W3</span><span>W4</span><span>W5</span><span>W6</span><span>W7</span><span>W8</span></div>
    </div>
  `;
}

function renderNetworkPreview() {
  const nodes = [
    ["S01", 24, 34],
    ["S08", 47, 22],
    ["S12", 72, 35],
    ["S16", 34, 68],
    ["S21", 62, 72],
    ["S25", 80, 62]
  ];
  const lines = [
    [24, 34, 47, 22],
    [47, 22, 72, 35],
    [24, 34, 34, 68],
    [34, 68, 62, 72],
    [62, 72, 80, 62],
    [72, 35, 80, 62],
    [47, 22, 62, 72]
  ];

  const lineMarkup = lines
    .map(([x1, y1, x2, y2]) => {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const length = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      return `<span class="network-line" style="left:${x1}%;top:${y1}%;width:${length}%;transform:rotate(${angle}deg)"></span>`;
    })
    .join("");

  const nodeMarkup = nodes
    .map(([label, x, y]) => `<span class="network-node" style="left:${x}%;top:${y}%">${label}</span>`)
    .join("");

  return `<div class="preview-network">${lineMarkup}${nodeMarkup}</div>`;
}

function runCounters() {
  const counters = [...document.querySelectorAll("[data-count]")];
  const animated = new WeakSet();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || animated.has(entry.target)) return;
        animated.add(entry.target);
        animateNumber(entry.target);
      });
    },
    { threshold: 0.45 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

function animateNumber(element) {
  const target = Number(element.dataset.count);
  const suffix = element.dataset.suffix || "";
  const decimals = String(target).includes(".") ? 1 : 0;
  const duration = 1300;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = `${(target * eased).toFixed(decimals)}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

function typeHeroText() {
  const target = document.querySelector("#typedText");
  if (!target) return;

  const phrases = [
    "Exam windows. Holiday effects. Weekday behavior.",
    "Chi-Square, ANOVA, correlations and co-absence networks.",
    "From notebook analysis to dashboard-ready intelligence."
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function step() {
    const phrase = phrases[phraseIndex];
    target.textContent = phrase.slice(0, charIndex);

    if (!deleting && charIndex < phrase.length) {
      charIndex += 1;
      setTimeout(step, 42);
      return;
    }

    if (!deleting && charIndex === phrase.length) {
      deleting = true;
      setTimeout(step, 1350);
      return;
    }

    if (deleting && charIndex > 0) {
      charIndex -= 1;
      setTimeout(step, 24);
      return;
    }

    deleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    setTimeout(step, 240);
  }

  step();
}

function updateScrollUI() {
  const progress = document.querySelector("#progressBar");
  const backToTop = document.querySelector("#backToTop");
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const percent = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;

  if (progress) progress.style.width = `${percent}%`;
  backToTop?.classList.toggle("visible", window.scrollY > 700);
}

function setupNavigationState() {
  const links = [...document.querySelectorAll(".nav-links a")];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
      });
    },
    { rootMargin: "-45% 0px -45% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}

function setupCursorGlow() {
  const glow = document.querySelector("#cursorGlow");
  if (!glow) return;

  window.addEventListener("pointermove", (event) => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  });
}

document.querySelector("#backToTop")?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", updateScrollUI, { passive: true });
window.addEventListener("resize", updateScrollUI);

createCharts();
buildHeatmap();
setupInsightModal();
runCounters();
typeHeroText();
setupNavigationState();
setupCursorGlow();
updateScrollUI();
