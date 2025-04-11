import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    todayUsage: 0,
    dailyGoal: 60
  });

  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchWeeklyData();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchWeeklyData = async () => {
    // In a real app, this would fetch from the backend
    // For now, using dummy data
    const dummyData = [
      { day: 'Mon', usage: 45 },
      { day: 'Tue', usage: 60 },
      { day: 'Wed', usage: 30 },
      { day: 'Thu', usage: 75 },
      { day: 'Fri', usage: 50 },
      { day: 'Sat', usage: 90 },
      { day: 'Sun', usage: 40 }
    ];
    setWeeklyData(dummyData);
  };

  const progress = (stats.todayUsage / (stats.dailyGoal * 60)) * 100;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Your Digital Wellbeing Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Today's Usage Card */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Today's Usage</Typography>
            <Typography variant="h3" color="primary">
              {Math.round(stats.todayUsage / 60)} min
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Daily Goal: {stats.dailyGoal} min
            </Typography>
            <Box sx={{ mt: 2, height: 10, bgcolor: '#e0e0e0', borderRadius: 5 }}>
              <Box
                sx={{
                  height: '100%',
                  width: `${Math.min(progress, 100)}%`,
                  bgcolor: progress > 100 ? '#f44336' : progress > 80 ? '#ff9800' : '#4CAF50',
                  borderRadius: 5,
                  transition: 'width 0.3s ease'
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Weekly Usage Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Weekly Usage
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="usage" fill="#4CAF50" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 