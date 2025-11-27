
import React from 'react';
import { Container, Typography, Grid, Box, Divider, Link } from '@mui/material';

// Updated image import statements
import partner1 from '../assets/images/partner1.jpeg';
import partner2 from '../assets/images/partner2.jpeg';
import partner3 from '../assets/images/partner3.png'; // Updated path

const Footer = () => {
  return (
    <footer style={{ 
      backgroundColor: '#1976d2', // Footer background color
      color: '#fff', 
      padding: '20px 0', // Reduced padding for a shorter footer
      marginTop: '60px', // Margin-top for space from content above
    }}>
      <Container>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom align="center" style={{ fontSize: '1rem', fontWeight: 'bold' }}>
              About Us
            </Typography>
            <Typography variant="body2" align="center" style={{ fontSize: '0.875rem' }}>
              Health Heaven is dedicated to simplifying health management with an easy-to-use platform for scheduling appointments, setting reminders, and managing medical records.
            </Typography>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom align="center" style={{ fontSize: '1rem', fontWeight: 'bold' }}>
              Quick Links
            </Typography>
            <Box textAlign="center">
              <Typography variant="body2" style={{ fontSize: '0.875rem' }}>
                <Link href="/appointments" color="inherit" underline="hover">
                  Schedule Appointment
                </Link>
              </Typography>
              <Typography variant="body2" style={{ fontSize: '0.875rem' }}>
                <Link href="/reminders" color="inherit" underline="hover">
                  Set Reminders
                </Link>
              </Typography>
              <Typography variant="body2" style={{ fontSize: '0.875rem' }}>
                <Link href="/records" color="inherit" underline="hover">
                  Manage Records
                </Link>
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom align="center" style={{ fontSize: '1rem', fontWeight: 'bold' }}>
              Contact Us
            </Typography>
            <Typography variant="body2" align="center" style={{ fontSize: '0.875rem' }}>
              Email: <Link href="mailto:support@healthheaven.com" color="inherit" underline="hover">support@healthheaven.com</Link>
            </Typography>
            <Typography variant="body2" align="center" style={{ fontSize: '0.875rem' }}>
              Phone: <Link href="tel:+1234567890" color="inherit" underline="hover">+1 (234) 567-890</Link>
            </Typography>
          </Grid>
        </Grid>

        <Divider style={{ margin: '20px 0', backgroundColor: '#fff' }} />

        {/* Trusted Partners Section */}
        <Typography variant="h6" gutterBottom align="center" style={{ color: '#ffeb3b', marginBottom: '10px', fontSize: '1.25rem', fontWeight: 'bold' }}>
          Our Trusted Partners
        </Typography>
        <Grid container spacing={1} justifyContent="center">
          <Grid item xs={4} sm={2} style={{ textAlign: 'center' }}>
            <img src={partner1} alt="Partner 1" style={{ 
              borderRadius: '50%', // Makes the image circular
              maxWidth: '100px',   // Reduces the size of the image
              height: '100px',     // Sets a fixed height to keep the circular shape
              objectFit: 'cover',  // Ensures the image covers the area without distortion
              margin: '0 auto' 
            }} />
          </Grid>
          <Grid item xs={4} sm={2} style={{ textAlign: 'center' }}>
            <img src={partner2} alt="Partner 2" style={{ 
              borderRadius: '50%', // Makes the image circular
              maxWidth: '100px',   // Reduces the size of the image
              height: '100px',     // Sets a fixed height to keep the circular shape
              objectFit: 'cover',  // Ensures the image covers the area without distortion
              margin: '0 auto' 
            }} />
          </Grid>
          <Grid item xs={4} sm={2} style={{ textAlign: 'center' }}>
            <img src={partner3} alt="Partner 3" style={{ 
              borderRadius: '50%', // Makes the image circular
              maxWidth: '100px',   // Reduces the size of the image
              height: '100px',     // Sets a fixed height to keep the circular shape
              objectFit: 'cover',  // Ensures the image covers the area without distortion
              margin: '0 auto' 
            }} />
          </Grid>
        </Grid>

        <Typography variant="body2" color="textSecondary" align="center" style={{ marginTop: '20px', fontSize: '0.875rem' }}>
          © 2024 Health Heaven. All rights reserved.
        </Typography>
      </Container>
    </footer>
  );
};

export default Footer;