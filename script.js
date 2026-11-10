
const apiURL = "https://www.who.int/api/hubs/diseaseoutbreaknews";
fetch(apiURL)
    .then(response => response.json())
    .then(data => {
        const reports = data.value.sort((a, b) =>
            new Date(b.PublicationDate) - new Date(a.PublicationDate)
        );
        document.getElementById("mapReports").textContent = reports.length;
        document.getElementById("total-reports").textContent = reports.length;
        const container = document.getElementById("reports-container");
        function displayReports(reportList) {
            container.innerHTML = "";
            if (reportList.length === 0) {
                container.innerHTML = `
                    <div class="no-reports">
                        <h3>🔍 No Reports Found</h3>
                        <p>We couldn't find any outbreak reports matching your search.</p>
                        <p>Try another keyword!</p>
                    </div>
                `;
                return;
            }
            reportList.slice(0, 10).forEach(report => {
                const card = document.createElement("div");
                card.className = "report-card";
                card.style.cursor = "pointer";
                card.addEventListener("click", () => {
                    document.getElementById("reportModal").style.display = "flex";
                    document.getElementById("modalTitle").textContent = report.Title;
                    document.getElementById("modalDate").textContent =
                        "Publication Date: " +
                        (report.PublicationDate
                            ? new Date(report.PublicationDate).toLocaleDateString("en-GB")
                            : "Not available");
                    document.getElementById("modalSummary").innerHTML =
                        report.Summary || report.Overview || "No summary available.";
                    document.getElementById("modalLink").href =
                        `https://www.who.int/emergencies/disease-outbreak-news/item/${report.DonId}`;
                });
                card.innerHTML = `
                    <h3>${report.Title}</h3>
                    <span class="report-label">WHO REPORT</span>
                    <p>Publication Date: ${
                        report.PublicationDate
                            ? new Date(report.PublicationDate).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "long",
                                year: "numeric"
                            })
                            : "Not available"
                    }</p>
                    <p>${(report.Summary || report.Overview || "No summary available.")
                        .replace(/<a\b[^>]*>(.*?)<\/a>/gi, "$1")}</p>
                    <button class="read-report-btn" type="button">
                        Read Official Report
                    </button>
                `;
                container.appendChild(card);
            });
        }
        const clearButton = document.getElementById("clearCountryFilter");
        clearButton.onclick = function () {
            displayReports(reports);
            const countryLabel = document.getElementById("selectedCountryLabel");
            countryLabel.style.display = "none";
        };
        displayReports(reports);
        // SUMMARY DASHBOARD CARDS
        // 1. Total Reports
        document.getElementById("totalReports").textContent =
            reports.length;
        // COUNT UNIQUE COUNTRIES
        const countries = new Set();
        const countryPatterns = [
            ["Uganda", /Uganda/i],
            ["Indonesia", /Indonesia/i],
            ["Democratic Republic of the Congo", /Democratic Republic of the Congo/i],
            ["China", /China/i],
            ["Cambodia", /Cambodia/i],
            ["Nepal", /Nepal/i],
            ["Saudi Arabia", /Saudi Arabia/i],
            ["Pakistan", /Pakistan/i],
            ["Gabon", /Gabon/i],
            ["Comoros", /Comoros/i],
            ["Burundi", /Burundi/i],
            ["Malawi", /Malawi/i],
            ["France", /France/i],
            ["United Kingdom", /United Kingdom/i],
            ["Oman", /\bOman\b/i],
            ["Netherlands", /Netherlands/i],
            ["Canada", /Toronto/i],
            ["Iraq", /\bIraq\b/i],
            ["Senegal", /Senegal/i],
            ["Peru", /Peru/i],
            ["South Korea", /Republic of Korea/i],
            ["United States", /United States of America/i],
            ["Syria", /Syrian Arab Republic/i],
            ["Israel", /Israel/i],
            ["Republic of the Congo", /Polio in Congo/i],
            ["Egypt", /Egypt/i],
            ["Angola", /Angola/i],
            ["Vietnam", /Viet Nam/i]
        ];
        reports.forEach(report => {
            const title = report.Title || "";
            countryPatterns.forEach(([country, pattern]) => {
                if (pattern.test(title)) {
                    countries.add(country);
                }
            });
        });
        document.getElementById("mapCountries").textContent = countries.size;
        document.getElementById("totalCountries").textContent = countries.size;
        // ADD OUTBREAK COUNTRY MARKERS
        const countryCoordinates = {
            "Uganda": [1.37, 32.29],
            "Indonesia": [-0.79, 113.92],
            "Democratic Republic of the Congo": [-4.03, 21.76],
            "China": [35.86, 104.19],
            "Cambodia": [12.56, 104.99],
            "Nepal": [28.39, 84.12],
            "Saudi Arabia": [23.88, 45.08],
            "Pakistan": [30.37, 69.34],
            "Gabon": [-0.80, 11.61],
            "Comoros": [-11.87, 43.87],
            "Burundi": [-3.37, 29.92],
            "Malawi": [-13.25, 34.30],
            "France": [46.22, 2.21],
            "United Kingdom": [55.37, -3.43],
            "Oman": [21.47, 55.97],
            "Netherlands": [52.13, 5.29],
            "Canada": [56.13, -106.34],
            "Iraq": [33.22, 43.68],
            "Senegal": [14.49, -14.45],
            "Peru": [-9.19, -75.01],
            "South Korea": [35.90, 127.76],
            "United States": [37.09, -95.71],
            "Syria": [34.80, 38.99],
            "Israel": [31.04, 34.85],
            "Republic of the Congo": [-0.22, 15.82],
            "Egypt": [26.82, 30.80],
            "Angola": [-11.20, 17.87],
            "Vietnam": [14.05, 108.27]
        };
        let selectedMarker = null;
        let markerCount = 0;
        countries.forEach(country => {
            const coordinates = countryCoordinates[country];
            if (coordinates) {
                markerCount++;
                const reportCount = reports.filter(report =>
                    (report.Title || "").toLowerCase().includes(country.toLowerCase())
                ).length;
                let markerColor;
                if (reportCount >= 6) {
                    markerColor = "red";
                } else if (reportCount >= 3) {
                    markerColor = "orange";
                } else if (reportCount >= 1) {
                    markerColor = "green";
                } else {
                    markerColor = "gray";
                }
                const marker = L.circleMarker(coordinates, {
                    radius: 9,
                    fillColor: markerColor,
                    color: "#ffffff",
                    weight: 2,
                    fillOpacity: 0.9
                })
                    .addTo(map)
                    .bindPopup(`
                        <b>${country}</b>
                        <br>
                        WHO Reports: ${reportCount}
                    `);
                marker.on("click", () => {
                    // Reset the previously selected marker
                    if (selectedMarker) {
                        selectedMarker.setStyle({
                            radius: 9,
                            color: "#ffffff",
                            weight: 2,
                            fillOpacity: 0.9
                        });
                    }
                    // Highlight the newly selected marker
                    marker.setStyle({
                        radius: 13,
                        color: "#20c9c3",
                        weight: 4,
                        fillOpacity: 1
                    });
                    selectedMarker = marker;
                    const countryReports = reports.filter(report =>
                        (report.Title || "").toLowerCase().includes(country.toLowerCase())
                    );
                    displayReports(countryReports);
                    const countryLabel = document.getElementById("selectedCountryLabel");
                    countryLabel.textContent =
                        "🌍 Currently viewing: " + country +
                        " | " + countryReports.length + " WHO Reports";
                    countryLabel.style.display = "block";
                });
            }
        });
        document.getElementById("mapMarkers").textContent = markerCount;
        // SHOW COUNTRIES WHEN CARD IS CLICKED
        const countryCard = document.getElementById("countryCard");
        const countryList = document.getElementById("countryList");
        countryCard.addEventListener("click", () => {
            countryList.innerHTML = "";
            countries.forEach(country => {
                const item = document.createElement("div");
                item.className = "country-item";
                item.innerHTML = `
                    <span class="country-icon">🌍</span>
                    <span>${country}</span>
                `;
                countryList.appendChild(item);
            });
            countryList.classList.toggle("show");
        });
        // 2. Latest Report Year
        const years = reports
            .filter(report => report.PublicationDate)
            .map(report =>
                new Date(report.PublicationDate).getFullYear()
            )
            .filter(year => !isNaN(year));
        const latestYear = years.length
            ? Math.max(...years)
            : "Not available";
        document.getElementById("latestYear").textContent =
            latestYear;
        // 3. Check country information
        const monthlyCounts = {};
        reports.forEach(report => {
            if (report.PublicationDate) {
                const date = new Date(report.PublicationDate);
                const month = date.toLocaleString("en-US", {
                    month: "short",
                    year: "numeric"
                });
                monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
            }
        });
        // Outbreak Reports by Year
        const yearCounts = {};
        reports.forEach(report => {
            if (report.PublicationDate) {
                const date = new Date(report.PublicationDate);
                if (!isNaN(date.getTime())) {
                    const year = date.getFullYear();
                    yearCounts[year] = (yearCounts[year] || 0) + 1;
                }
            }
        });
        const yearCtx = document.getElementById("yearChart");
        new Chart(yearCtx, {
            type: "doughnut",
            data: {
                labels: Object.keys(yearCounts),
                datasets: [{
                    label: "Reports by Year",
                    data: Object.values(yearCounts),
                    backgroundColor: [
                        "#822d40",
                        "#4b718a",
                        "#c59a2f",
                        "#622ec9",
                        "#326565",
                        "#a87746",
                        "#98392e",
                        "#45775a",
                        "#09273b",
                        "#c2b376",
                        "#3e0a52",
                        "#eec5a1",
                        "#4fd7bc",
                        "#ac0b59",
                        "#717b7c",
                        "#1e2725",
                        "#d35400",
                        "#6C5CE7",
                        "#00B894",
                        "#a27c89"
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        bottom: 20,
                        left: 15,
                        right: 15
                    }
                },
                plugins: {
                    legend: {
                        position: "right",
                        align: "center",
                        labels: {
                            color: "#ffffff",
                            padding: 15,
                            usePointStyle: false,
                            pointStyle: "rect",
                            boxWidth: 25,
                            boxHeight: 12,
                            font: {
                                size: 13
                            }
                        }
                    }
                }
            }
        });
        const ctx = document.getElementById("monthlyChart");
        new Chart(ctx, {
            type: "bar",
            data: {
                labels: Object.keys(monthlyCounts),
                datasets: [{
                    label: "Number of Reports",
                    data: Object.values(monthlyCounts),
                    backgroundColor: "#45d6c8"
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
        const searchInput = document.getElementById("searchInput");
        const countryFilter = document.getElementById("countryFilter");
        const diseaseFilter = document.getElementById("diseaseFilter");
        function filterReports() {
            const searchText = searchInput.value.toLowerCase();
            const selectedCountry = countryFilter.value.toLowerCase();
            const selectedDisease = diseaseFilter.value.toLowerCase();
            const filteredReports = reports.filter(report => {
                const title = (report.Title || "").toLowerCase();
                const summary = (report.Summary || report.Overview || "").toLowerCase();
                const matchesSearch =
                    title.includes(searchText) ||
                    summary.includes(searchText);
                const matchesCountry =
                    selectedCountry === "all" ||
                    title.includes(selectedCountry);
                const matchesDisease =
                    selectedDisease === "all" ||
                    title.includes(selectedDisease) ||
                    summary.includes(selectedDisease);
                return matchesSearch && matchesCountry && matchesDisease;
            });
            displayReports(filteredReports);
        }
        diseaseFilter.addEventListener("change", filterReports);
        searchInput.addEventListener("input", filterReports);
        countryFilter.addEventListener("change", filterReports);
    })
    .catch(error => {
        console.log("Error fetching reports:", error);
    });
// CLOSE REPORT POPUP
const reportModal = document.getElementById("reportModal");
const closeModal = document.getElementById("closeModal");
closeModal.addEventListener("click", () => {
    reportModal.style.display = "none";
});
reportModal.addEventListener("click", (event) => {
    if (event.target === reportModal) {
        reportModal.style.display = "none";
    }
});
// INTERACTIVE WORLD MAP
const map = L.map("outbreakMap").setView([20, 0], 2);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);
// Load historical malaria data
fetch("data/historical_data.json")
    .then(response => {
        if (!response.ok) {
            throw new Error("Could not load historical data");
        }
        return response.json();
    })
    .then(data => {
        // Populate country dropdown
        const countrySelect = document.getElementById("countrySelect");
        const countries = [
            ...new Set(data.countries.reported.map(item => item.Country))
        ].sort();
        countries.forEach(country => {
            const option = document.createElement("option");
            option.value = country;
            option.textContent = country;
            countrySelect.appendChild(option);
        });
        // Display selected country's historical statistics
        countrySelect.addEventListener("change", function () {
            const selectedCountry = this.value;
            const results = document.getElementById("countryResults");
            if (!selectedCountry) {
                results.innerHTML = "<p>Select a country to view its historical malaria data.</p>";
                return;
            }
            const reportedData = data.countries.reported.filter(
                item => item.Country === selectedCountry
            );
            const incidenceData = data.countries.incidence.filter(
                item => item.Country === selectedCountry
            );
            const totalCases = reportedData.reduce(
                (sum, item) => sum + (Number(item["No. of cases"]) || 0), 0
            );
            const totalDeaths = reportedData.reduce(
                (sum, item) => sum + (Number(item["No. of deaths"]) || 0), 0
            );
            const averageIncidence = incidenceData.length
                ? incidenceData.reduce(
                    (sum, item) => sum + (Number(item["No. of cases"]) || 0), 0
                ) / incidenceData.length
                : null;
            results.innerHTML = `
                <h3>${selectedCountry}</h3>
                <p><strong>Total Reported Cases:</strong> ${totalCases.toLocaleString()}</p>
                <p><strong>Total Reported Deaths:</strong> ${totalDeaths.toLocaleString()}</p>
                <p><strong>Average Incidence:</strong> ${
                    averageIncidence === null
                        ? "No data available"
                        : averageIncidence.toFixed(2) + " per 1,000 people at risk"
                }</p>
            `;
            // Create country-wise malaria trends chart
            const trendYears = reportedData.map(item => item.Year);
            const trendCases = reportedData.map(item => item["No. of cases"]);
            const trendDeaths = reportedData.map(item => item["No. of deaths"]);
            const trendCtx = document
                .getElementById("countryTrendChart")
                .getContext("2d");
            // Remove previous chart when another country is selected
            if (window.countryTrendChartInstance) {
                window.countryTrendChartInstance.destroy();
            }
            window.countryTrendChartInstance = new Chart(trendCtx, {
                type: "line",
                data: {
                    labels: trendYears,
                    datasets: [
                        {
                            label: "Reported Cases",
                            data: trendCases,
                            borderColor: "#16a085",
                            tension: 0.3
                        },
                        {
                            label: "Reported Deaths",
                            data: trendDeaths,
                            borderColor: "#ff6b6b",
                            tension: 0.3
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: {
                                color: "#ffffff"
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                color: "#ffffff"
                            },
                            grid: {
                                display: true,
                                color: "rgba(255, 255, 255, 0.15)"
                            },
                            border: {
                                display: true,
                                color: "#ffffff"
                            }
                        },
                        y: {
                            beginAtZero: true,
                            ticks: {
                                color: "#ffffff",
                                callback: value => (value / 1000000).toFixed(0) + "M"
                            },
                            grid: {
                                display: true,
                                color: "rgba(255, 255, 255, 0.15)"
                            }
                        }
                    }
                }
            });
            // Country-wise incidence chart
            const incidenceYears = incidenceData.map(item => item.Year);
            const incidenceValues = incidenceData.map(
                item => item["No. of cases"]
            );
            const incidenceCtx = document
                .getElementById("countryIncidenceChart")
                .getContext("2d");
            if (window.countryIncidenceChartInstance) {
                window.countryIncidenceChartInstance.destroy();
            }
            window.countryIncidenceChartInstance = new Chart(incidenceCtx, {
                type: "line",
                data: {
                    labels: incidenceYears,
                    datasets: [{
                        label: "Incidence per 1,000 People at Risk",
                        data: incidenceValues,
                        borderColor: "#f39c12",
                        backgroundColor: "rgba(243, 156, 18, 0.15)",
                        borderWidth: 2,
                        fill: true,
                        tension: 0.3
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: {
                                color: "#ffffff"
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                color: "#ffffff"
                            },
                            grid: {
                                display: true,
                                color: "rgba(255, 255, 255, 0.15)"
                            },
                            border: {
                                display: true,
                                color: "#ffffff"
                            }
                        },
                        y: {
                            beginAtZero: true,
                            ticks: {
                                color: "#ffffff"
                            },
                            grid: {
                                display: true,
                                color: "rgba(255, 255, 255, 0.15)"
                            },
                            title: {
                                display: true,
                                text: "Incidence per 1,000 people at risk",
                                color: "#ffffff"
                            }
                        }
                    }
                }
            });
        });
        // Display total reported cases
        document.getElementById("historicalCases").textContent =
            data.reported.total_cases.toLocaleString();
        // Display total reported deaths
        document.getElementById("historicalDeaths").textContent =
            data.reported.total_deaths.toLocaleString();
        // Create year-wise malaria cases chart
        const years = data.reported.yearly.map(item => item.Year);
        const cases = data.reported.yearly.map(
            item => item["No. of cases"]
        );
        const ctx = document
            .getElementById("historicalCasesChart")
            .getContext("2d");
        new Chart(ctx, {
            type: "line",
            data: {
                labels: years,
                datasets: [{
                    label: "Reported Malaria Cases",
                    data: cases,
                    borderColor: "#16a085",
                    backgroundColor: "rgba(22, 160, 133, 0.15)",
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: "#ffffff"
                        }
                    }
                },
                scales: {
                    x: {
                        display: true,
                        ticks: {
                            display: true,
                            color: "#ffffff",
                            autoSkip: true,
                            maxRotation: 0,
                            minRotation: 0,
                            padding: 8
                        },
                        grid: {
                            display: true,
                            color: "rgba(255, 255, 255, 0.15)"
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: "#ffffff",
                            callback: value => value.toLocaleString()
                        },
                        grid: {
                            display: true,
                            color: "rgba(255, 255, 255, 0.15)"
                        }
                    }
                }
            }
        });
        // Create year-wise malaria deaths chart
        const deaths = data.reported.yearly.map(
            item => item["No. of deaths"]
        );
        const deathsCtx = document
            .getElementById("historicalDeathsChart")
            .getContext("2d");
        new Chart(deathsCtx, {
            type: "line",
            data: {
                labels: years,
                datasets: [{
                    label: "Reported Malaria Deaths",
                    data: deaths,
                    borderColor: "#ff6b6b",
                    backgroundColor: "rgba(255, 107, 107, 0.15)",
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: "#ffffff"
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: "#ffffff"
                        },
                        grid: {
                            display: true,
                            color: "rgba(255, 255, 255, 0.15)"
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: "#ffffff",
                            callback: value => value.toLocaleString()
                        },
                        grid: {
                            display: true,
                            color: "rgba(255, 255, 255, 0.15)"
                        }
                    }
                }
            }
        });
        // Top 10 countries by reported malaria cases
        const countryNames = data.reported.top_countries.map(
            item => item.Country
        );
        const countryCases = data.reported.top_countries.map(
            item => item["No. of cases"]
        );
        const countryCtx = document
            .getElementById("topCountriesChart")
            .getContext("2d");
        new Chart(countryCtx, {
            type: "bar",
            data: {
                labels: countryNames,
                datasets: [{
                    label: "Reported Malaria Cases",
                    data: countryCases,
                    backgroundColor: "#16a085",
                    borderRadius: 6
                }]
            },
            options: {
                indexAxis: "y",
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: "#ffffff"
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            color: "#ffffff",
                            callback: value => value.toLocaleString()
                        }
                    },
                    y: {
                        ticks: {
                            color: "#ffffff"
                        }
                    }
                }
            }
        });
        // Average malaria incidence by year
        const incidenceYears = data.incidence.yearly_average.map(
            item => item.Year
        );
        const incidenceValues = data.incidence.yearly_average.map(
            item => item["No. of cases"]
        );
        const incidenceCtx = document
            .getElementById("incidenceChart")
            .getContext("2d");
        new Chart(incidenceCtx, {
            type: "line",
            data: {
                labels: incidenceYears,
                datasets: [{
                    label: "Average Incidence per 1,000 People at Risk",
                    data: incidenceValues,
                    borderColor: "#f39c12",
                    backgroundColor: "rgba(243, 156, 18, 0.15)",
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: "#ffffff"
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: "#ffffff"
                        },
                        grid: {
                            display: true,
                            color: "rgba(255, 255, 255, 0.15)"
                        },
                        border: {
                            display: true,
                            color: "#ffffff"
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: "#ffffff"
                        },
                        grid: {
                            display: true,
                            color: "rgba(255, 255, 255, 0.15)"
                        },
                        title: {
                            display: true,
                            text: "Incidence per 1,000 people",
                            color: "#ffffff"
                        }
                    }
                }
            }
        });
    })
    .catch(error => {
        console.error("Historical data error:", error);
    });
