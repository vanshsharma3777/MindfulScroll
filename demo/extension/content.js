console.log('MindfulScroll content script loaded on:', window.location.hostname);

// Collection of motivational messages
const motivationalMessages = [
  "Great job taking a break! Remember, your mental health is just as important as your productivity.",
  "Taking breaks is a sign of wisdom, not weakness. You're making a healthy choice!",
  "Every break is an opportunity to reset and recharge. You've got this!",
  "Your mind deserves a moment of peace. This break is well-earned!",
  "Taking care of yourself is the best investment you can make. Enjoy your break!",
  "A short break now leads to better focus later. Smart choice!",
  "You're practicing digital wellness - that's something to be proud of!",
  "This break is your moment to breathe, stretch, and reset. Make the most of it!",
  "Remember why you started using MindfulScroll - you're making progress!",
  "Every mindful break is a step toward better digital habits. Keep it up!",
  "You're showing great self-awareness by taking this break. That's growth!",
  "This break is your chance to reconnect with the present moment.",
  "Taking regular breaks is a superpower for maintaining focus and creativity.",
  "You're building healthy boundaries with technology. That's impressive!",
  "This break is your opportunity to check in with yourself. How are you feeling?"
];

// Function to get a random motivational message
function getRandomMotivationalMessage() {
  const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
  return motivationalMessages[randomIndex];
}

// Create and inject the reminder popup
function createReminderPopup() {
  console.log('Creating reminder popup');
  
  // Remove any existing popup
  const existingPopup = document.getElementById('mindful-scroll-popup');
  if (existingPopup) {
    existingPopup.remove();
  }

  const popup = document.createElement('div');
  popup.id = 'mindful-scroll-popup';
  popup.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    z-index: 2147483647;
    font-family: Arial, sans-serif;
    min-width: 300px;
    border: 1px solid #e0e0e0;
  `;

  popup.innerHTML = `
    <h3 style="margin: 0 0 10px 0; color: #333;">Time Check!</h3>
    <p style="margin: 0 0 15px 0; color: #666;">You've been browsing for 1 minute. Want to take a break?</p> 
    <div style="display: flex; gap: 10px;">
      <button id="mindful-scroll-continue" style="padding: 8px 16px; border: none; border-radius: 4px; background: #e0e0e0; cursor: pointer; color: #333;">Continue</button>
      <button id="mindful-scroll-break" style="padding: 8px 16px; border: none; border-radius: 4px; background: #4CAF50; color: white; cursor: pointer;">Take a Break</button>
    </div>
  `;

  document.body.appendChild(popup);
  console.log('Reminder popup added to page');

  // Add event listeners
  const continueBtn = document.getElementById('mindful-scroll-continue');
  const breakBtn = document.getElementById('mindful-scroll-break');

  continueBtn.addEventListener('click', () => {
    console.log('Continue button clicked');
    popup.remove();
    logSession('continue');
  });

  breakBtn.addEventListener('click', () => {
    console.log('Break button clicked');
    showMotivationalMessage();
    logSession('break');
  });
}

// Function to show motivational message
function showMotivationalMessage() {
  console.log('Showing motivational message');
  
  // Remove existing popup
  const existingPopup = document.getElementById('mindful-scroll-popup');
  if (existingPopup) {
    existingPopup.remove();
  }

  // Create new popup with motivational message
  const popup = document.createElement('div');
  popup.id = 'mindful-scroll-popup';
  popup.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    z-index: 2147483647;
    font-family: Arial, sans-serif;
    min-width: 300px;
    border: 1px solid #e0e0e0;
  `;

  const message = getRandomMotivationalMessage();
  
  popup.innerHTML = `
    <h3 style="margin: 0 0 10px 0; color: #333;">Time for a Break!</h3>
    <p style="margin: 0 0 15px 0; color: #666; font-style: italic;">${message}</p>
    <div style="display: flex; gap: 10px;">
      <button id="mindful-scroll-close" style="padding: 8px 16px; border: none; border-radius: 4px; background: #4CAF50; color: white; cursor: pointer;">Close</button>
    </div>
  `;

  document.body.appendChild(popup);

  // Add event listener for close button
  const closeBtn = document.getElementById('mindful-scroll-close');
  closeBtn.addEventListener('click', () => {
    console.log('Close button clicked');
    popup.remove();
  });

  // Auto-close after 10 seconds
  setTimeout(() => {
    if (document.body.contains(popup)) {
      popup.remove();
    }
  }, 10000);
}

function logSession(action) {
  console.log('Logging session with action:', action, 'on:', window.location.hostname);
  const sessionData = {
    url: window.location.hostname,
    startTime: Date.now() - (1 * 60 * 1000), // 1 minute ago
    duration: 1 * 60 * 1000, // 1 minute in milliseconds
    action: action
  };

  chrome.runtime.sendMessage({
    type: 'LOG_SESSION',
    data: sessionData
  }, (response) => {
    if (chrome.runtime.lastError) {
      console.error('Error sending message:', chrome.runtime.lastError);
    } else {
      console.log('Session logged successfully on:', window.location.hostname);
    }
  });
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Content script received message:', message, 'on:', window.location.hostname);
  if (message.type === 'SHOW_REMINDER') {
    console.log('Showing reminder on:', window.location.hostname);
    createReminderPopup();
    sendResponse({ success: true });
  }
  return true; // Keep the message channel open for async response
});

// Notify that content script is ready
chrome.runtime.sendMessage({ type: 'CONTENT_SCRIPT_READY' }, (response) => {
  if (chrome.runtime.lastError) {
    console.error('Error sending ready message:', chrome.runtime.lastError);
  } else {
    console.log('Content script ready notification sent from:', window.location.hostname);
  }
});

// For testing: manually create popup after 5 seconds
// This will help us verify if the popup works
setTimeout(() => {
  console.log('Testing popup creation directly from content script');
  createReminderPopup();
}, 5000); 