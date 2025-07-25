
# 🚀 APItrain – No-Code ML API Generator

**APItrain** is a full-stack platform that allows users to upload datasets and instantly turn them into machine learning APIs — without writing any code. Whether you're a developer, student, or data analyst, APItrain helps you deploy powerful models in minutes using AutoML.

---

## 🎯 Live Demo

🌐 **Website**: [https://apitrain.in](https://apitrain.vercel.app)  
📦 **API Docs**: `http://localhost:8000/docs` (when running locally)

---

## 👋 About This Project

Built as a personal product by **Prathamesh More**, APItrain solves a real problem for non-ML developers and early-stage startups — making model training and deployment seamless through a user-friendly interface and FastAPI-powered backend.

> ✨ *Train, test, and serve your ML model in minutes.*

---

## ✨ Production-Grade Features (v1)

- User authentication with OTP (email-based) and JWT tokens
- User profile management (view and update)
- Upload datasets (CSV, Excel, JSON) via dashboard
- Import data directly from Google Sheets (integration)
- Automatic model training (Linear Regression, Decision Tree)
- Model storage and management (create, view, delete APIs)
- Model versioning and rollback support
- Secure prediction endpoints for each trained model (API key required)
- Real-time and batch prediction support (single and bulk)
- API key management UI (regenerate, revoke, multiple keys)
- API usage analytics and monitoring dashboard
- Auto-generated Swagger/OpenAPI docs for all endpoints
- Interactive API playground for testing endpoints
- File upload size limit and validation
- Scheduled cleanup of old uploads and models
- Environment variable-based configuration for secrets and credentials
- Docker-based deployment for both frontend and backend
- CORS and security middleware for safe API access
- SQLite database for user, API, and model metadata
- Rate limiting and abuse prevention on all APIs
- Health check endpoints for monitoring
- Comprehensive error handling and logging
- Email and webhook notifications for important events
- Role-based access control (admin/user)
- Audit logs for critical actions
- GDPR-compliant data deletion
- Responsive, modern UI/UX with onboarding and help sections
- Comprehensive API and user documentation

---

## 🛠️ Tech Stack

**Frontend**:  
- React.js (Vite)
- Axios
- TailwindCSS (optional)

**Backend**:  
- FastAPI
- AutoGluon
- Pandas, NumPy
- Uvicorn
- SQLite (optional)

**Infrastructure & Tools**:  
- Docker & docker-compose
- dotenv
- Swagger/OpenAPI
- GitHub Actions (for CI/CD)

---

## 📁 Folder Structure

```

apitrain/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry point
│   │   ├── config.py            # env & config loader
│   │   ├── routes/
│   │   │   ├── upload.py
│   │   │   ├── train.py
│   │   │   └── predict.py
│   │   ├── services/
│   │   │   ├── trainer.py       # AutoML logic
│   │   │   └── predictor.py     # Inference logic
│   │   ├── utils/
│   │   │   ├── file\_handler.py
│   │   │   └── data\_utils.py
│   │   └── models/input\_schema.py
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/api.ts
│   │   └── App.tsx
│   ├── Dockerfile
│   ├── vite.config.ts
│   └── package.json
│
├── docker-compose.yml
├── README.md

````

---

## 🧪 Setup & Usage

### ▶️ Local Dev

**Backend**:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
````

**Frontend**:

```bash
cd frontend
npm install
npm run dev
```

Open frontend at `http://localhost:5173`
Open API docs at `http://localhost:8000/docs`

---

### 🐳 Full-stack Docker Deployment

```bash
docker-compose up --build
```

---

## 🖼️ Screenshots

> *(Add screenshots in `/screenshots` folder and update links here)*

| Dashboard                                 | Upload Dataset                      | Model Result                        |
| ----------------------------------------- | ----------------------------------- | ----------------------------------- |
| ![Dashboard](./screenshots/dashboard.png) | ![Upload](./screenshots/upload.png) | ![Result](./screenshots/result.png) |

---

## 🧑‍💻 Developed by

**Prathamesh More**

📧 [iamprathameshmore07@gmail.com](mailto:iamprathameshmore07@gmail.com)

🔗 [LinkedIn](https://linkedin.com/in/iamprathameshmore)

🔗 [GitHub](https://github.com/iamprathameshmore)


