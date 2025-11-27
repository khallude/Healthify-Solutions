import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/doctor/approved-doctors");
        setDoctors(response.data);
      } catch (err) {
        setError("Error fetching doctors data");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Loading doctors...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={styles.container}>
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Meet Our Doctors
      </h2>

      {/* Search Input */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search by Specialty"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {/* Doctor Cards */}
      <div style={styles.cardsContainer}>
        {filteredDoctors.length === 0 ? (
          <p>No doctors found with this specialty.</p>
        ) : (
          filteredDoctors.map((doctor) => (
            <div key={doctor._id} style={styles.card}>
              <img
                src={doctor.profilePictureUrl || "https://via.placeholder.com/120"}
                alt={doctor.fullName}
                style={styles.image}
              />
              <div style={styles.info}>
                <h3 className="text-blue-500 text-2xl font-bold mb-2">
                  <strong>{doctor.fullName}</strong>
                </h3>
                <p><strong>Specialty:</strong> {doctor.specialty}</p>
                <p><strong>Location:</strong> {doctor.location}</p>
                <p><strong>Experience:</strong> {doctor.experience} years</p>
                <p>
  <strong>📆 </strong> 
  {doctor.workingDays && doctor.workingDays.length > 0
    ? doctor.workingDays.join(" ")
    : "Not available"}
</p>

<p>
  <strong>🧭 </strong>
  {doctor.workingHours
    ? `${doctor.workingHours.startTime} - ${doctor.workingHours.endTime}`
    : "Not available"}
</p>



                <p><strong>Consultation Fees:</strong> ₹{doctor.fees}</p>
                <Button
                  variant="contained"
                  component={Link}
                  to="/appointments"
                  style={styles.button}
                >
                  Book Appointment
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// **Styles Object**
const styles = {
  container: {
    padding: "40px",
    backgroundColor: "#f9f9f9",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  searchContainer: {
    textAlign: "center",
    marginBottom: "20px",
  },
  searchInput: {
    padding: "10px",
    width: "250px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  cardsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)",
    width: "320px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    transition: "transform 0.2s ease-in-out",
  },
  image: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #007bff",
    marginBottom: "15px",
  },
  button: {
    marginTop: "15px",
    backgroundColor: "#007bff",
    color: "white",
    fontWeight: "bold",
    padding: "10px 20px",
    borderRadius: "8px",
  },
};

export default DoctorList;