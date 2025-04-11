const schedule = require('node-schedule');
const Usage = require('../models/Usage');

// Schedule cleanup job to run at midnight every day
const cleanupJob = schedule.scheduleJob('0 0 * * *', async () => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    const result = await Usage.deleteMany({
      date: { $lt: yesterday }
    });
    
    console.log(`Cleaned up ${result.deletedCount} usage records older than ${yesterday.toISOString()}`);
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
});

module.exports = cleanupJob; 