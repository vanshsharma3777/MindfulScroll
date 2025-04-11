import React, { useState, useEffect } from 'react';
import ChartDisplay from './components/ChartDisplay';
import UsageCard from './components/UsageCard';
import ThemeToggle from './components/ThemeToggle';
import { fetchTodayUsage, clearData } from './api';
import './index.css';

function App() {
  const [usageData, setUsageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchTodayUsage();
      setUsageData(data);
      setError(null);
    } catch (err) {
      setError('Failed to load usage data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = async () => {
    try {
      await clearData();
      setUsageData([]);
    } catch (err) {
      setError('Failed to clear data');
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
    // Refresh data every minute
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex items-center justify-center transition-colors duration-200">
        <div className="text-xl text-secondary dark:text-dark-text">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex items-center justify-center transition-colors duration-200">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg transition-colors duration-200">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-secondary dark:text-dark-text">MindfulScroll Dashboard</h1>
          <div className="flex space-x-4">
            <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            <button
              onClick={handleClearData}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Clear Data
            </button>
          </div>
        </div>

        {usageData.length === 0 ? (
          <div className="text-center text-light-muted dark:text-dark-muted text-xl mt-12">
            No usage data available for today
          </div>
        ) : (
          <>
            <div className="mb-8">
              <UsageCard data={usageData} isDarkMode={isDarkMode} />
            </div>
            <ChartDisplay data={usageData} isDarkMode={isDarkMode} />
          </>
        )}
      </div>
    </div>
  );
}

export default App; 