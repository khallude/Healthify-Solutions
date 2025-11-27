const fs = require("fs");
const csv = require("csv-parser");

const getSymptomsFromCSV = () => {
  return new Promise((resolve, reject) => {
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
      .on("end", () => resolve(symptoms))
      .on("error", (error) => reject(error));
  });
};

module.exports = { getSymptomsFromCSV };
