# app.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib
from typing import List, Dict, Optional
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Hydrogen Plant Feasibility Predictor")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


try:
    model_data = joblib.load("hydrogen_feasibility_model.pkl")
    print("✅ Feasibility model loaded successfully!")
    print(f"   Model accuracy: {model_data['accuracy']:.3f}")
    print(f"   Target classes: {model_data['target_encoder'].classes_}")
    print(f"   Selected features: {model_data['selected_features']}")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model_data = None

class FeasibilityRequest(BaseModel):
    
    capacity_mw: float
    country: str
    technology: str
    year: int
    
    
    investment_million: Optional[float] = None
    energy_source: Optional[str] = None
    co2_emissions: Optional[float] = None
    water_availability: Optional[str] = None
    
    class Config:
        schema_extra = {
            "example": {
                "capacity_mw": 100.0,
                "country": "Germany",
                "technology": "PEM",
                "year": 2024,
                "investment_million": 150.0,
                "energy_source": "Renewable",
                "co2_emissions": 0.5,
                "water_availability": "High"
            }
        }

class FeasibilityResponse(BaseModel):
    feasible: str  
    confidence: float
    probability_yes: float
    probability_no: float
    explanation: str
    key_factors: List[str]
    input_features: Dict[str, float]

@app.get("/")
async def root():
    return {
        "message": "Hydrogen Plant Feasibility Prediction API",
        "endpoints": {
            "GET /": "API information",
            "GET /model-info": "Get model details",
            "GET /available-features": "List of features model expects",
            "POST /predict-feasibility": "Predict feasibility with JSON input"
        }
    }

@app.get("/model-info")
async def get_model_info():
    if model_data is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    return {
        "model_type": model_data.get('model_type', 'Unknown'),
        "accuracy": round(model_data.get('accuracy', 0.0), 3),
        "target_classes": model_data['target_encoder'].classes_.tolist(),
        "selected_features": model_data.get('selected_features', []),
        "number_of_features": len(model_data.get('selected_features', [])),
        "prediction_type": "Feasibility (Yes/No)"
    }

@app.get("/available-features")
async def get_available_features():
    if model_data is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    return {
        "selected_features": model_data.get('selected_features', []),
        "total_features": len(model_data.get('selected_features', [])),
        "required_user_inputs": [
            "capacity_mw", "country", "technology", "year"
        ],
        "optional_user_inputs": [
            "investment_million", "energy_source", "co2_emissions", "water_availability"
        ]
    }

@app.post("/predict-feasibility", response_model=FeasibilityResponse)
async def predict_feasibility(request: FeasibilityRequest):
    """
    Predict whether a hydrogen plant is feasible at a given location
    
    Required parameters:
    - capacity_mw: Plant capacity in megawatts
    - country: Country where plant will be located
    - technology: Hydrogen production technology (PEM, ALK, SOEC, SMR, etc.)
    - year: Proposed year of operation
    
    Optional parameters:
    - investment_million: Estimated investment in million USD
    - energy_source: Primary energy source
    - co2_emissions: Estimated CO2 emissions
    - water_availability: Water availability level
    """
    if model_data is None:
        raise HTTPException(status_code=500, detail="Model not loaded. Please train the model first.")
    
    try:
        
        features = extract_features_from_request(request)
        
        
        selected_features = model_data['selected_features']
        input_vector = []
        
        for feature in selected_features:
            if feature in features:
                input_vector.append(features[feature])
            else:
                
                default_value = get_default_value(feature)
                input_vector.append(default_value)
        
        
        X_new = np.array([input_vector])
        
        
        X_scaled = model_data['scaler'].transform(X_new)
        X_selected = model_data['feature_selector'].transform(X_scaled)
        
        #
        prediction = model_data['model'].predict(X_selected)[0]
        prediction_proba = model_data['model'].predict_proba(X_selected)[0]
        
        
        predicted_class = model_data['target_encoder'].inverse_transform([prediction])[0]
        
        
        class_names = model_data['target_encoder'].classes_
        prob_dict = {class_name: float(prob) for class_name, prob in zip(class_names, prediction_proba)}
        
        
        confidence = float(np.max(prediction_proba))
        probability_yes = prob_dict.get('Yes', 0.0)
        probability_no = prob_dict.get('No', 0.0)
        
        explanation, key_factors = generate_explanation(
            predicted_class, confidence, request, features
        )
        
        
        input_features_response = {
            feature: features.get(feature, 0.0) 
            for feature in selected_features
        }
        
        return FeasibilityResponse(
            feasible=predicted_class,
            confidence=confidence,
            probability_yes=probability_yes,
            probability_no=probability_no,
            explanation=explanation,
            key_factors=key_factors,
            input_features=input_features_response
        )
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction error: {str(e)}")

