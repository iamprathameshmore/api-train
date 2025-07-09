import pandas as pd
import pickle
import os
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, r2_score


def train_and_save_model(file_path: str, model_type: str, save_path: str) -> dict:
    # Load dataset
    ext = file_path.lower().split('.')[-1]
    if ext == "csv":
        df = pd.read_csv(file_path)
    elif ext in ["xlsx", "xls"]:
        df = pd.read_excel(file_path)
    elif ext == "json":
        df = pd.read_json(file_path)
    else:
        raise ValueError("❌ Unsupported file format: only csv, xlsx, xls, json supported.")

    if df.shape[1] < 2:
        raise ValueError("❌ Dataset must have at least two columns (features + target).")

    # Prepare features and target
    X = df.iloc[:, :-1]
    y = df.iloc[:, -1]

    # Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train model
    if model_type == "linear_regression":
        model = LinearRegression()
    elif model_type == "decision_tree":
        model = DecisionTreeClassifier()
    else:
        raise ValueError("❌ Unsupported model type. Use 'linear_regression' or 'decision_tree'.")

    model.fit(X_train, y_train)

    # Evaluate
    y_pred = model.predict(X_test)
    if model_type == "linear_regression":
        score = r2_score(y_test, y_pred)
        metric = "r2_score"
    else:
        score = accuracy_score(y_test, y_pred)
        metric = "accuracy"

    # Save the model
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    with open(save_path, "wb") as f:
        pickle.dump(model, f)

    return {
        "status": "success",
        "model_type": model_type,
        "saved_to": save_path,
        metric: round(score, 4),
    }
