const express = require('express');
const router = express.Router();
const Usage = require('../models/Usage');

// Track usage
router.post('/track', async (req, res) => {
  try {
    const { url, durationInSeconds, date } = req.body;
    
    const usage = new Usage({
      url,
      durationInSeconds,
      date: new Date(date)
    });
    
    await usage.save();
    res.status(201).json(usage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get today's usage
router.get('/usage/today', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const usage = await Usage.aggregate([
      {
        $match: {
          date: {
            $gte: today,
            $lt: tomorrow
          }
        }
      },
      {
        $group: {
          _id: '$url',
          totalDuration: { $sum: '$durationInSeconds' }
        }
      },
      {
        $project: {
          _id: 0,
          url: '$_id',
          durationInSeconds: '$totalDuration'
        }
      }
    ]);
    
    res.json(usage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get last cleared timestamp
router.get('/usage/last-cleared', async (req, res) => {
  try {
    // Get the most recent record to check when data was last cleared
    const lastRecord = await Usage.findOne().sort({ date: -1 });
    
    if (!lastRecord) {
      return res.json({ lastCleared: new Date(0) });
    }
    
    res.json({ lastCleared: lastRecord.date });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clear all usage data
router.delete('/usage/clear', async (req, res) => {
  try {
    console.log('Attempting to clear all usage data...');
    const result = await Usage.deleteMany({});
    console.log('Clear data result:', result);
    res.json({ 
      message: `Cleared all usage data (${result.deletedCount} records)`,
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error('Error clearing data:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 