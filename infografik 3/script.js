let parties = ["Union", "SPD", "Grüne", "FDP", "AfD", "Linke", "BSW"];
let partyColors = {
  "Union": "#000000",
  "SPD": "#FF0000",
  "Grüne": "#00AA00",
  "FDP": "#FFD700",
  "AfD": "#0000FF",
  "Linke": "#800080",
  "BSW": "#8B0000"
};

let ageGroups = ["18-24", "25-34", "35-44", "45-59", "60-69", "70+"];
let ageValues = [21, 29.5, 39.5, 52, 64.5, 75];
let allValues = [];
let scrollbarWidth = 500;
let selectedScroll = 0;
let dragging = false;
let ready = false;

function preload() {
  fetch('data_infografik_3.xlsx')
    .then(response => response.arrayBuffer())
    .then(data => {
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      for (let i = 1; i < json.length; i++) {
        allValues.push(json[i].slice(1).map(Number));
      }
      ready = true;
    });
}

function setup() {
  let canvas = createCanvas(700, 510);
  canvas.parent("canvas-container");
}

function draw() {
  if (!ready) return;

  background(255);
  textAlign(CENTER, BOTTOM);
  textSize(16);
  fill(0);

  let iLow = Math.floor(selectedScroll);
  let iHigh = Math.min(iLow + 1, allValues.length - 1);
  let t = selectedScroll - iLow;
  let interpolated = parties.map((_, i) =>
    lerp(allValues[iLow][i], allValues[iHigh][i], t)
  );

  // draw bars
  let barWidth = 60;
  let gap = 20;
  let startX = (width - (barWidth + gap) * parties.length) / 2;
  for (let i = 0; i < parties.length; i++) {
    let val = interpolated[i];
    let barHeight = map(val, 0, 50, 0, height - 280);
    fill(partyColors[parties[i]]);
    rect(startX + i * (barWidth + gap), height - 140 - barHeight, barWidth, barHeight);
    fill(0);
    text(`${val.toFixed(1)}%`, startX + i * (barWidth + gap) + barWidth / 2, height - 145 - barHeight);
    text(parties[i], startX + i * (barWidth + gap) + barWidth / 2, height - 120);
  }

  // draw scrollbar
  fill(220);
  rect(width / 2 - scrollbarWidth / 2, height - 60, scrollbarWidth, 20);
  let knobX = map(selectedScroll, 0, ageGroups.length - 1, width / 2 - scrollbarWidth / 2, width / 2 + scrollbarWidth / 2 - 20);
  fill(0);
  rect(knobX, height - 62, 20, 24);

  // draw age
  let ageInterp = lerp(ageValues[iLow], ageValues[iHigh], t);
  fill(0);
  textSize(20);
  text(`Alter: ${ageInterp.toFixed(1)}`, width / 2, height - 10);

  // update age group label
  let snapped = Math.round(selectedScroll);
  document.getElementById("ageLabel").textContent = "Gruppe: " + ageGroups[snapped];

  updateCoalitions(interpolated);
}

function statusIcon(value) {
  if (value >= 50) return "✅";
  if (value >= 33.3) return "⚖️";
  return "❌";
}

function updateCoalitions(values) {
  const index = party => parties.indexOf(party);

  const gk = values[index("Union")] + values[index("SPD")];
  const left = values[index("SPD")] + values[index("Grüne")] + values[index("Linke")] + values[index("BSW")];
  const right = values[index("Union")] + values[index("FDP")] + values[index("AfD")];
  const progressive = values[index("SPD")] + values[index("Grüne")] + values[index("FDP")] + values[index("Linke")];
  const antiNato = values[index("AfD")] + values[index("Linke")] + values[index("BSW")];

  document.getElementById("coalitions").innerHTML = `
    <p>Große Koalition (Union + SPD): ${gk.toFixed(1)}% <span class="status">${statusIcon(gk)}</span></p>
    <p>Linke Parteien (SPD + Grüne + Linke + BSW): ${left.toFixed(1)}% <span class="status">${statusIcon(left)}</span></p>
    <p>Rechte Parteien (Union + FDP + AfD): ${right.toFixed(1)}% <span class="status">${statusIcon(right)}</span></p>
    <p>Progressive Parteien (SPD + Grüne + FDP + Linke): ${progressive.toFixed(1)}% <span class="status">${statusIcon(progressive)}</span></p>
    <p>Anti-NATO Parteien (AfD + Linke + BSW): ${antiNato.toFixed(1)}% <span class="status">${statusIcon(antiNato)}</span></p>
  `;
}

function mousePressed() {
  if (mouseY > height - 70 && mouseY < height - 30) dragging = true;
}

function mouseReleased() {
  dragging = false;
}

function mouseDragged() {
  if (!dragging) return;
  let barX = width / 2 - scrollbarWidth / 2;
  let relative = constrain(mouseX - barX, 0, scrollbarWidth);
  selectedScroll = map(relative, 0, scrollbarWidth, 0, ageGroups.length - 1);
}
