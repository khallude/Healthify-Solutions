import React from 'react';

// Importing images
import uriasImage from '../assets/images/Urias Kermue.jpg';
import sahilImage from '../assets/images/Sahil Kumar.jpeg';
import nyasijinImage from '../assets/images/Nyasijin Kuol Mathiang.webp';
import nehaImage from '../assets/images/Neha Bharti.jpeg';
import abhigyaImage from '../assets/images/Abhigya Ishan.jpeg';

// Team members data
const teamMembers = [
  {
    name: 'Abhigya Ishan',
    department: 'IT-01',
    image: abhigyaImage, // Using the imported image for Abhigya Ishan
  },
  {
    name: 'Sahil Kumar',
    department: 'IT-03',
    image: sahilImage, // Using the imported image for Sahil Kumar
  },
  {
    name: 'Urias Kermue',
    department: 'IT-03',
    image: uriasImage, // Using the imported image for Urias Kermue
  },
  {
    name: 'Neha Bharti',
    department: 'IT-03',
    image: nehaImage, // Using the imported image for Neha Bharti
  },
  {
    name: 'Nyasijin Kuol Mathiang',
    department: 'IT-03',
    image: nyasijinImage, // Using the imported image for Nyasijin Kuol Mathiang
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted py-16">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-primary mb-4">About Health Heaven</h1>
          <div className="w-24 h-1 bg-primary mx-auto mb-8 rounded-full" />
        </div>

        {/* Mission Section */}
        <div className="max-w-3xl mx-auto mb-20">
          <div className="bg-card/50 backdrop-blur-sm border-muted p-8 rounded-lg shadow-md">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L12 22"></path>
                  <path d="M5 12l7 7 7-7"></path>
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-center mb-4">Our Mission</h2>
            <p className="text-center text-muted-foreground leading-relaxed">
              At Health Heaven, our mission is to provide the best resources and
              support for your wellness journey. We are committed to delivering
              high-quality information and tools to help you achieve your health
              goals.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Meet the Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {teamMembers.map((member) => (
              <div key={member.name} className="group hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">Department: {member.department}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
