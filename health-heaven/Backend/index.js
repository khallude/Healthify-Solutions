const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const Newuser = require('./routes/Newuser'); 
// Ensure the path is correct

// Ensure the path is correct
const appointmentRoutes = require('./routes/appointmentRoutes'); // Import Appointment routes
const reminderRoutes = require('./routes/reminderRoutes');
const cronJob = require('../Backend/Controller/Service/cron'); // Import the cron job
const medicalRecordRoutes = require('../Backend/routes/medicalRecordRoutes'); 
const predictionRoutes = require("./routes/predictionRoutes");
const passwordRoutes = require('./routes/passwordRoutes'); // Import the password routes
const connectDB = require('../Backend/DB'); // DB connection
const connectCloudinary = require('./config/cloudinary');
const dRoutes = require('./routes/DRoutes');
const adminRoutes =   require("./routes/adminRoutes");
const blogRoutes = require("./routes/blogRoutes");
// const superAdminRoutes = require("./routes/superAdmin");

const app = express();



// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Use the admin routes
app.use('/api/newusers', Newuser);

app.use('/api/appointments', appointmentRoutes); 
app.use("/api/admin", adminRoutes)
// app.use("/api", superAdminRoutes);
app.use('/api/doctor', dRoutes );
app.use('/api', reminderRoutes); 
app.use('/api/medical-records', medicalRecordRoutes);
app.use("/api", predictionRoutes);
app.use('/api/password', passwordRoutes); 
app.use('/api/blog', blogRoutes);
console.log(`MONGO_URI: ${process.env.MONGO_URI}`);
console.log(`PORT: ${process.env.PORT}`);

// Connect to MongoDB
connectDB();

connectCloudinary();
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
