let years = [];
let wahlbeteiligung = [];
let otherColumns = {};
let columnNames = [];
let selectedColumn = null;
let ready = false;

// Load Excel and parse data
fetch('data_infografik_1.xlsx')
  .then(response => response.arrayBuffer())
  .then(data => {
    const workbook = XLSX.read(data, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    columnNames = rows[0];
    let rawWahl = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      years.push(row[0]);
      rawWahl.push(row[1]);
      for (let j = 2; j < row.length; j++) {
        if (!otherColumns[columnNames[j]]) {
          otherColumns[columnNames[j]] = [];
        }
        otherColumns[columnNames[j]].push(row[j]);
      }
    }

    wahlbeteiligung = zNormalize(rawWahl);
    for (const key in otherColumns) {
      otherColumns[key] = zNormalize(otherColumns[key]);
    }

    createButtons();
    selectedColumn = columnNames[2];
    updateCorrelation();
    ready = true;
    redraw();
  });

// Normalize array to mean 0, std 1
function zNormalize(arr) {
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  const std = Math.sqrt(arr.reduce((sum, val) => sum + (val - mean) ** 2, 0) / arr.length);
  return arr.map(x => (x - mean) / std);
}

// Compute Pearson correlation coefficient
function pearsonCorrelation(x, y) {
  const n = x.length;
  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;
  let numerator = 0, denomX = 0, denomY = 0;
  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    numerator += dx * dy;
    denomX += dx * dx;
    denomY += dy * dy;
  }
  return numerator / Math.sqrt(denomX * denomY);
}

// Update displayed correlation
function updateCorrelation() {
  const r = pearsonCorrelation(wahlbeteiligung, otherColumns[selectedColumn]);
  const correlationText = `Korrelationskoeffizient r = ${r.toFixed(2)} (${interpretCorrelation(r)})`;
  document.getElementById('correlation').textContent = correlationText;
}

// Human-readable correlation interpretation
function interpretCorrelation(r) {
  if (r >= 0.7) return "Starke positive Korrelation";
  if (r >= 0.3) return "Moderat positive Korrelation";
  if (r > -0.3) return "Keine Korrelation";
  if (r > -0.7) return "Moderate negative Korrelation";
  return "Starke negative Korrelation";
}

// Create buttons for selectable columns
function createButtons() {
  const container = document.getElementById('buttons');
  for (let i = 2; i < columnNames.length; i++) {
    const btn = document.createElement('button');
    btn.textContent = columnNames[i];
    btn.onclick = () => {
      selectedColumn = columnNames[i];
      updateCorrelation();
      redraw();
    };
    container.appendChild(btn);
  }
}

// Setup p5.js canvas
function setup() {
  createCanvas(900, 600);
  textAlign(CENTER, CENTER);
  noLoop();
}

// Main drawing function
function draw() {
  background(255);
  if (!ready) {
    fill(0);
    text("Lade Daten...", width / 2, height / 2);
    return;
  }

  drawAxes();
  drawLines(wahlbeteiligung, 'green');
  drawLines(otherColumns[selectedColumn], 'blue');
  drawLabels();
}

// Draw axes
function drawAxes() {
  stroke(0);
  line(60, height - 100, width - 60, height - 100);
  line(60, 80, 60, height - 100);
}

// Draw time series lines
function drawLines(values, colorName) {
  stroke(colorName);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let i = 0; i < years.length; i++) {
    let x = map(years[i], years[0], years[years.length - 1], 60, width - 60);
    let y = map(values[i], -2.5, 2.5, height - 100, 80);
    vertex(x, y);
    ellipse(x, y, 5, 5);
  }
  endShape();
}

// Draw labels for years and z-values
function drawLabels() {
  fill(0);
  noStroke();
  textSize(12);

  for (let i = 0; i < years.length; i++) {
    let x = map(years[i], years[0], years[years.length - 1], 60, width - 60);
    text(years[i], x, height - 80);
  }

  for (let z = -2; z <= 2; z++) {
    let y = map(z, -2.5, 2.5, height - 100, 80);
    text(z.toFixed(1), 40, y);
  }

  fill('green');
  text("Wahlbeteiligung", width - 120, 90);
  fill('blue');
  text(selectedColumn, width - 120, 110);
}
