# 🌍 OutbreakAtlas

**A Disease Surveillance and Historical Malaria Insights Dashboard**

OutbreakAtlas is a web-based disease surveillance dashboard designed to help users explore global disease outbreak reports and understand historical malaria trends through interactive visualisations.

## 🎯 Problem Statement

Accessing and understanding disease outbreak information can be difficult when reports and historical statistics are scattered across different sources. OutbreakAtlas brings live outbreak reports and historical malaria data together in one accessible dashboard.

## ✨ Key Features

- **Live Outbreak Reports:** Fetches the latest disease outbreak news from the WHO API.
- **Interactive World Map:** Displays outbreak locations using Leaflet and OpenStreetMap.
- **Search and Filters:** Helps users find reports by disease or country.
- **Official Reports:** Provides links to original WHO reports.
- **Historical Malaria Insights:** Displays historical malaria cases, deaths and incidence.
- **Interactive Graphs:** Includes five visualisations for exploring historical trends.
- **Country-wise Analysis:** Allows users to select countries and explore their malaria trends.

## 🛠️ Technologies Used

- HTML
- CSS
- JavaScript
- Chart.js
- Leaflet.js
- OpenStreetMap
- Python
- Pandas
- WHO Disease Outbreak News API

## 📊 Data Sources

- World Health Organization (WHO) Disease Outbreak News API
- Historical malaria datasets containing reported cases, estimated cases, deaths and incidence.

## 📁 Project Structure

```text
OutbreakAtlas/
├── index.html
├── style.css
├── script.js
├── export_data.py
├── analyze_data.py
├── historical_data.json
├── estimated_numbers.csv
├── reported_numbers.csv
├── incidence_per_1000_pop_at_risk.csv
└── settings.json
```

## 🚀 How to Run

1. Clone or download this repository.
2. Open the project folder in VS Code.
3. Run `index.html` using a local development server, such as the Live Server extension.
4. Explore the live outbreak reports, map and historical malaria visualisations.

## 🔮 Future Improvements

- Add more diseases and historical datasets.
- Include advanced outbreak prediction and trend analysis.
- Improve geographical visualisations.
- Add more filtering and comparison options.
- Develop an early-warning system for potential disease outbreaks.

## 👩‍💻 Project Purpose

Developed as an MVP for the Analytix Club Moderator Challenge, with the aim of making disease surveillance information easier to explore and understand.
