import requests

def fetch_emission_factor(country: str):
    """
    Example: Fetch grid emission factors from an open dataset (placeholder API).
    You can replace this with IEA/World Bank APIs.
    """
    url = f"https://api.carbonintensity.org/country/{country}"
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            data = response.json()
            return data.get("emission_factor", 0.5)  # fallback
    except Exception as e:
        print(f"Error fetching emissions: {e}")
    return 0.5
