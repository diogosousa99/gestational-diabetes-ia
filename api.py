from http.client import HTTPException
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.preprocessing import StandardScaler

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

rfc = joblib.load("assets/rfc.pkl")
etc = joblib.load("assets/etc.pkl")
gbc = joblib.load("assets/gbc.pkl")
abc = joblib.load("assets/abc.pkl")
lgr = joblib.load("assets/lgr.pkl")
xgb = joblib.load("assets/xgb.pkl")
lgb = joblib.load("assets/lgb.pkl")

models = {
    "rfc": rfc,
    "etc": etc,
    "gbc": gbc,
    "abc": abc,
    "lgr": lgr,
    "xgb": xgb,
    "lgb": lgb
}

data = pd.read_csv('assets/data.csv')

binaryFeatures = ['Heredity']
continuousFeatures = ['Age', 'Pregnancy No', 'Weight', 'Height', 'BMI']
features = binaryFeatures + continuousFeatures

x = data[features]
y = data['Prediction']

x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=42)
scaler = StandardScaler()
x_train[continuousFeatures] = scaler.fit_transform(x_train[continuousFeatures])
x_test[continuousFeatures] = scaler.transform(x_test[continuousFeatures])

metrics = {}

for modelName, model in models.items():
    model.fit(x_train, y_train)
    y_pred = model.predict(x_test)
    metrics[modelName] = {
        "accuracy": accuracy_score(y_test, y_pred),
        "precision": precision_score(y_test, y_pred),
        "recall": recall_score(y_test, y_pred),
        "f1": f1_score(y_test, y_pred)
    }

def predictDiabetes(inputData, modelName):
    model = models.get(modelName)
    inputDf = pd.DataFrame([inputData])

    for col in features:
        if col not in inputDf.columns:
             raise ValueError(f"Missing column: {col}")
        
    missingCols = set(x_train.columns) - set(inputDf.columns)
    for col in missingCols:
        inputDf[col] = 0

    inputDf = inputDf[x_train.columns]
    inputDf[continuousFeatures] = scaler.transform(inputDf[continuousFeatures])

    if inputDf.isnull().values.any():
        raise ValueError("Missing values in input data")
    
    probability = model.predict_proba(inputDf)[:, 1]
    
    return probability[0]


class DiabetesInput(BaseModel):
    age: float
    pregnancyNo: float
    weight: float
    height: float
    bmi: float
    heredity: int = Field(ge=0, le=1)

@app.post("/predict/{modelName}")
def predict(modelName: str, data: DiabetesInput):
    try:
        input_data_dict = data.dict()

        input_data = {
            'Age': input_data_dict['age'],
            'Pregnancy No': input_data_dict['pregnancyNo'],
            'Weight': input_data_dict['weight'],
            'Height': input_data_dict['height'],
            'BMI': input_data_dict['bmi'],
            'Heredity': input_data_dict['heredity']
        }
        
        prediction = predictDiabetes(input_data, modelName)
        
        prediction = float(prediction)
        
        model_metrics = {k: float(v) for k, v in metrics[modelName].items()}
        
        return {
            "prediction": prediction,
            "metrics": model_metrics
        }
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/metadata")
def metadata():
    return {
        "models": [
            {
                "shortName": "rfc",
                "fullName": "Random Forest Classifier",
            },
            {
                "shortName": "etc",
                "fullName": "Extra Trees Classifier",
            },
            {
                "shortName": "gbc",
                "fullName": "Gradient Boosting Classifier",
            },
            {
                "shortName": "abc",
                "fullName": "AdaBoost Classifier",
            },
            {
                "shortName": "lgr",
                "fullName": "Logistic Regression",
            },
            {
                "shortName": "xgb",
                "fullName": "XGBoost Classifier",
            },
            {
                "shortName": "lgb",
                "fullName": "LightGBM Classifier",
            }
        ],
        "features": [
            {
                "name": "age",
                "uiName": "Age",
                "description": "Age of the patient",
            },
            {
                "name": "pregnancyNo",
                "uiName": "Pregnancy No",
                "description": "Number of pregnancies",
            },
            {
                "name": "weight",
                "uiName": "Weight",
                "description": "Weight of the patient",
            },
            {
                "name": "height",
                "uiName": "Height",
                "description": "Height of the patient (in cm)",
            },
            {
                "name": "bmi",
                "uiName": "BMI",
                "description": "Body Mass Index of the patient",
            },
            {
                "name": "heredity",
                "uiName": "Family History",
                "description": "Whether the patient has a family history of diabetes",
            }
        ]
    }
