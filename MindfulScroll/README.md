# Problem Statement

What software solutions colud help users maintain health and  more intentional screen time

# Kalpathon_SakshamBharat Team

# MindfulScroll

A comprehensive web time tracking solution consisting of a Chrome extension, backend API, and analytics dashboard.

## Features

- Chrome Extension for website time tracking
- Daily time limits for specified websites
- Real-time usage monitoring
- Beautiful analytics dashboard with modern UI
- Automatic daily data cleanup
- Time limit notifications
- Website usage statistics

## Project Structure

```
mindfulscroll/
├── extension/          # Chrome extension files
│   ├── popup.html      # Extension popup interface
│   ├── popup.css       # Extension styling
│   ├── popup.js        # Extension functionality
│   ├── background.js   # Background service worker
│   ├── content.js      # Content script for page interaction
│   ├── timeLimitNotification.js  # Notification system
│   └── manifest.json   # Extension configuration
├── server/            # Node.js + Express backend
└── dashboard/         # React + Tailwind frontend
    ├── src/           # React source files
    ├── public/        # Static assets
    └── package.json   # Dashboard dependencies
```

## Setup Instructions

### Chrome Extension
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `extension` folder
4. The extension will appear in your browser toolbar

### Backend Server
1. Navigate to the `server` directory
2. Install dependencies: `npm install`
3. Create `.env` file with MongoDB connection string
4. Start server: `npm start`

### Dashboard
1. Navigate to the `dashboard` directory
2. Install dependencies: `npm install`
3. Start development server: `npm start`
4. Access the dashboard at `http://localhost:3000`

## Extension Features

- **Website Tracking**: Add websites to monitor with custom time limits
- **Time Limit Alerts**: Receive notifications when time limits are reached
- **Continue Anyway**: Option to continue browsing after reaching time limits
- **Dashboard Access**: Quick access to the analytics dashboard
- **Website Management**: Add and remove tracked websites

## Dashboard Features

- **Usage Statistics**: View daily website usage statistics
- **Time Distribution**: Visualize time spent on different websites
- **Usage Trends**: Track usage patterns over time
- **Modern UI**: Clean, responsive interface with intuitive design
- **Data Visualization**: Interactive charts for better insights

## Technologies Used

- **Frontend**: React, TailwindCSS, Chart.js
- **Backend**: Node.js, Express, MongoDB
- **Extension**: Chrome Extension API
- **Styling**: CSS3, Tailwind CSS
- **Charts**: Chart.js with custom styling

## Development

The project is structured in three main components:

1. **Extension**: Handles website tracking and time limit enforcement
2. **Backend**: Manages data storage and API endpoints
3. **Dashboard**: Provides analytics and visualization of usage data

Each component can be developed and tested independently 