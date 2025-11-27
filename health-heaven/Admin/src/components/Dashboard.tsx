import React, { useState, useEffect } from 'react';
import { Users, UserCheck, Clock, CreditCard } from 'lucide-react';
import StatsCard from './StatsCard';
import LineChart from './LineChart';

interface DashboardProps {
  darkMode: boolean;
}

interface DashboardData {
  doctors: number;
  approvedDoctors: number;
  appointments: number;
  users: number;
}

const Dashboard: React.FC<DashboardProps> = ({ darkMode }) => {
  const [data, setData] = useState<DashboardData>({
    doctors: 0,
    approvedDoctors: 0,
    appointments: 0,
    users: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
// You don't need to change the URL in the fetch requests
// or bother this working setup. The API is already running
      try {
        const [doctorsRes, usersRes, appointmentsRes] = await Promise.all([
          fetch('http://localhost:5000/api/admin/all-doctors', { headers }),
          fetch('http://localhost:5000/api/admin/all-users', { headers }),
          fetch('http://localhost:5000/api/admin/all-appointments', { headers })
        ]);

        const [doctors, users, appointments] = await Promise.all([
          doctorsRes.json(),
          usersRes.json(),
          appointmentsRes.json()
        ]);

        setData({
          doctors: doctors.doctors.length,  // Accessing the 'doctors' array inside the response
          approvedDoctors: doctors.doctors.filter(d => d.status === 'Approved').length,
          appointments: appointments.appointments.length,  // Accessing the 'appointments' array inside the response
          users: users.users.length  // Accessing the 'users' array inside the response
        });
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  const stats = [
    {
      title: 'Total Doctors',
      value: data.doctors.toString(),
      icon: <Users size={24} />,
      change: '+12%',
    },
    {
      title: 'Approved Doctors',
      value: data.approvedDoctors.toString(),
      icon: <UserCheck size={24} />,
      change: '+18%',
    },
    {
      title: 'Total Appointments',
      value: data.appointments.toString(),
      icon: <Clock size={24} />,
      change: '-5%',
    },
    {
      title: 'Total Users',
      value: data.users.toString(),
      icon: <CreditCard size={24} />,
      change: '+22%',
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} darkMode={darkMode} />
        ))}
      </div>
      <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Registration Trends
        </h3>
        <LineChart darkMode={darkMode} />
      </div>
    </div>
  );
};

export default Dashboard;