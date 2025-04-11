let startTime = Date.now();
let isTracking = true;

console.log('Content script loaded for:', window.location.hostname);

// Create and style the custom alert
function createCustomAlert(url) {
  console.log('Creating time limit alert for:', url);
  
  // Remove any existing alerts first
  const existingAlert = document.getElementById('timeLimitAlert');
  const existingOverlay = document.getElementById('timeLimitOverlay');
  
  if (existingAlert) existingAlert.remove();
  if (existingOverlay) existingOverlay.remove();
  
  const alertDiv = document.createElement('div');
  alertDiv.id = 'timeLimitAlert';
  alertDiv.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 10000;
    text-align: center;
    width: 300px;
  `;

  const overlay = document.createElement('div');
  overlay.id = 'timeLimitOverlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9999;
  `;

  alertDiv.innerHTML = `
    <h2 style="margin: 0 0 15px 0; color: #1f2937;">Time Limit Reached</h2>
    <p style="margin: 0 0 20px 0; color: #4b5563;">You've hit the time limit for ${url}</p>
    <div style="display: flex; justify-content: center;">
      <button id="continueBtn" style="
        padding: 8px 16px;
        background: #10b981;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        min-width: 120px;
      ">Continue</button>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(alertDiv);

  return new Promise((resolve) => {
    const continueBtn = document.getElementById('continueBtn');
    if (continueBtn) {
      continueBtn.addEventListener('click', () => {
        console.log('Continue button clicked');
        alertDiv.remove();
        overlay.remove();
        resolve(true);
      });
    } else {
      console.error('Continue button not found in the DOM');
    }
  });
}

// Send usage data to background script every minute
setInterval(() => {
  if (isTracking) {
    const currentTime = Date.now();
    const duration = Math.floor((currentTime - startTime) / 1000);
    
    chrome.runtime.sendMessage({
      type: 'trackTime',
      data: {
        url: window.location.hostname,
        durationInSeconds: duration
      }
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Error sending track time message:', chrome.runtime.lastError);
      }
    });
    
    startTime = currentTime;
  }
}, 60000);

// Reset timer when tab becomes active/inactive
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    isTracking = false;
  } else {
    isTracking = true;
    startTime = Date.now();
  }
});

// Listen for time limit alerts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Content script received message:', message);
  
  if (message.type === 'showTimeLimitAlert') {
    console.log('Showing time limit alert for:', message.url);
    // Use the new notification function
    window.showTimeLimitNotification(message.url);
    // Send response back to background script
    sendResponse({ success: true });
    return true; // Indicate we'll send a response asynchronously
  }
});

// Send initial data when page loads
chrome.runtime.sendMessage({
  type: 'pageLoad',
  data: {
    url: window.location.hostname
  }
}, (response) => {
  if (chrome.runtime.lastError) {
    console.error('Error sending page load message:', chrome.runtime.lastError);
  }
}); 