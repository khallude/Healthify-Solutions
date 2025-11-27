const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Admin = require("../../models/Admin");

// ✅ Use your MongoDB URI
const MONGO_URI = "mongodb+srv://kermueurias8:health-heaven@cluster0.tfv0m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const createSuperAdmin = async () => {
  try {
    // ✅ Connect to MongoDB
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    // ✅ Check if a SuperAdmin already exists
    const existingSuperAdmin = await Admin.findOne({ role: "SuperAdmin" });

    if (existingSuperAdmin) {
      console.log("⚠️ SuperAdmin already exists with email:", existingSuperAdmin.email);
      return;
    }

    // ✅ SuperAdmin credentials
    const superAdminData = {
      username: "superadmin",
      email: "kermueurias8@gmail.com",
      password: "Super@123!",
      role: "SuperAdmin",
      status: "active",
    };

    // ✅ Hash password securely
    const hashedPassword = await bcrypt.hash(superAdminData.password, 10);
    superAdminData.password = hashedPassword;

    // ✅ Create and save the SuperAdmin
    const newSuperAdmin = new Admin(superAdminData);
    await newSuperAdmin.save();

    console.log("🎉 SuperAdmin created successfully!");
    console.log("🧑‍💼 Email:", superAdminData.email);
    console.log("🔐 Hashed Password:", newSuperAdmin.password);
  } catch (error) {
    console.error("❌ Error creating SuperAdmin:", error);
  } finally {
    // ✅ Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected.");
  }
};

createSuperAdmin();
