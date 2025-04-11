<h2>Question- What software solutions could help users maintain healthier and more intentional screen time</h2>

# Kalpathon_SakshamBharatTeam

# MindfulScroll

MindfulScroll is a digital wellbeing tool that helps users manage their time on social media platforms. It consists of three main components: a Chrome extension, a backend API, and a web dashboard.

## Features

- Track time spent on social media platforms
- Set daily usage limits
- Receive gentle reminders when spending too much time (after 1 minute in testing mode)
- View usage statistics and trends
- Get personalized digital wellbeing suggestions

## Components

### 1. Chrome Extension
- Monitors social media usage
- Shows popup reminders after 1 minute (in testing mode)
- Tracks session data
- Located in `/extension`

### 2. Backend API
- REST API built with Express and MongoDB
- Handles session logging and statistics
- Manages user goals
- Located in `/backend`

### 3. Web Dashboard
- React-based dashboard
- Visualizes usage statistics
- Allows goal setting
- Provides wellbeing suggestions
- Located in `/dashboard`

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Chrome browser

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start MongoDB:
   ```bash
   mongod
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Dashboard Setup
1. Navigate to the dashboard directory:
   ```bash
   cd dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Chrome Extension Setup
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `/extension` directory

## Usage

1. The Chrome extension will automatically start tracking when you visit social media sites
2. After 1 minute (in testing mode), you'll receive a reminder to take a break
3. View your usage statistics and set goals in the web dashboard
4. Get personalized suggestions for digital wellbeing

## Testing Mode

The extension is currently set to show reminders after 1 minute instead of the standard 10 minutes for testing purposes. To change this back to 10 minutes, modify the `ONE_MINUTE` constant in `extension/background.js` to `TEN_MINUTES` and update the corresponding values in `extension/content.js`.

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
