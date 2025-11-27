from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

# Initialize the Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Paths to the updated model, encoder, and symptoms list
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "disease_model_updated.pkl")
ENCODER_PATH = os.path.join(BASE_DIR, "label_encoder_updated.pkl")
SYMPTOMS_PATH = os.path.join(BASE_DIR, "symptoms_list.txt")

# Load the model and label encoder
try:
    model = joblib.load(MODEL_PATH)
    label_encoder = joblib.load(ENCODER_PATH)
except Exception as e:
    raise RuntimeError(f"Failed to load the model or encoder: {e}")

# Load the symptoms list
try:
    with open(SYMPTOMS_PATH, "r") as file:
        symptoms = [line.strip() for line in file if line.strip()]
except Exception as e:
    raise RuntimeError(f"Failed to load the symptoms list: {e}")

@app.route('/symptoms', methods=['GET'])
def get_symptoms():
    """Endpoint to get the list of symptoms."""
    return jsonify(symptoms)

@app.route('/predict', methods=['POST'])
def predict():
    """Endpoint to predict the disease based on symptoms."""
    try:
        # Parse user input from the JSON body
        user_data = request.json

        # Validate input format
        if not isinstance(user_data, dict):
            return jsonify({"error": "Invalid input format. Must be a JSON object."}), 400

        # Initialize input vector with zeros for the full feature set
        input_vector = np.zeros(len(symptoms))

        # Populate the input vector based on symptoms selected by the user
        for symptom, value in user_data.items():
            if symptom in symptoms:
                index = symptoms.index(symptom)
                try:
                    value = int(value)
                    if value not in [0, 1]:
                        return jsonify({"error": f"Invalid value for symptom '{symptom}'. Must be 0 or 1."}), 400
                    input_vector[index] = value
                except ValueError:
                    return jsonify({"error": f"Invalid value for symptom '{symptom}'. Must be an integer."}), 400

        # Ensure input vector has the correct shape for the model
        if len(input_vector) != model.n_features_in_:
            return jsonify({"error": f"Input has {len(input_vector)} features, but the model expects {model.n_features_in_}."}), 400

        # Make prediction using the loaded model
        prediction_index = model.predict([input_vector])[0]
        predicted_disease = label_encoder.inverse_transform([prediction_index])[0]

        # Calculate confidence score
        confidence = max(model.predict_proba([input_vector])[0]) * 100

        # Construct a success message
        success_message = f"The predicted disease is '{predicted_disease}' with a confidence of {confidence:.2f}%."

        return jsonify({
            "message": success_message,
            "disease": predicted_disease,
            "confidence": confidence
        })

    except Exception as e:
        # Log any unexpected errors
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Run the Flask app
    app.run(debug=True, host='0.0.0.0', port=50001)
