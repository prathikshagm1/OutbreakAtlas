import pandas as pd
import json
from pathlib import Path

# Load all three datasets
reported_df = pd.read_csv("data/reported_numbers.csv")
estimated_df = pd.read_csv("data/estimated_numbers.csv")
incidence_df = pd.read_csv("data/incidence_per_1000_pop_at_risk.csv")

# Clean reported data
reported_df = reported_df.dropna(
    subset=["No. of cases", "No. of deaths"],
    how="all"
)

# Convert estimated values to numeric
estimated_df["No. of cases"] = pd.to_numeric(
    estimated_df["No. of cases"], errors="coerce"
)

estimated_df["No. of deaths"] = pd.to_numeric(
    estimated_df["No. of deaths"], errors="coerce"
)

# Reported malaria statistics
reported_yearly = reported_df.groupby("Year").agg({
    "No. of cases": "sum",
    "No. of deaths": "sum"
}).reset_index()

reported_top_countries = (
    reported_df.groupby("Country")["No. of cases"]
    .sum()
    .sort_values(ascending=False)
    .head(10)
    .reset_index()
)

reported_regions = (
    reported_df.groupby("WHO Region")["No. of cases"]
    .sum()
    .reset_index()
)

# Estimated malaria statistics
estimated_top_countries = (
    estimated_df.groupby("Country")["No. of cases_median"]
    .sum()
    .sort_values(ascending=False)
    .head(10)
    .reset_index()
)

estimated_regions = (
    estimated_df.groupby("WHO Region")["No. of cases_median"]
    .sum()
    .reset_index()
)

# Incidence statistics
incidence_yearly = (
    incidence_df.groupby("Year")["No. of cases"]
    .mean()
    .reset_index()
)

incidence_regions = (
    incidence_df.groupby("WHO Region")["No. of cases"]
    .mean()
    .reset_index()
)

# Prepare JSON data
# Country-wise historical malaria data

reported_country_yearly = reported_df.groupby(
    ["Country", "Year"]
)[["No. of cases", "No. of deaths"]].sum().reset_index()

incidence_country_yearly = incidence_df.groupby(
    ["Country", "Year"]
)["No. of cases"].mean().reset_index()

historical_data = {
    "reported": {
        "total_cases": float(reported_df["No. of cases"].sum()),
        "total_deaths": float(reported_df["No. of deaths"].sum()),
        "yearly": json.loads(reported_yearly.to_json(orient="records")),
        "top_countries": json.loads(reported_top_countries.to_json(orient="records")),
        "regions": json.loads(reported_regions.to_json(orient="records"))
    },
    "estimated": {
        "total_cases_median": int(estimated_df["No. of cases_median"].sum()),
        "total_deaths_median": int(estimated_df["No. of deaths_median"].sum()),
        "top_countries": json.loads(estimated_top_countries.to_json(orient="records")),
        "regions": json.loads(estimated_regions.to_json(orient="records"))
    },
    "incidence": {
        "yearly_average": json.loads(incidence_yearly.to_json(orient="records")),
        "regional_average": json.loads(incidence_regions.to_json(orient="records"))
    },
    "countries": {
        "reported": json.loads(reported_country_yearly.to_json(orient="records")),
        "incidence": json.loads(incidence_country_yearly.to_json(orient="records"))
    }
}

# Create output folder and export JSON
output_path = Path("data/historical_data.json")

with output_path.open("w", encoding="utf-8") as file:
    json.dump(historical_data, file, indent=4)

print("\nHISTORICAL DATA EXPORTED SUCCESSFULLY!")
print("File created:", output_path)