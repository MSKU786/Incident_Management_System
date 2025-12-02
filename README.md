# Incident Manager 

## 🧭 How to run this project locally

Note: the repo uses a local SQLite DB for quick testing. If you want PostgreSQL, you will need to change the DB config and install pg / pg-hstore.

1. Backend

Open a terminal and run:

```powershell
cd Backend
npm install
node index.js
```

- App default port is 4000; endpoints are exposed under `/api` (e.g., `http://localhost:4000/api/auth/login`).
- The SQLite database file is `Backend/database_sqlite`.

2. Frontend

Open a separate terminal and run:

```powershell
cd frontend
npm install
npm start
```

- The React dev server will run (by default on port 3000) and use the API at `http://localhost:4000/api`.

---

## 📌 APIs implemented (brief)

Authentication

- POST /api/auth/register -> register new user (bcrypt used)
- POST /api/auth/login -> returns JWT

Projects

- POST /api/projects -> create project (auth required)
- GET /api/projects/:id -> get project

Incidents

- GET /api/incidents -> list incidents, supports query params `project_id` and `severity`
- GET /api/incidents/:id -> get incident and attachments
- POST /api/incidents -> create incident (auth required)
- DELETE /api/incidents/:id -> delete incident (permission logic present but should be reviewed)
- POST /api/incidents/:id/attachment -> endpoint exists but contains implementation bugs and will not work correctly until fixed
