import pandas as pd
from sklearn.model_selection import train_test_split
# from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib
import os

# Define paths
current_dir = os.path.dirname(os.path.abspath(__file__))
dataset_path = os.path.join(current_dir, "Training.csv")
model_path = os.path.join(current_dir, "disease_model_updated.pkl")
encoder_path = os.path.join(current_dir, "label_encoder_updated.pkl")
symptoms_path = os.path.join(current_dir, "symptoms_list.txt")

# Load the dataset
if not os.path.exists(dataset_path):
    raise FileNotFoundError(f"Dataset file not found at {dataset_path}. Please ensure the file exists.")

data = pd.read_csv(dataset_path)

# Handle missing values
if data.isnull().values.any():
    print("Missing values detected. Handling missing values...")
    data = data.fillna(0)

# Validate dataset structure
if data.shape[1] < 2:
    raise ValueError("The dataset does not contain enough columns for features and target.")

# Separate features and target
X = data.iloc[:, :-1]  # Features
y = data.iloc[:, -1]   # Target (Disease)

# Save the list of symptoms for the server
symptoms_list = X.columns.tolist()
with open(symptoms_path, "w") as f:
    f.write("\n".join(symptoms_list))
print(f"Symptoms list saved successfully at {symptoms_path}")

# Ensure consistency of features (e.g., during one-hot encoding)
X_encoded = X  # If the dataset doesn't require one-hot encoding

# Encode the target labels
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X_encoded, y_encoded, test_size=0.2, random_state=42)

# Train the model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save the model and label encoder
joblib.dump(model, model_path)
joblib.dump(label_encoder, encoder_path)

print(f"Model saved successfully at {model_path}")
print(f"Label encoder saved successfully at {encoder_path}")

# Display feature and target validation
print(f"Model trained with {len(symptoms_list)} features.")
