
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

## ✨ Features

- 📁 Upload CSV datasets directly from the React dashboard
- 🧠 AutoML engine using **AutoGluon** (classification & regression)
- 🧹 Automatic data preprocessing, training & model storage
- 🧪 Test predictions from the UI using real-time input
- 🔌 REST APIs exposed for each trained model
- 💻 Swagger/OpenAPI auto-generated docs
- 🐳 1-click Docker-based full-stack deployment

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


