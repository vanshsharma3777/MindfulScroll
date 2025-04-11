// Create and inject styles for the notification
const styles = `
  .time-limit-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999999;
  }

  .time-limit-notification {
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    max-width: 400px;
    width: 90%;
    text-align: center;
  }

  .time-limit-notification h2 {
    margin: 0 0 16px 0;
    color: #333;
    font-size: 20px;
  }

  .time-limit-notification p {
    margin: 0 0 24px 0;
    color: #666;
    font-size: 16px;
    line-height: 1.5;
  }

  .time-limit-notification button {
    background: #4CAF50;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .time-limit-notification button:hover {
    background: #45a049;
  }
`;

// Create style element and append to document
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// Function to show the time limit notification
window.showTimeLimitNotification = function(url) {
  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'time-limit-overlay';

  // Create notification
  const notification = document.createElement('div');
  notification.className = 'time-limit-notification';
  notification.innerHTML = `
    <h2>Time Limit Reached</h2>
    <p>You've reached your time limit for ${url}. Would you like to continue browsing?</p>
    <button id="continue-browsing">Continue</button>
  `;

  // Add notification to overlay
  overlay.appendChild(notification);

  // Add overlay to document
  document.body.appendChild(overlay);

  // Add click handler for continue button
  document.getElementById('continue-browsing').addEventListener('click', () => {
    // Send message to background script
    chrome.runtime.sendMessage({
      type: 'timeLimitContinue',
      data: { url }
    });

    // Remove overlay
    document.body.removeChild(overlay);
  });
}; 