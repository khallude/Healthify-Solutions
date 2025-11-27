import React from 'react';
import QuickStats from '../dashboard/QuickStats';
import AppointmentsList from '../dashboard/AppointmentsList';
import HealthMetricsHistory from '../dashboard/HealthMetricsHistory';

export default function Dashboard() {
  // Example data for healthMetrics and appointments
  const healthMetrics = [
    {
      date: '2023-01-01',
      heartRate: 72,
      weight: 70,
      stressLevel: 3,
      sleepHours: 7,
    },
  ];
  
  const appointments = [
    {
      id: 1,
      doctor: 'Dr. Smith',
      specialty: 'Cardiology',
      date: '2023-01-15',
      time: '10:00 AM',
    },
    {
      id: 2,
      doctor: 'Dr. Jones',
      specialty: 'Dermatology',
      date: '2023-01-20',
      time: '2:00 PM',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <QuickStats healthMetrics={healthMetrics} />
      <AppointmentsList appointments={appointments} />
      <HealthMetricsHistory healthMetrics={healthMetrics} />
    </div>
  );
}