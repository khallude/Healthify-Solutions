import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
// import ChatIcon from "@mui/icons-material/Chat";
import MarkChatUnreadIcon from "@mui/icons-material/MarkChatUnread";
import BarChartIcon from "@mui/icons-material/BarChart";
import SchoolIcon from "@mui/icons-material/School";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import InfoIcon from "@mui/icons-material/Info";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DashboardIcon from "@mui/icons-material/Dashboard"; // Import Dashboard Icon
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const Header = () => {
  const [userProfile, setUserProfile] = useState([]);
  const navigate = useNavigate();
  const iconStyle = { fontSize: "18px", marginRight: "8px" }; // Adjust icon size
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming you store the token in localStorage
        if (!token) {
          console.log("No token found");
          return;
        }

      
        console.log("Token:", token);    
        const userResponse = await axios.get('http://localhost:5000/api/newusers/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setUserProfile(userResponse.data.user);
      
          console.log("User Data:", userResponse.data.user);
      } catch (error) {
        console.error("Error fetching data:", error);
      
        // navigate("/login"); 
      }
    };

    fetchUserData(); 
  }, []);

  return (
    <Box>
      {/* First Header (Green Gradient Background for Health) */}
      <AppBar
        position="static"
        style={{
          background:
            "linear-gradient(135deg, #66bb6a 0%, #43a047 50%, #2e7d32 100%)",
        }}
      >
        <Toolbar>
          <Typography
            variant="h5"
            style={{
              flexGrow: 1,
              fontFamily: "Roboto, sans-serif",
              fontWeight: "bold",
              letterSpacing: "1px",
            }}
          >
            Healthify Solutions
          </Typography>
          <Button color="inherit" component={Link} to="/homepage">
            <HomeIcon style={iconStyle} /> Home
          </Button>
          <Button color="inherit" component={Link} to="/appointments">
            <CalendarTodayIcon style={iconStyle} /> Appointments
          </Button>
          <Button color="inherit" component={Link} to="/messenger">
            <MarkChatUnreadIcon style={iconStyle} /> Chat
          </Button>
          <Button color="inherit" component={Link} to="/doctor">
            <BarChartIcon style={iconStyle} /> Doctor
          </Button>
          <Button color="inherit" component={Link} to="/dashboard1">
            {" "}
            {/* Add Dashboard link */}
            <DashboardIcon style={iconStyle} /> Dashboard
          </Button>
          <Button color="inherit" component={Link} to="/education">
            <SchoolIcon style={iconStyle} /> Education
          </Button>
        </Toolbar>
      </AppBar>

      {/* Second Header (Flat Background Color, Reduced Height) */}
      <AppBar
        position="static"
        style={{ backgroundColor: "#1976d2", height: "40px" }} // Flat background color and reduced height
      >
        <Toolbar style={{ minHeight: "40px" }}>
          {" "}
          {/* Reduce toolbar height */}
          <Typography
            variant="body2"
            style={{
              flexGrow: 1,
              fontFamily: "Arial, sans-serif",
              color: "#fff",
            }}
          >
            Contact us: (555) 555-5555 | Email: info@healthheaven.com
          </Typography>
          <Button color="inherit" component={Link} to="/about">
            <InfoIcon style={iconStyle} /> About Us
          </Button>
          <Button color="inherit" component={Link} to="/support">
            <ContactMailIcon style={iconStyle} /> Support
          </Button>
          <div className="flex items-center justify-between space-x-1" >            
          <FaUserCircle className="text-green-600  " size={20} />
          {/* <p className="font-semibold mb-1" >
            {userProfile.fullName}</p> */}
          </div>
          {/* <Button color="inherit" component={Link} to="/login">
            <LoginIcon style={iconStyle} /> Login
          </Button>
          <Button color="inherit" component={Link} to="/signup">
            <PersonAddIcon style={iconStyle} /> Signup
          </Button> */}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;