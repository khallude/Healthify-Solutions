const express = require("express");
const router = express.Router();
const { getSymptoms, predictDisease } = require("../Controller/predictionController");

// Route to fetch symptoms
router.get("/symptoms", getSymptoms);

// Route to predict diseases
router.post("/predict", predictDisease);

module.exports = router;
