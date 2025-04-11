const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  action: {
    type: String,
    enum: ['continue', 'break'],
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient querying by date
sessionSchema.index({ startTime: 1 });

module.exports = mongoose.model('Session', sessionSchema); 