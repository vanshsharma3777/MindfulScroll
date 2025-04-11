import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Button
} from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';
import axios from 'axios';

const Suggestions = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      // In a real app, this would call the OpenRouter API
      // For now, using dummy data
      const dummySuggestions = [
        {
          title: 'Take Regular Breaks',
          description: 'Try the Pomodoro Technique: work for 25 minutes, then take a 5-minute break.'
        },
        {
          title: 'Mindful Scrolling',
          description: 'Before opening social media, ask yourself: "What am I looking for?" This helps prevent mindless scrolling.'
        },
        {
          title: 'Digital Boundaries',
          description: 'Set specific times for checking social media, like after lunch or before dinner.'
        },
        {
          title: 'Screen-Free Activities',
          description: 'Replace some social media time with offline activities like reading, walking, or meditation.'
        }
      ];
      
      setSuggestions(dummySuggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Personalized Suggestions
      </Typography>

      <Paper sx={{ p: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <List>
              {suggestions.map((suggestion, index) => (
                <ListItem key={index} sx={{ mb: 2 }}>
                  <ListItemIcon>
                    <PsychologyIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={suggestion.title}
                    secondary={suggestion.description}
                  />
                </ListItem>
              ))}
            </List>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={fetchSuggestions}
              >
                Get New Suggestions
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default Suggestions; 