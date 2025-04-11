import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const ChartDisplay = ({ data, isDarkMode }) => {
  // Modern color palette
  const colors = {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    accent: '#ec4899',
    background: isDarkMode ? '#1e1e1e' : '#ffffff',
    text: isDarkMode ? '#e5e5e5' : '#1f2937',
    grid: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
  };

  const chartData = {
    labels: data.map(item => item.url),
    datasets: [
      {
        label: 'Time Spent (minutes)',
        data: data.map(item => Math.round(item.durationInSeconds / 60)),
        backgroundColor: colors.primary,
        borderColor: colors.primary,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: colors.text,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: 'Website Usage Today',
        color: colors.text,
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        backgroundColor: colors.background,
        titleColor: colors.text,
        bodyColor: colors.text,
        borderColor: isDarkMode ? '#2d2d2d' : '#e5e7eb',
        borderWidth: 1,
        padding: 10,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw} minutes`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: colors.grid,
        },
        ticks: {
          color: colors.text,
        },
      },
      x: {
        grid: {
          color: colors.grid,
        },
        ticks: {
          color: colors.text,
        },
      },
    },
  };

  const lineOptions = {
    ...options,
    plugins: {
      ...options.plugins,
      title: {
        ...options.plugins.title,
        text: 'Usage Trend',
      },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <div className="bg-light-card dark:bg-dark-card p-4 rounded-lg shadow-lg transition-colors duration-200">
        <h3 className="text-lg font-semibold mb-2 text-secondary dark:text-dark-text">Time Distribution</h3>
        <div className="h-[300px]">
          <Bar data={chartData} options={options} />
        </div>
      </div>
      <div className="bg-light-card dark:bg-dark-card p-4 rounded-lg shadow-lg transition-colors duration-200">
        <h3 className="text-lg font-semibold mb-2 text-secondary dark:text-dark-text">Usage Trend</h3>
        <div className="h-[300px]">
          <Line data={chartData} options={lineOptions} />
        </div>
      </div>
    </div>
  );
};

export default ChartDisplay; 