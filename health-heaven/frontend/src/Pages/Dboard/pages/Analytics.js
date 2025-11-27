import React from 'react';
import ReactECharts from 'echarts-for-react';

export default function AnalyticsPage({ healthMetrics }) {
  // Extract Data
  const dates = healthMetrics.map(metric => metric.date);
  const bloodPressures = healthMetrics.map(metric => parseInt(metric.bloodPressure.split('/')[0]));
  const weights = healthMetrics.map(metric => metric.weight);
  const sleepHours = healthMetrics.map(metric => metric.sleepHours);
  const stressLevels = healthMetrics.map(metric => metric.stressLevel);

  // Chart Configurations
  const bloodPressureOption = {
    title: {
      text: 'Blood Pressure Trends',
      left: 'center',
    },
    xAxis: {
      type: 'category',
      data: dates,
    },
    yAxis: {
      type: 'value',
    },
    tooltip: {
      trigger: 'axis',
    },
    series: [
      {
        name: 'Blood Pressure',
        type: 'line',
        data: bloodPressures,
        smooth: true,
        lineStyle: {
          width: 3,
        },
        areaStyle: {
          color: 'rgba(76, 175, 80, 0.2)',
        },
        itemStyle: {
          color: '#4CAF50',
        },
      },
    ],
  };

  const weightOption = {
    title: {
      text: 'Weight History',
      left: 'center',
    },
    xAxis: {
      type: 'category',
      data: dates,
    },
    yAxis: {
      type: 'value',
    },
    tooltip: {
      trigger: 'axis',
    },
    series: [
      {
        name: 'Weight',
        type: 'bar',
        data: weights,
        itemStyle: {
          color: '#FF9800',
        },
        emphasis: {
          itemStyle: {
            color: '#FFA726',
          },
        },
      },
    ],
  };

  const sleepOption = {
    title: {
      text: 'Sleep Analysis',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} hours',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: 'Sleep Hours',
        type: 'pie',
        radius: '50%',
        data: sleepHours.map((hours, index) => ({
          value: hours,
          name: dates[index],
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  const stressOption = {
    title: {
      text: 'Stress Level Patterns',
      left: 'center',
    },
    xAxis: {
      type: 'category',
      data: dates,
    },
    yAxis: {
      type: 'value',
    },
    tooltip: {
      trigger: 'axis',
    },
    series: [
      {
        name: 'Stress Level',
        type: 'line',
        data: stressLevels,
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#F44336',
        },
        itemStyle: {
          color: '#F44336',
        },
        areaStyle: {
          color: 'rgba(244, 67, 54, 0.2)',
        },
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">Analytics</h1>
        <p className="text-lg text-gray-600">Insights and trends from your health data</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <ReactECharts option={bloodPressureOption} style={{ height: '400px' }} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <ReactECharts option={weightOption} style={{ height: '400px' }} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <ReactECharts option={sleepOption} style={{ height: '400px' }} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <ReactECharts option={stressOption} style={{ height: '400px' }} />
        </div>
      </div>
    </div>
  );
}
