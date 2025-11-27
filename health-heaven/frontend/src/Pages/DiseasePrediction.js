import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Checkbox,
  FormControlLabel,
  Paper,
} from "@mui/material";
import axios from "axios";
import { AlertCircle } from "lucide-react";

function DiseasePrediction() {
  const [symptoms, setSymptoms] = useState([]);
  const [filteredSymptoms, setFilteredSymptoms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userInputs, setUserInputs] = useState({});
  const [prediction, setPrediction] = useState("");
  const [confidence, setConfidence] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetchingSymptoms, setFetchingSymptoms] = useState(true);

  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const response = await axios.get("http://localhost:50001/symptoms");
        setSymptoms(response.data);
        setFilteredSymptoms(response.data.slice(0, 9));
      } catch (err) {
        setError("Failed to fetch symptoms. Please try again later.");
      } finally {
        setFetchingSymptoms(false);
      }
    };
    fetchSymptoms();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredSymptoms(symptoms.slice(0, 9));
    } else {
      const matchedSymptoms = symptoms.filter((symptom) =>
        symptom.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSymptoms(matchedSymptoms.slice(0, 9));
    }
  }, [searchTerm, symptoms]);

  const handleInputChange = (e) => {
    const { name, checked } = e.target;
    setUserInputs((prev) => ({ ...prev, [name]: checked ? 1 : 0 }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(userInputs).filter(Boolean).length === 0) {
      setError("Please select at least one symptom");
      return;
    }

    setLoading(true);
    setError("");
    setPrediction("");
    setConfidence(null);

    try {
      const response = await axios.post("http://localhost:50001/predict", userInputs);
      setPrediction(response.data.disease);
      setConfidence(response.data.confidence);
      setUserInputs({});
    } catch (err) {
      setError("An error occurred while fetching the prediction.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setUserInputs({});
    setPrediction("");
    setConfidence(null);
    setError("");
  };

  return (
    <Box maxWidth="900px" mx="auto" my={4} px={2}>
      <Typography variant="h4" gutterBottom>
        Disease Prediction
      </Typography>
      <Typography variant="body1" color="textSecondary" mb={2}>
        Select your symptoms to get a preliminary disease prediction. This tool is
        for educational purposes only and does not replace professional medical advice.
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        {error && (
          <Box
            sx={{
              mb: 2,
              p: 1.5,
              bgcolor: "#fdecea",
              border: "1px solid #f5c2c7",
              borderRadius: 1,
              color: "#b71c1c",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <AlertCircle />
            <Typography variant="body2">{error}</Typography>
          </Box>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            placeholder="Search symptoms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={fetchingSymptoms}
            sx={{ mb: 2 }}
            variant="outlined"
            size="medium"
          />

          <Grid container spacing={1}>
            {filteredSymptoms.map((symptom) => (
              <Grid item xs={12} sm={6} md={4} key={symptom}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!userInputs[symptom]}
                      onChange={handleInputChange}
                      name={symptom}
                      disabled={loading}
                    />
                  }
                  label={symptom.replace(/_/g, " ")}
                />
              </Grid>
            ))}
          </Grid>

          <Box mt={3} display="flex" gap={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading || Object.values(userInputs).filter(Boolean).length === 0}
            >
              {loading ? "Predicting..." : "Predict Disease"}
            </Button>
            <Button variant="outlined" onClick={resetForm}>
              Reset
            </Button>
          </Box>
        </form>
      </Paper>

      {prediction && (
        <Paper sx={{ p: 3, backgroundColor: "#e8f5e9" }}>
          <Typography variant="h6" gutterBottom>
            Prediction Result
          </Typography>
          <Typography>
            <strong>Predicted Disease:</strong> {prediction}
          </Typography>
          {confidence != null && (
            <Typography>
              <strong>Confidence:</strong> {confidence.toFixed(2)}%
            </Typography>
          )}
        </Paper>
      )}
    </Box>
  );
}

export default DiseasePrediction;
