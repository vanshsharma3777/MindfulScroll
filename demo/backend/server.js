const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const sessionRoutes = require('./routes/sessionRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Basic route for testing
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Routes
app.use('/api', sessionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/mindfulscroll', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB successfully');
  // Start server only after successful MongoDB connection
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to view the dashboard`);
  });
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
}); 