def extract_features_from_request(request: FeasibilityRequest) -> Dict[str, float]:
    """Convert API request to feature dictionary"""
    features = {}
    
    
    features['Capacity_MW'] = request.capacity_mw
    features['Year'] = request.year
    
    
    tech_mapping = {
        'PEM': 'Tech_PEM', 
        'ALK': 'Tech_ALK', 
        'SOEC': 'Tech_SOEC',
        'SMR': 'Tech_SMR', 
        'ATR': 'Tech_ATR', 
        'ELECTROLYSIS': 'Tech_Electrolysis',
        'BIOMASS': 'Tech_Biomass',
        'SOLAR': 'Tech_Solar',
        'WIND': 'Tech_Wind'
    }
    
    tech_upper = request.technology.upper()
    for tech_key, feature_name in tech_mapping.items():
        features[feature_name] = 1 if tech_key in tech_upper else 0
    
    
    europe_countries = ['GERMANY', 'FRANCE', 'UK', 'UNITED KINGDOM', 'SPAIN', 'ITALY', 
                       'NETHERLANDS', 'BELGIUM', 'SWEDEN', 'NORWAY', 'DENMARK', 'FINLAND']
    asia_countries = ['CHINA', 'JAPAN', 'KOREA', 'SOUTH KOREA', 'INDIA', 'AUSTRALIA',
                     'SINGAPORE', 'MALAYSIA', 'THAILAND', 'VIETNAM']
    na_countries = ['USA', 'UNITED STATES', 'CANADA', 'MEXICO']
    
    country_upper = request.country.upper()
    features['Region_Europe'] = 1 if any(c in country_upper for c in europe_countries) else 0
    features['Region_Asia'] = 1 if any(c in country_upper for c in asia_countries) else 0
    features['Region_NA'] = 1 if any(c in country_upper for c in na_countries) else 0
    
    
    if request.investment_million:
        features['Investment'] = request.investment_million
    
    if request.co2_emissions:
        features['CO2_Emissions'] = request.co2_emissions
    
   
    if request.energy_source:
        energy_upper = request.energy_source.upper()
        features['Energy_Renewable'] = 1 if 'RENEW' in energy_upper else 0
        features['Energy_Fossil'] = 1 if any(x in energy_upper for x in ['FOSSIL', 'GAS', 'COAL', 'OIL']) else 0
        features['Energy_Nuclear'] = 1 if 'NUCLEAR' in energy_upper else 0
    
    
    if request.water_availability:
        water_upper = request.water_availability.upper()
        features['Water_High'] = 1 if 'HIGH' in water_upper else 0
        features['Water_Medium'] = 1 if 'MEDIUM' in water_upper else 0
        features['Water_Low'] = 1 if 'LOW' in water_upper else 0
    
    return features

def get_default_value(feature_name: str) -> float:
    """Get default values for missing features"""
    defaults = {
        'Investment': 100.0,
        'CO2_Emissions': 1.0,
        'Energy_Renewable': 0.0,
        'Energy_Fossil': 0.0,
        'Energy_Nuclear': 0.0,
        'Water_High': 0.0,
        'Water_Medium': 0.0,
        'Water_Low': 0.0
    }
    return defaults.get(feature_name, 0.0)

def generate_explanation(prediction: str, confidence: float, request: FeasibilityRequest, features: Dict) -> tuple:
    """Generate explanation for the prediction"""
    if prediction == "Yes":
        explanation = (
            f"✅ HIGH FEASIBILITY ({confidence:.1%} confidence)\n"
            f"A {request.capacity_mw}MW {request.technology} plant in {request.country} "
            f"is likely feasible for operation in {request.year}."
        )
        key_factors = [
            f"Adequate capacity ({request.capacity_mw}MW)",
            f"Suitable technology ({request.technology})",
            f"Favorable region ({request.country})",
            f"Appropriate timeline (Year {request.year})"
        ]
    else:
        explanation = (
            f" LOW FEASIBILITY ({confidence:.1%} confidence)\n"
            f"A {request.capacity_mw}MW {request.technology} plant in {request.country} "
            f"may face challenges for operation in {request.year}."
        )
        key_factors = [
            f"Capacity considerations ({request.capacity_mw}MW)",
            f"Technology constraints ({request.technology})",
            f"Regional factors ({request.country})",
            f"Timeline constraints (Year {request.year})"
        ]
    
    # Add specific factors based on input values
    if request.investment_million:
        if request.investment_million > 200:
            key_factors.append("High investment requirement")
        elif request.investment_million < 50:
            key_factors.append("Low investment potential")
    
    if request.co2_emissions and request.co2_emissions > 1.0:
        key_factors.append("High CO2 emissions")
    
    return explanation, key_factors

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy" if model_data else "unhealthy",
        "model_loaded": model_data is not None,
        "timestamp": pd.Timestamp.now().isoformat()
    }

@app.get("/example-request")
async def get_example_request():
    """Get example request structure"""
    return {
        "example_request": {
            "capacity_mw": 100.0,
            "country": "Germany",
            "technology": "PEM Electrolysis",
            "year": 2025,
            "investment_million": 150.0,
            "energy_source": "Renewable",
            "co2_emissions": 0.2,
            "water_availability": "High"
        },
        "curl_example": """
curl -X POST "http://localhost:8000/predict-feasibility" \\
  -H "Content-Type: application/json" \\
  -d '{
    "capacity_mw": 100.0,
    "country": "Germany",
    "technology": "PEM",
    "year": 2024,
    "investment_million": 150.0,
    "energy_source": "Renewable",
    "co2_emissions": 0.5,
    "water_availability": "High"
  }'
        """
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)