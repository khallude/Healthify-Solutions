import React from 'react';
import { Heart, Weight, Brain, Timer } from 'lucide-react';

export default function QuickStats({ healthMetrics }) {
  // Check if healthMetrics is defined and has at least one metric
  const currentMetrics = healthMetrics && healthMetrics.length > 0 ? healthMetrics[0] : {};

  return (
    <div className="grid grid-cols-2 gap-4">
      <StatCard
        icon={<Heart className="h-5 w-5" />}
        title="Heart Rate"
        value={`${currentMetrics.heartRate || 'N/A'} BPM`}
        subtitle="Normal range: 60-100 BPM"
        color="blue"
      />
      <StatCard
        icon={<Weight className="h-5 w-5" />}
        title="Weight"
        value={`${currentMetrics.weight || 'N/A'} kg`}
        subtitle="BMI: 22.9 (Normal)"
        color="green"
      />
      <StatCard
        icon={<Brain className="h-5 w-5" />}
        title="Stress Level"
        value={`${currentMetrics.stressLevel || 'N/A'}/10`}
        subtitle="Lower than yesterday"
        color="purple"
      />
      <StatCard
        icon={<Timer className="h-5 w-5" />}
        title="Sleep"
        value={`${currentMetrics.sleepHours || 'N/A'}h`}
        subtitle="Quality: Good"
        color="orange"
      />
    </div>
  );
}

function StatCard({ icon, title, value, subtitle, color }) {
  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className={`flex items-center space-x-2 ${colorClasses[color]} mb-2`}>
        {icon}
        <span className="font-medium">{title}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
    </div>
  );
}