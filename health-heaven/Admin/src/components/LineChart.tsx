import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';

interface LineChartProps {
  darkMode: boolean;
}

interface ChartData {
  bannedUsers: number;
  pendingAppointments: number;
  pendingDoctors: number;
  rejectedDoctors: number;
}

const LineChart: React.FC<LineChartProps> = ({ darkMode }) => {
  const [chartData, setChartData] = useState<ChartData>({
    bannedUsers: 0,
    pendingAppointments: 0,
    pendingDoctors: 0,
    rejectedDoctors: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      try {
        const [
          bannedUsersRes, pendingAppointmentsRes,
          pendingDoctorsRes, rejectedDoctorsRes
        ] = await Promise.all([
          fetch('http://localhost:5000/api/admin/banned-users', { headers }),
          fetch('http://localhost:5000/api/admin/pending-appointments', { headers }),
          fetch('http://localhost:5000/api/admin/pending-doctors', { headers }),
          fetch('http://localhost:5000/api/admin/rejected-doctors', { headers })
        ]);

        const [
          bannedUsers, pendingAppointments,
          pendingDoctors, rejectedDoctors
        ] = await Promise.all([
          bannedUsersRes.json(),
          pendingAppointmentsRes.json(),
          pendingDoctorsRes.json(),
          rejectedDoctorsRes.json()
        ]);

        setChartData({
          bannedUsers: bannedUsers.users?.length || 0,
          pendingAppointments: pendingAppointments.appointments?.length || 0,
          pendingDoctors: pendingDoctors?.length || 0,
          rejectedDoctors: rejectedDoctors.doctors?.length || 0
        });
        
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchData();
  }, []);

  const option = {
    backgroundColor: darkMode ? '#1f2937' : 'transparent',
    title: {
      text: 'Current Statistics',
      textStyle: {
        color: darkMode ? '#ffffff' : '#333',
      },
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: darkMode ? '#374151' : '#ffffff',
      borderColor: darkMode ? '#4b5563' : '#e5e7eb',
      textStyle: {
        color: darkMode ? '#ffffff' : '#333',
      },
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      textStyle: {
        color: darkMode ? '#ffffff' : '#333',
      },
    },
    series: [
      {
        name: 'Statistics',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 10,
          borderColor: darkMode ? '#1f2937' : '#ffffff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}: {c}',
          color: darkMode ? '#ffffff' : '#333',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        data: [
          { 
            value: chartData.bannedUsers, 
            name: 'Banned Users',
            itemStyle: { color: '#ef4444' }
          },
          { 
            value: chartData.pendingAppointments, 
            name: 'Pending Appointments',
            itemStyle: { color: '#f59e0b' }
          },
          { 
            value: chartData.pendingDoctors, 
            name: 'Pending Doctors',
            itemStyle: { color: '#3b82f6' }
          },
          { 
            value: chartData.rejectedDoctors, 
            name: 'Rejected Doctors',
            itemStyle: { color: '#8b5cf6' }
          }
        ]
      }
    ]
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: '400px', width: '100%' }}
      theme={darkMode ? 'dark' : undefined}
    />
  );
};

export default LineChart;