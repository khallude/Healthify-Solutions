import React from 'react';

export default function HealthMetricsHistory({ healthMetrics }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm md:col-span-2">
      <h2 className="text-xl font-semibold mb-4">Health Metrics History</h2>
      <div className="space-y-4">
        {healthMetrics.length > 0 ? (
          healthMetrics.map((metric) => (
            <div key={metric.date} className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{new Date(metric.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Blood Pressure</p>
                <p className="font-medium">{metric.bloodPressure}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Blood Sugar</p>
                <p className="font-medium">{metric.bloodSugar} mg/dL</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Temperature</p>
                <p className="font-medium">{metric.temperature}°C</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No health metrics available.</p>
        )}
      </div>
    </div>
  );
}