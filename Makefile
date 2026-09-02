.PHONY: dev-frontend dev-backend build

dev-frontend:
	cd frontend && npm run dev

dev-backend:
	cd backend && uvicorn app.main:app --reload

build:
	cd frontend && npm run build
