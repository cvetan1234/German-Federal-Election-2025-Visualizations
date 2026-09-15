
# Interaktive Infografiken Bundeswahl 2025

Dieses Projekt umfasst fünf interaktive Infografiken zur Bundestagswahl 2025 in Deutschland.  
Jede Infografik beleuchtet unterschiedliche Aspekte des Wählerverhaltens und der politischen Landschaft.

## Übersicht der Infografiken

### Infografik 1: Wahlbeteiligung im Zeitverlauf
Visualisiert die Entwicklung der Wahlbeteiligung von 2002 bis 2025 und ermöglicht interaktive Vergleiche mit sozioökonomischen Faktoren.

### Infografik 2: Bundesländer im Vergleich
Diese Infografik zeigt eine interaktive Deutschlandkarte, auf der jedes Bundesland angeklickt werden kann.  
Nach dem Klick erscheint ein Balkendiagramm mit wahlbezogenen Daten für das gewählte Bundesland.  
Zudem gibt es interaktive Optionen, um verschiedene politische Vergleiche direkt auf der Karte darzustellen – z. B. Parteistärke, Lagerzugehörigkeit oder Haltung zu bestimmten Themen.

### Infografik 3: Parteienpräferenzen nach Altersgruppen
Stellt dar, wie unterschiedliche Altersgruppen in Deutschland wählen – als interaktives Balkendiagramm mit Scrollfunktion durch die Altersjahrgänge.

### Infografik 4: Wählerwanderung zwischen 2021 und 2025
Zeigt, welche Parteien Wählerinnen und Wähler gewonnen oder verloren haben – wie viele und an welche Parteien sie gegangen sind.

### Infografik 5: Parteiverteilung im Bundestag basierend auf Umfragen von 2021 bis 2025
Zeigt die Entwicklung der Sitzverteilung im Bundestag auf Grundlage von Umfragewerten im Zeitraum 2021 bis 2025 und simuliert Koalitionsmöglichkeiten mit grafischer Auswertung.

---

## Verzeichnisstruktur

Das Projekt ist wie folgt aufgebaut:

```
projektordner/
├── infografik 1/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── data_infografik_1.xlsx
│
├── infografik 2/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── data_infografik_2.xlsx
│   └── de.svg
│
├── infografik 3/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── data_infografik_3.xlsx
│
├── infografik 4/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── data_infografik_4.xlsx
│
├── infografik 5/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── data_infografik_5.xlsx
```

---

## Nutzung

Um das Projekt lokal auszuführen:

1. Stelle sicher, dass ein lokaler Webserver installiert ist (z. B. [Live Server in VS Code](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) oder `python -m http.server`).
2. Starte den Server im **Hauptverzeichnis** (also dort, wo die fünf `infografik`-Ordner liegen).
3. Öffne im Browser eine gewünschte Infografik, z. B.:

   ```
   http://localhost:8000/infografik 2/index.html
   ```

---

## Datenformate

Alle Infografiken verwenden `.xlsx`-Dateien als Datenquelle.  
Wichtig ist, dass die Dateien korrekt aufgebaut sind (z. B. erste Zeile = Spaltenüberschriften, kein leerer Header, UTF-8 kodiert).

---

## Verwendete Bibliotheken

- [p5.js](https://p5js.org/) – für interaktive Visualisierungen
- [xlsx.js](https://github.com/SheetJS/sheetjs) – zum Einlesen von Excel-Dateien

---

## Autor

Tsvetan Stanchev  
Modul: Informationsvisualisierung (SoSe 2025)  
OTH Amberg-Weiden

---

## Lizenz

Dieses Projekt wurde im Rahmen des Moduls **Informationsvisualisierung** an der **OTH Amberg-Weiden** erstellt und dient ausschließlich zu Lern- und Demonstrationszwecken.
