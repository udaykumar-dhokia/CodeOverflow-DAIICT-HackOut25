def calculate_carbon_credits(energy_generated, grid_factor):
    """
    Formula:
    Carbon Credits = Energy Generated (kWh) × Grid Emission Factor (kg CO2/kWh) / 1000
    """
    avoided_emissions = energy_generated * grid_factor
    credits = avoided_emissions / 1000  # 1 credit = 1 ton CO2 avoided
    return round(credits, 2)
