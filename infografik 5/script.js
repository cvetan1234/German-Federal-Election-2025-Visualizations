let pollingData = [];
let parties = ["Union", "AfD", "SPD", "Grüne", "Linke", "BSW", "FDP"];
let colors = {
  "Union": '#000000',
  "AfD": '#009ee0',
  "SPD": '#e3000f',
  "Grüne": '#64a12d',
  "Linke": '#b5003c',
  "BSW": '#8B4513',
  "FDP": '#ffef00'
};
let slider;
let seatCount = 630;
let lastSeatCounts = {};

const coalitions = [
  ["Union", "SPD"],
  ["SPD", "Grüne"],
  ["Union", "FDP"],
  ["SPD", "FDP"],
  ["SPD", "Grüne", "FDP"],
  ["Union", "Grüne", "FDP"]
];

function preload() {
  loadExcelFile("data_infografik_5.xlsx");
}

function setup() {
  createCanvas(1000, 850).parent(document.body);
  textAlign(CENTER, CENTER);
  textSize(14);
  noLoop();
}

function draw() {
  background(255);
  if (pollingData.length === 0) {
    fill(0);
    textSize(18);
    text("📁 Lade data_5.xlsx...", width / 2, height / 2);
    return;
  }

  let idx = slider.value();
  let i0 = Math.floor(idx);
  let i1 = Math.min(i0 + 1, pollingData.length - 1);
  let t = idx - i0;

  let poll0 = pollingData[i0];
  let poll1 = pollingData[i1];

  let interpolatedResults = {};
  for (let party of parties) {
    let v0 = poll0.results[party];
    let v1 = poll1.results[party];
    interpolatedResults[party] = (1 - t) * v0 + t * v1;
  }

  fill(0);
  textSize(24);
  text(`🗓️  ${poll0.date} → ${poll1.date}`, width / 2, 40);

  textSize(16);
  text("Interpolierte Sitzverteilung (≥ 5 %)", width / 2, 70);

  const seatList = distributeSeats(interpolatedResults);
  drawHemicycle(seatList);
  drawSeatCounts(seatList, interpolatedResults);
  drawCoalitionCheck(seatList);
}

function loadExcelFile(url) {
  fetch(url)
    .then(response => response.arrayBuffer())
    .then(data => {
      let workbook = XLSX.read(data, { type: 'array' });
      let sheet = workbook.Sheets[workbook.SheetNames[0]];
      let json = XLSX.utils.sheet_to_json(sheet);

      pollingData = json.map(row => {
        const excelDate = row["__EMPTY"];
        const jsDate = typeof excelDate === "number"
          ? new Date(Date.UTC(1900, 0, excelDate - 1))
          : new Date(excelDate);
        const month = jsDate.toLocaleString("de-DE", { month: "short" });
        const year = jsDate.getFullYear().toString().slice(-2);

        return {
          date: `${month}-${year}`,
          results: {
            Union: row["Union"],
            AfD: row["AfD"],
            SPD: row["SPD"],
            Grüne: row["Grüne"],
            Linke: row["Linke"],
            BSW: row["BSW"] || 0,
            FDP: row["FDP"]
          }
        };
      }).reverse();

      if (pollingData.length > 0) {
        slider = createSlider(0, pollingData.length - 1, 0, 0.01);
        slider.parent("slider-container");
        slider.style('width', '860px');
        slider.input(redraw);
        redraw();
      }
    })
    .catch(err => {
      console.error("❌ Fehler beim Laden von data_5.xlsx:", err);
    });
}

function distributeSeats(results) {
  let seatList = [];
  let validParties = {};
  for (let party of parties) {
    if (results[party] >= 5) {
      validParties[party] = results[party];
    }
  }

  let total = Object.values(validParties).reduce((a, b) => a + b, 0);
  let seatCounts = {};
  for (let party in validParties) {
    let count = Math.round((validParties[party] / total) * seatCount);
    seatCounts[party] = count;
    for (let i = 0; i < count; i++) {
      seatList.push(party);
    }
  }

  while (seatList.length > seatCount) seatList.pop();
  while (seatList.length < seatCount) seatList.push("Sonstige");

  lastSeatCounts = seatCounts;
  return seatList;
}

function drawHemicycle(seatList) {
  let radiusStart = 260;
  let seatSize = 10;
  let rows = 15;

  let partyCounts = {};
  for (let party of seatList) {
    partyCounts[party] = (partyCounts[party] || 0) + 1;
  }

  let orderedParties = Object.keys(partyCounts);
  let totalSeats = seatList.length;
  let angleStart = PI;
  let allSeatPoints = [];

  for (let party of orderedParties) {
    let seats = partyCounts[party];
    let angleSpan = (seats / totalSeats) * PI;
    let angleEnd = angleStart - angleSpan;

    let partySeatIndex = 0;

    for (let r = 0; r < rows; r++) {
      let radius = radiusStart - r * 15;
      let seatsInRow = Math.round(PI * radius / (seatSize * 1.3));
      let partySeatsInRow = Math.round(seatsInRow * (seats / totalSeats));

      for (let i = 0; i < partySeatsInRow; i++) {
        if (partySeatIndex >= seats) break;
        let angle = map(i, 0, partySeatsInRow - 1, angleStart, angleEnd);
        let x = width / 2 + cos(angle) * radius;
        let y = height - 270 - sin(angle) * radius;
        allSeatPoints.push({ x, y, party });
        partySeatIndex++;
      }
    }

    angleStart = angleEnd;
  }

  for (let pt of allSeatPoints) {
    fill(colors[pt.party] || '#999');
    noStroke();
    ellipse(pt.x, pt.y, 10, 10);
  }
}

function drawSeatCounts(seatList, percentages) {
  let counts = {};
  for (let party of seatList) {
    counts[party] = (counts[party] || 0) + 1;
  }

  let sorted = parties.map(party => {
    return [party, counts[party] || 0, percentages[party]];
  }).sort((a, b) => b[1] - a[1]);

  let startX = width - 260;
  let startY = 120;
  let lineHeight = 24;

  textAlign(LEFT, CENTER);
  textSize(16);

  for (let i = 0; i < sorted.length; i++) {
    let [party, count, pct] = sorted[i];
    fill(colors[party] || '#999');
    rect(startX, startY + i * lineHeight - 8, 14, 14);

    fill(count > 0 ? 0 : 150);
    text(`${party}: ${count} Sitze (${pct.toFixed(1)}%)`, startX + 20, startY + i * lineHeight);
  }
}

function drawCoalitionCheck() {
  textAlign(CENTER, CENTER);
  textSize(16);
  let startY = height - 150;
  let lineHeight = 24;

  for (let i = 0; i < coalitions.length; i++) {
    let parties = coalitions[i];
    let total = parties.reduce((sum, p) => sum + (lastSeatCounts[p] || 0), 0);
    let status = total >= 316 ? "✅" : "❌";
    let label = `${parties.join(" + ")}: ${total} Sitze ${status}`;

    fill(0);
    text(label, width / 2, startY + i * lineHeight);
  }
}
