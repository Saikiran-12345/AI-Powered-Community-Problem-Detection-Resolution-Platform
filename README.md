# CivicAI - AI-Powered Community Problem Detection & Resolution Platform

CivicAI is a modern CivicTech platform designed to help citizens report community/public infrastructure problems, and assist administrators and officers in classifying, prioritizing, investigating, and resolving those problems using local Artificial Intelligence (AI).

## Features
- **Local AI Analysis:** Automatically classifies complaints, predicts severity, and computes a priority score using local ML models.
- **Role-Based Access Control:** Dedicated modules for Citizens, Officers, and Admins.
- **Workflow Automation:** Tracks problems from submission to final citizen confirmation.
- **Community Analytics:** Generates local heatmaps, trends, and department performance reports.

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python (3.9+)

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
