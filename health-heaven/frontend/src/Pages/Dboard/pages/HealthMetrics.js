import React from 'react';
import { LineChart, BarChart, Activity, TrendingUp } from 'lucide-react';

export default function HealthMetricsPage({ healthMetrics }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Health Metrics</h1>
        <p className="text-gray-500">Track your health progress over time</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Blood Pressure"
          value={healthMetrics[0].bloodPressure}
          change="+2%"
          trend="up"
          icon={<Activity className="h-6 w-6" />}
        />
        <MetricCard
          title="Heart Rate"
          value={`${healthMetrics[0].heartRate} BPM`}
          change="-5%"
          trend="down"
          icon={<LineChart className="h-6 w-6" />}
        />
        <MetricCard
          title="Blood Sugar"
          value={`${healthMetrics[0].bloodSugar} mg/dL`}
          change="stable"
          trend="stable"
          icon={<BarChart className="h-6 w-6" />}
        />
        <MetricCard
          title="Weight"
          value={`${healthMetrics[0].weight} kg`}
          change="-0.5kg"
          trend="down"
          icon={<TrendingUp className="h-6 w-6" />}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Detailed History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Blood Pressure</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Heart Rate</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Blood Sugar</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Weight</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Sleep</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Stress</th>
              </tr>
            </thead>
            <tbody>
              {healthMetrics.map((metric, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="px-4 py-3 text-sm text-gray-900">{metric.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{metric.bloodPressure}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{metric.heartRate} BPM</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{metric.bloodSugar} mg/dL</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{metric.weight} kg</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{metric.sleepHours}h</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{metric.stressLevel}/10</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, change, trend, icon }) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="text-gray-600">{icon}</div>
        <span className={`text-sm ${getTrendColor()}`}>{change}</span>
      </div>
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
