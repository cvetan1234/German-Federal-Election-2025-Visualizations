let flows = [];
let parties = [];
let selected = null;

function setup() {
  createCanvas(1400, 700);
  textFont("Segoe UI");
  textSize(14);
  noLoop();
  loadExcelFile("data_infografik_4.xlsx");
}

function draw() {
  background(247);
  if (!selected) return;

  let leftX = 200, centerX = 700, rightX = 1200;
  let spacing = 500 / parties.length;
  let arrowGap = 120;

  let incoming = flows.filter(f => f.to === selected && f.from !== selected);
  let outgoing = flows.filter(f => f.from === selected && f.to !== selected);

  let minY = 100;
  let maxY = 100 + (Math.max(incoming.length, outgoing.length) - 1) * spacing;

  fill(getColor(selected));
  noStroke();
  rect(centerX - 60, minY - 40, 120, maxY - minY + 80, 6);

  fill(0);
  textSize(24);
  textAlign(CENTER, CENTER);
  stroke(255);
  strokeWeight(5);
  textStyle(BOLD);
  text(selected, centerX, (minY + maxY) / 2);
  noStroke();
  textSize(14);

  for (let i = 0; i < incoming.length; i++) {
    let y = 100 + i * spacing;
    let weight = map(incoming[i].value, 0, 2000000, 5, 40);
    strokeWeight(weight);
    stroke(getColor(incoming[i].from));
    drawBarArrow(leftX, y, centerX - arrowGap, y);
    noStroke();
    drawLabelBox(leftX - 180, y - 20, incoming[i].from);
    drawValueCircle((leftX + centerX - arrowGap) / 2, y, incoming[i].value, getColor(incoming[i].from));
  }

  for (let i = 0; i < outgoing.length; i++) {
    let y = 100 + i * spacing;
    let weight = map(outgoing[i].value, 0, 2000000, 5, 40);
    strokeWeight(weight);
    stroke(getColor(outgoing[i].to));
    drawBarArrow(centerX + arrowGap, y, rightX, y);
    noStroke();
    drawLabelBox(rightX + 40, y - 20, outgoing[i].to);
    drawValueCircle((centerX + arrowGap + rightX) / 2, y, outgoing[i].value, getColor(outgoing[i].to));
  }
}

function drawBarArrow(x1, y1, x2, y2) {
  line(x1, y1, x2 - 10, y2);
  let angle = atan2(y2 - y1, x2 - x1);
  push();
  translate(x2, y2);
  rotate(angle);
  triangle(0, 0, -10, -5, -10, 5);
  pop();
}

function drawValueCircle(x, y, value, color) {
  fill(color);
  stroke(255);
  strokeWeight(2);
  ellipse(x, y, 90, 40);
  fill(0);
  stroke(255);
  strokeWeight(1.5);
  textAlign(CENTER, CENTER);
  textSize(16);
  textStyle(BOLD);
  text(format(value), x, y);
  noStroke();  
}

function drawLabelBox(x, y, party) {
  let w = 130, h = 30;
  fill(getColor(party));
  rect(x, y, w, h, 4);
  stroke(255);
  strokeWeight(3);
  fill(0);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  text(party, x + w / 2, y + h / 2);
  noStroke();
}

function getColor(party) {
  const colors = {
    "SPD": "#e41a1c",
    "CDU": "#000000",
    "Union": "#000000",
    "Grüne": "#6DBE45",
    "AfD": "#3A8DDE",
    "Linke": "#D73E99",
    "FDP": "#FFCC00",
    "Nichtwähler": "#888888",
    "BSW": "#5A1A41"
  };
  return colors[party] || "#aaa";
}

function format(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function createPartyButtons() {
  const container = document.getElementById("buttons");
  container.innerHTML = "";
  parties.forEach(p => {
    const btn = document.createElement("button");
    btn.innerText = p;
    btn.onclick = () => {
      selected = p;
      redraw();
    };
    container.appendChild(btn);
  });
}

function loadExcelFile(path) {
  fetch(path)
    .then(res => res.arrayBuffer())
    .then(data => {
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const raw = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      parties = raw[0].slice(1);
      flows = [];

      for (let i = 1; i < raw.length; i++) {
        const rowParty = raw[i][0];
        for (let j = i + 1; j < raw[i].length; j++) {
          const colParty = raw[0][j];
          const val = raw[i][j];
          if (!isNaN(val) && rowParty !== colParty && val !== 0) {
            if (val > 0) {
              flows.push({ from: colParty, to: rowParty, value: val });
            } else {
              flows.push({ from: rowParty, to: colParty, value: -val });
            }
          }
        }
      }

      createPartyButtons();
      selected = "Union";
      redraw();
    })
    .catch(err => {
      alert("Fehler beim Laden von data_4.xlsx. Stelle sicher, dass die Datei im selben Ordner wie index.html liegt.");
      console.error(err);
    });
}
