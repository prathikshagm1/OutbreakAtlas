import pandas as pd

# Load the reported malaria data
df = pd.read_csv("data/reported_numbers.csv")

# Display the first 5 rows
print("FIRST 5 ROWS:")
print(df.head())

# Display column names
print("\nCOLUMN NAMES:")
print(df.columns.tolist())

# Display dataset information
print("\nDATASET INFORMATION:")
print(df.info())

# Find the year range
print("\nYEAR RANGE:")
print("Starting Year:", df["Year"].min())
print("Ending Year:", df["Year"].max())

# Count unique countries
print("\nNUMBER OF COUNTRIES:")
print(df["Country"].nunique())

# Check missing values
print("\nMISSING VALUES:")
print(df.isnull().sum())

# Create a cleaned copy
cleaned_df = df.copy()

# Remove rows where both cases and deaths are missing
cleaned_df = cleaned_df.dropna(
    subset=["No. of cases", "No. of deaths"],
    how="all"
)

# Display cleaned dataset information
print("\nCLEANED DATASET:")
print("Original rows:", len(df))
print("Remaining rows:", len(cleaned_df))
print("Removed rows:", len(df) - len(cleaned_df))

# Calculate total reported malaria cases
total_cases = cleaned_df["No. of cases"].sum()

print("\nTOTAL REPORTED MALARIA CASES:")
print(f"{total_cases:,.0f}")

# Calculate total reported malaria deaths
total_deaths = cleaned_df["No. of deaths"].sum()

print("\nTOTAL REPORTED MALARIA DEATHS:")
print(f"{total_deaths:,.0f}")

# Calculate total cases by country
country_cases = cleaned_df.groupby("Country")["No. of cases"].sum()

# Find the country with the highest cases
highest_country = country_cases.idxmax()
highest_cases = country_cases.max()

print("\nCOUNTRY WITH HIGHEST REPORTED CASES:")
print("Country:", highest_country)
print("Total Cases:", f"{highest_cases:,.0f}")

# Find the top 10 countries by reported cases
top_countries = country_cases.sort_values(
    ascending=False
).head(10)

print("\nTOP 10 COUNTRIES WITH HIGHEST MALARIA CASES:")
print(top_countries)

# Calculate total malaria cases by year
yearly_cases = cleaned_df.groupby("Year")["No. of cases"].sum()

print("\nYEAR-WISE MALARIA CASES:")
print(yearly_cases)

# Calculate total malaria deaths by year
yearly_deaths = cleaned_df.groupby("Year")["No. of deaths"].sum()

print("\nYEAR-WISE MALARIA DEATHS:")
print(yearly_deaths)

# Calculate total malaria deaths by year
yearly_deaths = cleaned_df.groupby("Year")["No. of deaths"].sum()

print("\nYEAR-WISE MALARIA DEATHS:")
print(yearly_deaths)

# Calculate total malaria cases by WHO region
region_cases = cleaned_df.groupby("WHO Region")["No. of cases"].sum()

print("\nMALARIA CASES BY WHO REGION:")
print(region_cases.sort_values(ascending=False))

# Load estimated malaria data
estimated_df = pd.read_csv("data/estimated_numbers.csv")

print("\nESTIMATED MALARIA DATA:")
print(estimated_df.head())

print("\nESTIMATED DATA COLUMNS:")
print(estimated_df.columns.tolist())

print("\nESTIMATED DATA INFORMATION:")
print(estimated_df.info())

# Check estimated dataset year range
print("\nESTIMATED DATA YEAR RANGE:")
print("Starting Year:", estimated_df["Year"].min())
print("Ending Year:", estimated_df["Year"].max())

# Check missing values
print("\nESTIMATED DATA MISSING VALUES:")
print(estimated_df.isnull().sum())

# Convert estimated cases and deaths to numeric values
estimated_df["No. of cases"] = pd.to_numeric(
    estimated_df["No. of cases"], errors="coerce"
)

estimated_df["No. of deaths"] = pd.to_numeric(
    estimated_df["No. of deaths"], errors="coerce"
)

print("\nCONVERTED DATA TYPES:")
print(estimated_df[["No. of cases", "No. of deaths"]].dtypes)

print("\nMISSING VALUES AFTER CONVERSION:")
print(estimated_df[["No. of cases", "No. of deaths"]].isnull().sum())

# Calculate total estimated malaria cases
total_estimated_cases = estimated_df["No. of cases_median"].sum()

print("\nTOTAL ESTIMATED MALARIA CASES:")
print(f"{total_estimated_cases:,.0f}")

# Calculate total estimated malaria deaths
total_estimated_deaths = estimated_df["No. of deaths_median"].sum()

print("\nTOTAL ESTIMATED MALARIA DEATHS:")
print(f"{total_estimated_deaths:,.0f}")

# Calculate estimated cases by country
estimated_country_cases = estimated_df.groupby("Country")[
    "No. of cases_median"
].sum()

# Find the top 10 countries
top_estimated_countries = estimated_country_cases.sort_values(
    ascending=False
).head(10)

print("\nTOP 10 COUNTRIES BY ESTIMATED MALARIA CASES:")
print(top_estimated_countries)
# Calculate estimated malaria cases by WHO region
estimated_region_cases = estimated_df.groupby("WHO Region")[
    "No. of cases_median"
].sum()

print("\nESTIMATED MALARIA CASES BY WHO REGION:")
print(estimated_region_cases.sort_values(ascending=False))
# Load malaria incidence data
incidence_df = pd.read_csv(
    "data/incidence_per_1000_pop_at_risk.csv"
)

print("\nMALARIA INCIDENCE DATA:")
print(incidence_df.head())

print("\nINCIDENCE DATA COLUMNS:")
print(incidence_df.columns.tolist())

print("\nINCIDENCE DATA INFORMATION:")
print(incidence_df.info())
# Check incidence dataset year range
print("\nINCIDENCE DATA YEAR RANGE:")
print("Starting Year:", incidence_df["Year"].min())
print("Ending Year:", incidence_df["Year"].max())

# Check unique countries
print("\nNUMBER OF COUNTRIES:")
print(incidence_df["Country"].nunique())

# Check missing values
print("\nINCIDENCE DATA MISSING VALUES:")
print(incidence_df.isnull().sum())
# Calculate average malaria incidence by WHO region
region_incidence = incidence_df.groupby("WHO Region")[
    "No. of cases"
].mean()

print("\nAVERAGE MALARIA INCIDENCE BY WHO REGION:")
print(region_incidence.sort_values(ascending=False).round(2))
# Calculate average malaria incidence by year
yearly_incidence = incidence_df.groupby("Year")["No. of cases"].mean()

print("\nAVERAGE MALARIA INCIDENCE BY YEAR:")
print(yearly_incidence.round(2))

# Find the year with highest average incidence
highest_incidence_year = yearly_incidence.idxmax()
highest_incidence = yearly_incidence.max()

print("\nHIGHEST INCIDENCE YEAR:")
print("Year:", highest_incidence_year)
print("Average incidence:", round(highest_incidence, 2))