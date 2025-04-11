const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const mongoose = require('mongoose');

// Store user's daily goal in MongoDB
const GoalSchema = new mongoose.Schema({
  minutes: { type: Number, default: 60 }
});
const Goal = mongoose.model('Goal', GoalSchema);

// Log a new session
router.post('/sessions', async (req, res) => {
  try {
    const session = new Session(req.body);
    await session.save();
    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get usage statistics
router.get('/stats', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);

    // Get sessions from the last week
    const sessions = await Session.find({
      startTime: { $gte: weekAgo }
    }).sort({ startTime: -1 });

    // Get today's sessions
    const todaySessions = sessions.filter(session => 
      new Date(session.startTime) >= today
    );
    
    // Calculate today's usage
    const todayUsage = todaySessions.reduce((total, session) => total + session.duration, 0);
    
    // Calculate weekly average
    const weeklyUsage = sessions.reduce((total, session) => total + session.duration, 0);
    const daysInWeek = Math.max(1, Math.ceil((new Date() - weekAgo) / (1000 * 60 * 60 * 24)));
    const weeklyAverage = Math.round(weeklyUsage / daysInWeek / 60000); // Convert to minutes
    
    // Get recent sessions (last 10)
    const recentSessions = sessions.slice(0, 10);

    // Get daily goal
    const goal = await Goal.findOne();
    const dailyGoal = goal ? goal.minutes : 60;

    res.json({
      todayUsage,
      dailyGoal,
      weeklyAverage,
      recentSessions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Set daily goal
router.post('/goal', async (req, res) => {
  try {
    const { minutes } = req.body;
    if (typeof minutes !== 'number' || minutes < 0) {
      return res.status(400).json({ error: 'Invalid goal value' });
    }
    
    // Update or create goal
    await Goal.findOneAndUpdate({}, { minutes }, { upsert: true });
    res.json({ dailyGoal: minutes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get daily goal
router.get('/goal', async (req, res) => {
  try {
    const goal = await Goal.findOne();
    res.json({ dailyGoal: goal ? goal.minutes : 60 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 