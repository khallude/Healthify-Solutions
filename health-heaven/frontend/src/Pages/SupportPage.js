import React from 'react';
import { Container, Typography, Grid, Paper, TextField, Button, Accordion, AccordionSummary, AccordionDetails, Card, CardContent, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';

// Sample FAQs
const faqs = [
  { question: 'How can I reset my password?', answer: 'Click "Forgot Password" on the login page and follow the instructions.' },
  { question: 'How do I contact support?', answer: 'You can call us at +1 (800) 123-4567 or email at support@healthheaven.com.' },
  { question: 'What are your support hours?', answer: 'Our team is available Monday to Friday from 9:00 AM to 6:00 PM.' },
];

const Support = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 5, color: '#333' }}>
      {/* Page Title */}
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
          Support Center
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, margin: '0 auto', mt: 2 }}>
          Need help? Our team is ready to assist you with any issue. Find quick answers in the FAQ, or reach out to us directly.
        </Typography>
      </Box>

      {/* Contact Information */}
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ p: 4, borderRadius: 2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <PhoneIcon fontSize="large" sx={{ color: '#3498db' }} />
              <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>Call Us</Typography>
              <Typography variant="body1" color="text.secondary">+1 (800) 123-4567</Typography>
              <Typography variant="body2" color="text.secondary">Mon-Fri, 9:00 AM - 6:00 PM</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card sx={{ p: 4, borderRadius: 2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <EmailIcon fontSize="large" sx={{ color: '#e67e22' }} />
              <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>Email Us</Typography>
              <Typography variant="body1" color="text.secondary">support@healthheaven.com</Typography>
              <Typography variant="body2" color="text.secondary">Typically respond within 24 hours</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* FAQ Section */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center', color: '#34495e' }}>Frequently Asked Questions</Typography>
        <Grid container spacing={2}>
          {faqs.map((faq, index) => (
            <Grid item xs={12} key={index}>
              <Accordion sx={{ borderRadius: 2, boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`faq${index}-content`} id={`faq${index}-header`}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" color="text.secondary">{faq.answer}</Typography>
                </AccordionDetails>
              </Accordion>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Support Form */}
      <Box sx={{ mt: 8 }}>
        <Paper elevation={4} sx={{ p: 5, borderRadius: 3, backgroundColor: '#ecf0f1' }}>
          <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 'bold', color: '#2980b9', textAlign: 'center' }}>
            Submit a Support Request
          </Typography>
          <Typography variant="body1" paragraph align="center" color="text.secondary" sx={{ maxWidth: 600, margin: '0 auto', mb: 4 }}>
            Fill out the form below and one of our support agents will get back to you as soon as possible.
          </Typography>
          <form noValidate autoComplete="off">
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Full Name" variant="outlined" required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Email Address" variant="outlined" type="email" required />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Subject" variant="outlined" required />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Message" variant="outlined" multiline rows={4} required />
              </Grid>
              <Grid item xs={12}>
                <Button fullWidth variant="contained" color="primary" size="large" sx={{ p: 1.5 }}>
                  Submit Request
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>

      {/* Customer Service Hours */}
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <ContactSupportIcon fontSize="large" sx={{ color: '#16a085' }} />
        <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>Customer Service Hours</Typography>
        <Typography variant="body1" color="text.secondary">Monday to Friday: 9:00 AM - 6:00 PM</Typography>
      </Box>
    </Container>
  );
};

export default Support;
