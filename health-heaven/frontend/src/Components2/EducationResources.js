import React, { useState } from 'react';
import { Container, Typography, Button, Grid, Card, CardContent, CardMedia, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Import local images
import stressImg from '../assets/images/stress.jpeg';
import mentalImg from '../assets/images/Mental.jpeg';
import healthyHabitImg from '../assets/images/Healthy-habit.jpeg';
import nutritionImg from '../assets/images/Nutrition.jpeg';
import sleepImg from '../assets/images/Sleep.jpeg';
import emotionImg from '../assets/images/emotion.jpeg';

// Define the resources with actual image imports
const resources = [
  {
    title: 'Understanding Mental Health',
    description: 'A comprehensive guide to understanding mental health issues, the stigma surrounding it, and how to approach treatment.',
    details: 'This resource provides an in-depth look at mental health issues including various mental health conditions, the impact of stigma, and strategies for seeking help. It also discusses the importance of mental health awareness and the role of support systems in treatment.',
    imageUrl: mentalImg,
  },
  {
    title: 'Managing Stress Effectively',
    description: 'Learn practical techniques to manage and reduce stress in everyday life. This article covers everything from mindfulness to time management.',
    details: 'Effective stress management is crucial for maintaining overall well-being. This article explores various techniques such as mindfulness meditation, effective time management, and coping strategies to help reduce stress and improve quality of life.',
    imageUrl: stressImg,
  },
  {
    title: 'Healthy Habits for a Better Life',
    description: 'Developing healthy daily habits can transform your life. Explore tips and strategies that can improve your physical and mental well-being.',
    details: 'This resource outlines various healthy habits that can lead to a more fulfilling life. Topics include physical exercise, balanced nutrition, sufficient sleep, and maintaining strong social connections. Each habit is explained with practical tips for implementation.',
    imageUrl: healthyHabitImg,
  },
  {
    title: 'The Importance of Sleep',
    description: 'Sleep is critical to health, yet many overlook its importance. This resource explains how to improve sleep quality and overall wellness.',
    details: 'Quality sleep is essential for good health. This article provides insights into the benefits of adequate sleep, common sleep disorders, and strategies for improving sleep hygiene. It also discusses the impact of sleep on mental and physical health.',
    imageUrl: sleepImg,
  },
  {
    title: 'Nutrition and Mental Health',
    description: 'Discover how your diet impacts your mental health, and which foods can promote a better mood and cognitive function.',
    details: 'Nutrition plays a significant role in mental health. This resource explores the connection between diet and mental well-being, highlighting specific nutrients and foods that can enhance mood and cognitive function. Practical dietary recommendations are provided for better mental health.',
    imageUrl: nutritionImg,
  },
  {
    title: 'Building Emotional Resilience',
    description: 'Learn how to build emotional resilience and cope with life’s challenges more effectively.',
    details: 'Emotional resilience helps individuals navigate life’s challenges more effectively. This article discusses the concept of emotional resilience, its importance, and strategies for developing it. Techniques such as self-care, positive thinking, and stress management are covered.',
    imageUrl: emotionImg,
  },
];

// Define YouTube video cards with updated URLs
const videos = [
  {
    title: 'The Science of Happiness',
    description: 'An in-depth look at what makes us truly happy, featuring insights from experts in psychology.',
    videoUrl: 'https://www.youtube.com/watch?v=9cqm3d0Vg5c',
  },
  {
    title: 'How to Manage Stress',
    description: 'Tips and techniques for managing stress effectively and improving mental health.',
    videoUrl: 'https://www.youtube.com/watch?v=15GaKTP0gFE',
  },
  {
    title: 'Healthy Eating for Better Life',
    description: 'Explore the importance of healthy eating and its impact on overall wellness.',
    videoUrl: 'https://www.youtube.com/watch?v=3DM3_ocFy0U',
  },
  {
    title: 'Understanding Mental Health',
    description: 'Learn about mental health issues, their impact, and strategies for improving mental well-being.',
    videoUrl: 'https://www.youtube.com/watch?v=KHtzeslkOVU',
  },
  {
    title: 'The Role of Sleep in Health',
    description: 'Why sleep is crucial for health and how to improve sleep quality.',
    videoUrl: 'https://www.youtube.com/watch?v=3mufsteNrTI',
  },
  {
    title: 'Building Emotional Resilience',
    description: 'Techniques and strategies for developing emotional resilience and coping with challenges.',
    videoUrl: 'https://www.youtube.com/watch?v=7InjgEs4OBA',
  },
];

// Helper function to pad the resources array to ensure complete rows
const padArray = (array, size) => {
  const paddedArray = [...array];
  while (paddedArray.length % size !== 0) {
    paddedArray.push({
      title: '',
      description: '',
      imageUrl: 'https://via.placeholder.com/300x200?text=Placeholder', // Placeholder image URL
      details: '',
    });
  }
  return paddedArray;
};

const EducationResources = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentResource, setCurrentResource] = useState(null);
  const paddedResources = padArray(resources, 3);
  const paddedVideos = padArray(videos, 3);

  const handleOpenModal = (resource) => {
    setCurrentResource(resource);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentResource(null);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Educational Resources
      </Typography>
      <Typography variant="body1" paragraph align="center">
        Explore a wide range of educational resources to help improve your mental, physical, and emotional well-being.
      </Typography>

      <Typography variant="h5" gutterBottom align="center">
        Articles
      </Typography>
      <Grid container spacing={4}>
        {paddedResources.map((resource, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card variant="outlined">
              <CardMedia
                component="img"
                height="200"
                image={resource.imageUrl}
                alt={resource.title || 'Placeholder'}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {resource.title || 'Resource Title'}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  {resource.description || 'Description not available.'}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleOpenModal(resource)}
                >
                  Read More
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" gutterBottom align="center" sx={{ mt: 6 }}>
        Videos
      </Typography>
      <Grid container spacing={4}>
        {paddedVideos.map((video, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card variant="outlined">
              <CardMedia
                component="iframe"
                height="200"
                src={video.videoUrl.replace('watch?v=', 'embed/')} // Convert to embed URL format
                title={video.title}
                frameBorder="0"
                allowFullScreen
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {video.title || 'Video Title'}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  {video.description || 'Description not available.'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal */}
      {currentResource && (
        <Dialog open={modalOpen} onClose={handleCloseModal} fullWidth maxWidth="md">
          <DialogTitle>
            <Typography variant="h5" align="center">
              {currentResource.title}
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleCloseModal}
              aria-label="close"
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <img
              src={currentResource.imageUrl}
              alt={currentResource.title}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '300px', // Adjust the max height as needed
                objectFit: 'cover',  // Ensures the image covers the container
                marginBottom: '16px'
              }}
            />
            <Typography variant="body1" paragraph>
              {currentResource.details}
            </Typography>
          </DialogContent>
        </Dialog>
      )}
    </Container>
  );
};

export default EducationResources;
