// Constants
const TIMER_INTERVAL = 1 * 60 * 1000; // 1 minute in milliseconds
const SOCIAL_MEDIA_SITES = ['instagram.com', 'facebook.com', 'twitter.com', 'tiktok.com'];
const contentScriptReady = new Map();
const tabStartTimes = new Map(); // Track when tabs start browsing

// Check if URL is a social media site
function isSocialMediaSite(url) {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return SOCIAL_MEDIA_SITES.some(site => hostname.includes(site));
  } catch (error) {
    console.error('Error checking URL:', error);
    return false;
  }
}

// Inject content script into tab
async function injectContentScript(tabId) {
  try {
    console.log('Injecting content script into tab:', tabId);
    await chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    });
    console.log('Content script injected successfully');
    return true;
  } catch (error) {
    console.error('Error injecting content script:', error);
    return false;
  }
}

// Start timer for a tab
async function startTimer(tabId) {
  console.log('Starting timer for tab:', tabId);
  
  // Clear any existing timer
  if (global.timers && global.timers[tabId]) {
    clearTimeout(global.timers[tabId]);
  }

  // Initialize timers map if it doesn't exist
  if (!global.timers) {
    global.timers = {};
  }

  // Record the start time for this tab
  tabStartTimes.set(tabId, Date.now());
  console.log('Recorded start time for tab:', tabId);

  // Set new timer
  global.timers[tabId] = setTimeout(async () => {
    console.log('Timer triggered for tab:', tabId);
    
    try {
      // Check if tab still exists and is on a social media site
      const tab = await chrome.tabs.get(tabId);
      if (!tab || !isSocialMediaSite(tab.url)) {
        console.log('Tab no longer exists or not on social media site');
        return;
      }

      // Check if content script is ready
      if (!contentScriptReady.get(tabId)) {
        console.log('Content script not ready, injecting...');
        const injected = await injectContentScript(tabId);
        if (!injected) {
          console.error('Failed to inject content script');
          return;
        }
        // Wait a bit for the content script to initialize
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Send reminder message
      console.log('Sending reminder message to tab:', tabId);
      const response = await chrome.tabs.sendMessage(tabId, { type: 'SHOW_REMINDER' });
      console.log('Reminder message response:', response);

    } catch (error) {
      console.error('Error in timer callback:', error);
      // If content script is not ready, try injecting it
      if (error.message.includes('Could not establish connection')) {
        console.log('Attempting to inject content script after error');
        await injectContentScript(tabId);
      }
    }
  }, TIMER_INTERVAL);
}

// Clear timer for a tab
function clearTimer(tabId) {
  console.log('Clearing timer for tab:', tabId);
  if (global.timers && global.timers[tabId]) {
    clearTimeout(global.timers[tabId]);
    delete global.timers[tabId];
  }
  contentScriptReady.delete(tabId);
  tabStartTimes.delete(tabId);
}

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    console.log('Tab updated:', tabId, 'URL:', tab.url);
    if (isSocialMediaSite(tab.url)) {
      console.log('Social media site detected, starting timer');
      startTimer(tabId);
    } else {
      console.log('Not a social media site, clearing timer');
      clearTimer(tabId);
    }
  }
});

// Listen for tab removal
chrome.tabs.onRemoved.addListener((tabId) => {
  console.log('Tab removed:', tabId);
  clearTimer(tabId);
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background script received message:', message);
  
  if (message.type === 'CONTENT_SCRIPT_READY') {
    console.log('Content script ready in tab:', sender.tab.id);
    contentScriptReady.set(sender.tab.id, true);
    sendResponse({ success: true });
  }
  
  if (message.type === 'LOG_SESSION') {
    console.log('Logging session:', message.data);
    // Add the actual browsing duration based on tab start time
    const tabId = sender.tab.id;
    const startTime = tabStartTimes.get(tabId) || (Date.now() - TIMER_INTERVAL);
    message.data.startTime = startTime;
    message.data.duration = Date.now() - startTime;
    
    // Send session data to backend
    fetch('http://localhost:3000/api/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message.data)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Session logged successfully:', data);
      sendResponse({ success: true });
    })
    .catch(error => {
      console.error('Error logging session:', error);
      sendResponse({ success: false, error: error.message });
    });
    return true; // Keep the message channel open for async response
  }
});

// For testing: manually trigger popup after 10 seconds
// This will help us verify if the popup works
setTimeout(async () => {
  console.log('Testing popup functionality...');
  const tabs = await chrome.tabs.query({ url: '*://*.instagram.com/*' });
  if (tabs.length > 0) {
    const tabId = tabs[0].id;
    console.log('Found Instagram tab:', tabId);
    try {
      await chrome.tabs.sendMessage(tabId, { type: 'SHOW_REMINDER' });
      console.log('Test reminder sent successfully');
    } catch (error) {
      console.error('Error sending test reminder:', error);
    }
  } else {
    console.log('No Instagram tabs found for testing');
  }
}, 10000); // 10 seconds 