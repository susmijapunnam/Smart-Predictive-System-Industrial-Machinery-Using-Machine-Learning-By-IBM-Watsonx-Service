# Smart Predictive System for Industrial Machinery Using Machine Learning

## Project Overview
The Smart Predictive System for Industrial Machinery Using Machine Learning is an intelligent solution designed to predict potential machine failures before they occur. Industrial equipment continuously generates operational data through sensors that monitor parameters such as air temperature, process temperature, rotational speed, torque, and tool wear. By analyzing this data, machine learning algorithms can identify patterns associated with equipment failures and predict whether a machine is likely to fail.

## IBM Watson Studio — AutoAI Project
- **Platform:** IBM Watsonx.ai (Watson Studio)
- **Method:** AutoAI (Automated Machine Learning)
- **Creator:** psusmija@gmail.com

## 🚀 Features

- Predicts machine failures before they occur
- Supports predictive maintenance strategies
- Uses IBM watsonx.ai AutoAI for automated model development
- Performs automatic data preprocessing and feature engineering
- Optimizes models using hyperparameter tuning
- Provides high-accuracy machine failure prediction
- Deployable on IBM Cloud using watsonx.ai Runtime

## Dataset
The dataset (data/predictive_maintenance.csv) contains sensor readings from industrial machines with the following features:

| Column | Description |
|---|---|
| UDI | Unique Device Identifier |
| Product ID | Product serial number |
| Type | Machine type (L/M/H) |
| Air temperature [K] | Air temperature in Kelvin |
| Process temperature [K] | Process temperature in Kelvin |
| Rotational speed [rpm] | Rotational speed in RPM |
| Torque [Nm] | Torque in Newton-metres |
| Tool wear [min] | Tool wear in minutes |
| Target | 0 = No Failure, 1 = Failure |
| Failure Type | Type of failure (if any) |

### 🎯 Target Variable

**Target**

- **0** → No Machine Failure
- **1** → Machine Failure

## 🛠 Technologies Used

- IBM Cloud
- IBM watsonx.ai Studio
- IBM watsonx.ai Runtime
- IBM AutoAI
- Machine Learning
- Predictive Analytics


## 🤖 Machine Learning Model

**Algorithm Used**

- Batched Tree Ensemble Classifier (Snap Random Forest Classifier)

### Accuracy

**99.9% Cross Validation Accuracy**

---

## 🔄 Project Workflow

1. Data Collection
2. Data Preprocessing
3. Feature Engineering
4. AutoAI Model Training
5. Hyperparameter Optimization
6. Model Evaluation
7. Model Selection
8. Model Deployment
9. Machine Failure Prediction

---

## 📈 Benefits

- Reduces unexpected machine failures
- Minimizes production downtime
- Improves equipment reliability
- Lowers maintenance costs
- Enhances operational efficiency
- Supports predictive maintenance

---

## 📌 Future Scope

- Integration with Industrial IoT (IIoT)
- Real-time machine monitoring
- Explainable AI (XAI)
- Mobile and Web Dashboard
- Cloud-based monitoring system
- Deep Learning-based predictive models
- Industry 4.0 integration



## 📂 Repository Structure

```text
Smart-Predictive-System/
│
├── data/
│   └── predictive_maintenance.csv
│
├── notebooks/
│   ├── AutoAI_Experiment.ipynb
│   └── AutoAI_Best_Pipeline_P9.ipynb
│
├── model/
│   ├── model_pipeline_v1.bin
│   └── model_pipeline_v2.bin
│
├── presentation/
│   └── Smart_Predictive_System_Presentation.pptx
│
├── README.md
└── .gitignore
```
`

## Model Approach
- **Tool:** IBM AutoAI (automated pipeline generation)
- **Best Pipeline:** P9 (selected by AutoAI based on accuracy metrics)
- **Task:** Binary classification — predict machine failure (Target: 0 or 1)
- **Failure Types Detected:** Tool Wear Failure, Heat Dissipation Failure, Power Failure, Overstrain Failure, Random Failures

## How to Run the Notebooks
1. Import notebooks into [IBM Watson Studio](https://dataplatform.cloud.ibm.com)
2. Upload data/predictive_maintenance.csv as a data asset
3. Run AutoAI_Experiment.ipynb to re-run the AutoAI experiment
4. Run AutoAI_Best_Pipeline_P9.ipynb to explore the best pipeline

## Requirements
- IBM Cloud account
- Watson Studio (IBM watsonx.ai)
- Python 3.8+
- ibm-watson-machine-learning
- pandas, scikit-learn, utoai-libs

## 👨‍💻 Developed By

**Susmija Punnam**

AICTE – Edunet Foundation – IBM SkillsBuild Internship

---

## 🙏 Acknowledgements

I would like to express my sincere gratitude to:

- AICTE
- Edunet Foundation Team
- IBM SkillsBuild
- IBM watsonx.ai Services
- Internship Mentors
for providing the opportunity, guidance, and resources to successfully complete this project.

## License
This project was developed as part of the AICTE–IBM University Engagement programme.
