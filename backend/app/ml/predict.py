import os
import joblib
from ..models.schemas import ComplaintInput, AIAnalysisOutput

MODEL_DIR = os.path.join(os.path.dirname(__file__), 'saved_models')
cat_model_path = os.path.join(MODEL_DIR, 'category_model.pkl')
sev_model_path = os.path.join(MODEL_DIR, 'severity_model.pkl')

# Global cache for models
_models = {}

def load_models():
    if 'cat' not in _models:
        if os.path.exists(cat_model_path):
            _models['cat'] = joblib.load(cat_model_path)
        else:
            return False
    if 'sev' not in _models:
        if os.path.exists(sev_model_path):
            _models['sev'] = joblib.load(sev_model_path)
        else:
            return False
    return True

def analyze_complaint(complaint: ComplaintInput) -> AIAnalysisOutput:
    if not load_models():
        return AIAnalysisOutput(
            category="Unclassified",
            severity="MEDIUM",
            priorityScore=5.0,
            recommendedDepartmentId="general_ops",
            isDuplicate=False
        )
        
    combined_text = f"{complaint.title} {complaint.description}"
    lower_text = combined_text.lower()
    
    # ML Predict
    cat_pred = _models['cat'].predict([combined_text])[0]
    sev_pred = _models['sev'].predict([combined_text])[0]
    
    # ----------------------------------------------------
    # HEURISTIC OVERRIDES FOR CRITICAL SAFETY (Rules Engine)
    # ----------------------------------------------------
    critical_keywords = ['fall down', 'collapse', 'fire', 'explosion', 'death', 'blood', 'accident', 'emergency', 'kill', 'die', 'trapped']
    high_keywords = ['broken', 'leak', 'flooding', 'dangerous', 'danger', 'hazard', 'power cut', 'no power']
    low_keywords = ['pothole', 'garbage', 'trash', 'litter', 'dirty', 'paint', 'weeds', 'bus stop', 'water passes through']
    
    if any(k in lower_text for k in critical_keywords):
        sev_pred = 'CRITICAL'
        if 'building' in lower_text or 'fall down' in lower_text or 'collapse' in lower_text:
            cat_pred = 'Public Buildings'
    elif any(k in lower_text for k in high_keywords):
        if sev_pred == 'LOW':
            sev_pred = 'HIGH'
    elif any(k in lower_text for k in low_keywords):
        if sev_pred == 'CRITICAL':
            sev_pred = 'LOW'
            
    # Priority logic
    score = 5.0
    if sev_pred == 'CRITICAL': score = 9.8
    elif sev_pred == 'HIGH': score = 7.5
    elif sev_pred == 'MEDIUM': score = 5.0
    elif sev_pred == 'LOW': score = 2.5
    
    # Department mapping
    dept_map = {
        'Roads & Infrastructure': 'dept_roads',
        'Electricity & Streetlights': 'dept_elec',
        'Sanitation & Garbage': 'dept_sanitation',
        'Water & Sewage': 'dept_water',
        'Parks & Public Spaces': 'dept_parks',
        'Public Buildings': 'dept_bldgs'
    }
    
    return AIAnalysisOutput(
        category=cat_pred,
        severity=sev_pred,
        priorityScore=score,
        recommendedDepartmentId=dept_map.get(cat_pred, "general_ops"),
        isDuplicate=False
    )
