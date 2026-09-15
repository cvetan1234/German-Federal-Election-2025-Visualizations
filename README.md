# Interactive Visualizations of the 2025 German Federal Election

## Overview

This project contains **five interactive data visualizations** related to the **2025 German federal election (Bundestagswahl)**.

Each visualization explores a different aspect of voter behavior and the political landscape, including voter turnout, regional election results, age-based voting preferences, voter migration, polling trends, parliamentary seat distribution, and coalition possibilities.

This project was originally developed as part of the **Visualisation & Explanations** module at Ostbayerische Technische Hochschule Amberg-Weiden (OTH Amberg-Weiden).

## Visualizations

### Visualization 1 – Voter Turnout Over Time

Visualizes the development of voter turnout from **2002 to 2025** and allows interactive comparisons with socioeconomic factors.

### Visualization 2 – Comparison of German Federal States

Provides an interactive map of Germany where individual federal states can be selected.

After selecting a state, a bar chart displays election-related data for that state. Additional interactive options allow different political comparisons to be displayed directly on the map, such as party strength, political grouping, or positions on selected topics.

### Visualization 3 – Party Preferences by Age Group

Shows how voting preferences differ between age groups in Germany using an interactive bar chart with navigation through the different age groups.

### Visualization 4 – Voter Migration Between 2021 and 2025

Visualizes how voters moved between political parties from the **2021 federal election to the 2025 federal election**, showing which parties gained or lost voters and where those voters moved.

### Visualization 5 – Bundestag Seat Distribution Based on Polling, 2021–2025

Visualizes the development of the projected seat distribution in the Bundestag based on polling data between **2021 and 2025**.

The visualization also simulates possible coalition combinations and provides a graphical evaluation of potential parliamentary majorities.

## Technologies

The project uses:

- HTML
- CSS
- JavaScript
- p5.js
- xlsx.js / SheetJS
- SVG
- Microsoft Excel (`.xlsx`) datasets

## Project Structure

```text
project/
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
└── infografik 5/
    ├── index.html
    ├── style.css
    ├── script.js
    └── data_infografik_5.xlsx
```

## How to Run

Because the visualizations load local data files using JavaScript, the project should be opened through a **local web server** rather than by opening the HTML files directly.

### Option 1 – Python Local Server

Python 3 can be used to start a simple local web server.

1. Download or clone the repository.

2. Open a terminal or command prompt and navigate to the **root directory of the project** — the directory containing the five `infografik` folders:

```bash
cd path/to/German-Federal-Election-2025-Visualizations
```

3. Start the local server:

```bash
python -m http.server 8000
```

4. Open a web browser and go to:

```text
http://localhost:8000
```

5. Open one of the five `infografik` directories and select its `index.html` file.

For example:

```text
http://localhost:8000/infografik%202/index.html
```

6. To stop the local server, return to the terminal and press:

```text
Ctrl+C
```

### Option 2 – VS Code Live Server

The project can also be run using the **Live Server** extension in Visual Studio Code.

Open the project directory in VS Code, start Live Server, and navigate to the `index.html` file of the visualization you want to view.

## Data

Each visualization uses an `.xlsx` file as its data source.

The data files should remain in their respective visualization directories so that the JavaScript code can load them correctly.

## Libraries

### p5.js

Used for creating interactive graphics and visualizations.

### xlsx.js / SheetJS

Used for reading the Excel (`.xlsx`) data files directly in the browser.

## About

This project demonstrates interactive **information and data visualization** using web technologies. It combines political and election data with interactive graphics to explore different aspects of the 2025 German federal election.

The five visualizations cover temporal, geographic, demographic, voter-migration, and parliamentary perspectives on election data.

## Author

**Tsvetan Stanchev**  
Ostbayerische Technische Hochschule Amberg-Weiden (OTH Amberg-Weiden)

## License

This project was created for educational and demonstration purposes as part of the **Visualisation & Explanations** module at OTH Amberg-Weiden.
