const mongoose = require('mongoose');

const usageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  durationInSeconds: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
});

// Index for efficient querying by date
usageSchema.index({ date: 1 });

module.exports = mongoose.model('Usage', usageSchema); 