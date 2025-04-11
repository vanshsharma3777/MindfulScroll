import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Alert
} from '@mui/material';
import axios from 'axios';

const Goals = () => {
  const [goal, setGoal] = useState('');
  const [currentGoal, setCurrentGoal] = useState(60);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCurrentGoal();
  }, []);

  const fetchCurrentGoal = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/goal');
      setCurrentGoal(response.data.dailyGoal);
    } catch (error) {
      console.error('Error fetching goal:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!goal || isNaN(goal) || goal < 0) {
      setMessage('Please enter a valid number of minutes');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/goal', {
        minutes: parseInt(goal)
      });
      setCurrentGoal(response.data.dailyGoal);
      setMessage('Goal updated successfully!');
      setGoal('');
    } catch (error) {
      setMessage('Error updating goal');
      console.error('Error:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Set Your Goals
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Current Daily Limit
            </Typography>
            <Typography variant="h3" color="primary" gutterBottom>
              {currentGoal} minutes
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <TextField
                fullWidth
                label="New Daily Limit (minutes)"
                type="number"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Update Goal
              </Button>
            </Box>

            {message && (
              <Alert severity={message.includes('Error') ? 'error' : 'success'} sx={{ mt: 2 }}>
                {message}
              </Alert>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Tips for Setting Goals
            </Typography>
            <Typography variant="body1" paragraph>
              • Start with realistic goals that you can achieve
            </Typography>
            <Typography variant="body1" paragraph>
              • Consider your daily schedule and responsibilities
            </Typography>
            <Typography variant="body1" paragraph>
              • Gradually reduce your limit over time
            </Typography>
            <Typography variant="body1" paragraph>
              • Remember to take regular breaks
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Goals; 