import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Avatar,
  IconButton,
  TextField,
  Switch,
  Card,
  CardContent,
  CardHeader,
  LinearProgress,
  Divider,
} from '@mui/material';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import HomeIcon from '@mui/icons-material/Home';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FolderIcon from '@mui/icons-material/Folder';
import BarChartIcon from '@mui/icons-material/BarChart';
import LogoutIcon from '@mui/icons-material/Logout';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Icon Style
const iconStyle = { color: '#fff', marginRight: 8 };

const PatientDashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profileEditable, setProfileEditable] = useState(false);
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
  });

  // Fetch user data from the API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/user');  // Update with your actual API endpoint
        setUserData(response.data); // Assuming the API returns an object with 'fullName' and 'email'
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  // Toggle Dark Mode
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // Handle Profile Edit
  const handleProfileEdit = () => setProfileEditable(!profileEditable);

  // Handle Logout
  const handleLogout = () => {
    // Clear session or local storage, then redirect to login
    console.log('Logged out!');
  };

  // Chart Data for the Patient's Health Statistics
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Steps Taken',
        data: [3000, 4500, 5000, 3000, 4000, 6000, 5000],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Calories Burnt',
        data: [200, 250, 300, 200, 180, 220, 250],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  // Placeholder Health Stats
  const healthStats = {
    bloodPressure: '120/80 mmHg',
    weight: '75 kg',
    bmi: '24.5',
  };

  // Placeholder Health Goals
  const healthGoals = {
    stepsGoal: 10000,
    caloriesGoal: 2500,
    currentSteps: 5000,
    currentCalories: 2000,
  };

  return (
    <Box sx={{ display: 'flex', backgroundColor: isDarkMode ? '#333' : '#f5f5f5', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Box sx={{ width: 250, backgroundColor: '#1976d2', color: '#fff', minHeight: '100vh', padding: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
          <Avatar sx={{ width: 60, height: 60, marginRight: 2 }} alt={userData.fullName} />
          <Box>
            <Typography variant="h6">{userData.fullName || 'Loading...'}</Typography>
            <Typography variant="body2">{userData.email || 'Loading...'}</Typography>
            <IconButton onClick={handleProfileEdit} sx={{ color: 'white' }}>
              <EditIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Dark Mode Toggle */}
        <Box sx={{ marginTop: 2 }}>
          <Switch checked={isDarkMode} onChange={toggleDarkMode} />
          <Typography variant="body2" color="white" sx={{ marginLeft: 1 }}>
            Dark Mode
          </Typography>
        </Box>

        {/* Navigation Menu */}
        <Grid container spacing={2} sx={{ marginTop: 3 }}>
          <Grid item xs={12}>
            <Link to="/" style={{ textDecoration: 'none', color: '#fff' }}>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                <HomeIcon style={iconStyle} /> Home
              </Typography>
            </Link>
          </Grid>
          <Grid item xs={12}>
            <Link to="/appointments" style={{ textDecoration: 'none', color: '#fff' }}>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarTodayIcon style={iconStyle} /> Appointments
              </Typography>
            </Link>
          </Grid>
          <Grid item xs={12}>
            <Link to="/records" style={{ textDecoration: 'none', color: '#fff' }}>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                <FolderIcon style={iconStyle} /> Records
              </Typography>
            </Link>
          </Grid>
          <Grid item xs={12}>
            <Link to="/doctor" style={{ textDecoration: 'none', color: '#fff' }}>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                <BarChartIcon style={iconStyle} /> Doctor
              </Typography>
            </Link>
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="body2"
              sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              onClick={handleLogout}
            >
              <LogoutIcon style={iconStyle} /> Logout
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, padding: 3 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 4,
          }}
        >
          Welcome, {userData.fullName || 'Loading...'}!
        </Typography>

        {/* Profile Edit Section */}
        {profileEditable && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                defaultValue={userData.fullName}
                onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                defaultValue={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              />
            </Grid>
          </Grid>
        )}

        {/* Health Overview and Goals */}
        <Grid container spacing={3} sx={{ marginTop: 3 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ padding: 2, boxShadow: 3, backgroundColor: 'white' }}>
              <CardHeader title="Health Overview" sx={{ backgroundColor: '#1976d2', color: '#fff' }} />
              <CardContent>
                <Typography variant="body1">Blood Pressure: {healthStats.bloodPressure}</Typography>
                <Typography variant="body1">Weight: {healthStats.weight}</Typography>
                <Typography variant="body1">BMI: {healthStats.bmi}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ padding: 2, boxShadow: 3, backgroundColor: 'white' }}>
              <CardHeader title="Health Goals Tracker" sx={{ backgroundColor: '#1976d2', color: '#fff' }} />
              <CardContent>
                <Typography variant="body1">
                  Steps Goal: {healthGoals.stepsGoal} | Current: {healthGoals.currentSteps}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(healthGoals.currentSteps / healthGoals.stepsGoal) * 100}
                  sx={{ marginTop: 2 }}
                />
                <Typography variant="body1" sx={{ marginTop: 2 }}>
                  Calories Goal: {healthGoals.caloriesGoal} | Current: {healthGoals.currentCalories}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(healthGoals.currentCalories / healthGoals.caloriesGoal) * 100}
                  sx={{ marginTop: 2 }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Activity */}
        <Grid container spacing={3} sx={{ marginTop: 3 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ padding: 2, boxShadow: 3, backgroundColor: 'white' }}>
              <CardHeader title="Notifications" sx={{ backgroundColor: '#1976d2', color: '#fff' }} />
              <CardContent>
                <Typography variant="body1">You walked 3000 steps on Monday</Typography>
                <Typography variant="body1">You burned 200 calories on Monday</Typography>
                <Typography variant="body1" sx={{ marginTop: 1 }}>
                  Next goal: Reach 5000 steps by Wednesday!
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Activity Tracker */}
          <Grid item xs={12} md={8}>
            <Card sx={{ padding: 2, boxShadow: 3, backgroundColor: 'white' }}>
              <CardHeader title="Activity Tracker" sx={{ backgroundColor: '#1976d2', color: '#fff' }} />
              <CardContent sx={{ height: 300 }}>
                <Bar data={chartData} options={{ responsive: true }} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default PatientDashboard;
