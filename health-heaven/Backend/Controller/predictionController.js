const fs = require("fs");
const csv = require("csv-parser");

// Fetch symptoms from the CSV file
const getSymptoms = (req, res) => {
  const symptoms = [];
  fs.createReadStream("Training.csv")
    .pipe(csv())
    .on("headers", (headers) => {
      headers.forEach((header) => {
        if (header.toLowerCase() !== "prognosis" && header.trim() !== "") {
          symptoms.push(header);
        }
      });
    })
    .on("end", () => {
      res.json(symptoms);
    })
    .on("error", (error) => {
      console.error("Error reading CSV:", error);
      res.status(500).json({ error: "Unable to fetch symptoms" });
    });
};

// Predict disease based on symptoms
const predictDisease = (req, res) => {
  const symptoms = req.body;

  // Mock prediction logic
  if (!symptoms || Object.keys(symptoms).length === 0) {
    return res.status(400).json({ error: "No symptoms provided" });
  }

  // Example: Return a dummy prediction
  if (symptoms.fever) {
    res.json({ disease: "Common Cold" });
  } else {
    res.json({ disease: "Unknown Disease" });
  }
};

module.exports = { getSymptoms, predictDisease };
