import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
import joblib
import os

# Ensure directories exist
os.makedirs(os.path.join(os.path.dirname(__file__), 'saved_models'), exist_ok=True)

# Synthetic data generation for the local AI
data = {
    'text': [
        'Huge pothole on main street, cars are getting damaged',
        'Streetlight is broken and it is completely dark at night',
        'Garbage has not been collected for two weeks',
        'Water pipe burst and flooding the road',
        'Tree fell down blocking the entire sidewalk',
        'Small crack in the pavement near the park',
        'Public trash can is overflowing',
        'Traffic light is stuck on red causing huge jams',
        'Graffiti on the community center wall',
        'Sewer backing up into the street'
    ],
    'category': [
        'Roads & Infrastructure',
        'Electricity & Streetlights',
        'Sanitation & Garbage',
        'Water & Sewage',
        'Parks & Public Spaces',
        'Roads & Infrastructure',
        'Sanitation & Garbage',
        'Roads & Infrastructure',
        'Public Buildings',
        'Water & Sewage'
    ],
    'severity': [
        'HIGH', 'MEDIUM', 'MEDIUM', 'CRITICAL', 'HIGH', 'LOW', 'LOW', 'CRITICAL', 'LOW', 'CRITICAL'
    ]
}

df = pd.DataFrame(data)

# Category Classifier
cat_pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(stop_words='english')),
    ('clf', RandomForestClassifier(n_estimators=50, random_state=42))
])
cat_pipeline.fit(df['text'], df['category'])
joblib.dump(cat_pipeline, os.path.join(os.path.dirname(__file__), 'saved_models', 'category_model.pkl'))

# Severity Classifier
sev_pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(stop_words='english')),
    ('clf', RandomForestClassifier(n_estimators=50, random_state=42))
])
sev_pipeline.fit(df['text'], df['severity'])
joblib.dump(sev_pipeline, os.path.join(os.path.dirname(__file__), 'saved_models', 'severity_model.pkl'))

print("Local ML Models trained and saved successfully.")
