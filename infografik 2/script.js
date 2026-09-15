let data = [];
let selected = null;
let partyNames = [];
let canvas;
let currentView = "party";

const partyColors = {
  "AfD": "#5FB1F3",
  "Union": "#000000",
  "SPD": "#E30613",
  "FDP": "#FFD700",
  "Grüne": "#2E8B57",
  "Linke": "#800080",
  "BSW": "#8B4513"
};

function setup() {
  canvas = createCanvas(700, 400);
  canvas.parent("chart-container");
  noLoop();
}

function draw() {
  clear();
  background(255);
  if (selected) drawBarChart(selected);
}

function drawBarChart(region) {
  document.getElementById("regionTitle").innerText = "Resultaten in " + region.name;
  let chartW = width - 100;
  let chartH = height - 100;
  let vals = region.values;
  let maxVal = Math.max(...vals) * 1.1;

  push();
  translate(50, 50);

  let barWidth = chartW / vals.length * 0.8;
  let spacing = chartW / vals.length;

  for (let i = 0; i < vals.length; i++) {
    let x = i * spacing + spacing * 0.1;
    let barHeight = map(vals[i], 0, maxVal, 0, chartH);
    let y = chartH - barHeight;
    let party = partyNames[i];
    let fillColor = partyColors[party] || "#aaa";

    fill(fillColor);
    noStroke();
    rect(x, y, barWidth, barHeight);

    fill(0);
    textSize(14);
    textAlign(CENTER, BOTTOM);
    text(vals[i].toFixed(1) + " %", x + barWidth / 2, y - 5);
    textAlign(CENTER, TOP);
    text(party, x + barWidth / 2, chartH + 5);
  }

  pop();
}

function loadXLSX(fileName) {
  fetch(fileName)
    .then(res => res.arrayBuffer())
    .then(buffer => {
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      parseExcel(json);
    });
}

function parseExcel(rows) {
  const headers = rows[0];
  const isoIndex = headers.findIndex(h => h.toLowerCase().includes("iso"));
  partyNames = headers.slice(2);

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const name = row[0];
    const iso = row[isoIndex];
    const values = row.slice(2).filter(v => typeof v === "number");
    data.push({ name, iso, values });
  }

  attachMapClickEvents();

  const bayern = data.find(region => region.name.toLowerCase().includes("bayern"));
  if (bayern) {
    selected = bayern;
    redraw();
  }
}

function attachMapClickEvents() {
  const iframe = document.getElementById("svgMap");
  const svgDoc = iframe.contentDocument || iframe.contentWindow.document;

  if (!svgDoc || !svgDoc.getElementById) {
    setTimeout(attachMapClickEvents, 100);
    return;
  }

  for (let region of data) {
    const el = svgDoc.getElementById(region.iso);
    if (el) {
      el.style.cursor = "pointer";
      el.addEventListener("click", () => {
        selected = region;
        redraw();
      });
    }
  }

  updateMapColors();
  scaleMapContent();
}

function scaleMapContent() {
  const iframe = document.getElementById("svgMap");
  const svgDoc = iframe.contentDocument || iframe.contentWindow.document;
  const g = svgDoc.querySelector("g#features");
  if (g) g.setAttribute("transform", "scale(1.2) translate(-70, 110)");
  scrollIframeToPosition();
}

function scrollIframeToPosition() {
  const iframe = document.getElementById("svgMap");
  setTimeout(() => {
    iframe.contentWindow.scrollTo({
      top: 90,
      left: 120,
      behavior: "instant"
    });
  }, 300);
}

function updateMapColors() {
  const iframe = document.getElementById("svgMap");
  const svgDoc = iframe.contentDocument || iframe.contentWindow.document;

  for (let region of data) {
    const el = svgDoc.getElementById(region.iso);
    if (!el) continue;

    let values = region.values;
    let partyMap = Object.fromEntries(partyNames.map((p, i) => [p, values[i] || 0]));

    if (currentView === "party") {
      let maxIdx = region.values.indexOf(Math.max(...region.values));
      el.style.fill = partyColors[partyNames[maxIdx]] || "#ccc";

    } else if (currentView === "leftRight") {
      let rightSum = (partyMap["Union"] || 0) + (partyMap["AfD"] || 0) + (partyMap["FDP"] || 0);
      let leftSum = (partyMap["SPD"] || 0) + (partyMap["Grüne"] || 0) + (partyMap["Linke"] || 0) + (partyMap["BSW"] || 0);
      el.style.fill = rightSum > leftSum ? "#007bff" : "#e30613";

    } else if (currentView === "nato") {
      let antiSum = (partyMap["AfD"] || 0) + (partyMap["Linke"] || 0) + (partyMap["BSW"] || 0);
      let total = values.reduce((a, b) => a + b, 0);
      el.style.fill = antiSum > (total / 2) ? "#ff8c00" : "#00aa55";

    } else if (currentView === "groko") {
      let spd = partyMap["SPD"] || 0;
      let cdu = partyMap["Union"] || 0;
      let grokoSum = spd + cdu;
      let other = values.reduce((a, b) => a + b, 0) - grokoSum;
      el.style.fill = grokoSum >= other ? "#00cc66" : "#cccccc";

    } else if (currentView === "second") {
      let sortedIndices = values
        .map((val, idx) => ({ idx, val }))
        .sort((a, b) => b.val - a.val);
      if (sortedIndices.length >= 2) {
        let secondIdx = sortedIndices[1].idx;
        el.style.fill = partyColors[partyNames[secondIdx]] || "#ccc";
      }
    }
  }
}

// View toggles
function setPartyView() { currentView = "party"; updateMapColors(); }
function setLeftRightView() { currentView = "leftRight"; updateMapColors(); }
function setNatoView() { currentView = "nato"; updateMapColors(); }
function setGroKoView() { currentView = "groko"; updateMapColors(); }
function setSecondPartyView() { currentView = "second"; updateMapColors(); }

window.addEventListener("load", () => {
  loadXLSX("data_infografik_2.xlsx");
});
