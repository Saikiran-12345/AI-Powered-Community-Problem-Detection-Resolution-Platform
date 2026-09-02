from pydantic import BaseModel
from typing import Optional

class ComplaintInput(BaseModel):
    title: str = ""
    description: str = ""
    category_hint: Optional[str] = None

class AIAnalysisOutput(BaseModel):
    category: str
    severity: str
    priorityScore: float
    recommendedDepartmentId: str
    isDuplicate: bool
