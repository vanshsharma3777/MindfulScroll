// Store website limits and usage data
let websiteLimits = {};
let usageData = {};
let lastKnownDataCount = 0;
let lastKnownClearedTime = new Date(0);
let hasCheckedInitialState = false;

// Initialize data from storage
chrome.storage.local.get(['websiteLimits', 'usageData'], (result) => {
  websiteLimits = result.websiteLimits || {};
  usageData = result.usageData || {};
  console.log('Initialized website limits:', websiteLimits);
  console.log('Initialized usage data:', usageData);
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message, 'from sender:', sender);
  
  if (message.type === 'trackTime') {
    const { url, durationInSeconds } = message.data;
    console.log('Tracking time for:', url, 'duration:', durationInSeconds);
    
    // Update usage data
    if (!usageData[url]) {
      usageData[url] = 0;
    }
    usageData[url] += durationInSeconds;
    
    // Save to storage
    chrome.storage.local.set({ usageData });
    
    // Check if time limit is exceeded
    if (websiteLimits[url] && usageData[url] >= websiteLimits[url] * 60) {
      console.log('Time limit exceeded for:', url, 'limit:', websiteLimits[url], 'current usage:', usageData[url]);
      
      // Make sure we have a valid tab ID
      if (sender.tab && sender.tab.id) {
        showTimeLimitAlert(url, sender.tab.id);
      } else {
        console.error('Invalid tab ID for time limit alert');
      }
    }
    
    // Send data to backend
    sendDataToBackend(url, durationInSeconds);
  } else if (message.type === 'clearData') {
    // Clear all local storage data
    chrome.storage.local.clear(() => {
      websiteLimits = {};
      usageData = {};
      // Notify popup that data has been cleared
      chrome.runtime.sendMessage({ type: 'dataCleared' });
    });
  } else if (message.type === 'continueAnyway') {
    console.log('User chose to continue anyway for:', message.url);
    // You could add additional logic here if needed
  }
});

// Show time limit alert
function showTimeLimitAlert(url, tabId) {
  console.log('Sending time limit alert to tab:', tabId, 'for url:', url);
  
  // Make sure we have a valid tab ID
  if (!tabId) {
    console.error('Invalid tab ID for time limit alert');
    return;
  }
  
  // Send message to the content script
  chrome.tabs.sendMessage(tabId, {
    type: 'showTimeLimitAlert',
    url: url
  }, (response) => {
    // Check if there was an error
    if (chrome.runtime.lastError) {
      console.error('Error sending time limit alert:', chrome.runtime.lastError);
    } else {
      console.log('Time limit alert sent successfully, response:', response);
    }
  });
}

// Send data to backend
async function sendDataToBackend(url, durationInSeconds) {
  try {
    const response = await fetch('http://localhost:3000/api/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        durationInSeconds,
        date: new Date().toISOString()
      })
    });
    
    if (!response.ok) {
      console.error('Failed to send data to backend');
    }
  } catch (error) {
    console.error('Error sending data to backend:', error);
  }
}

// Check if data has been cleared from backend
async function checkIfDataCleared() {
  try {
    // First check if there's any data today
    const todayResponse = await fetch('http://localhost:3000/api/usage/today');
    const todayData = await todayResponse.json();
    
    // If this is the first check, just record the initial state
    if (!hasCheckedInitialState) {
      console.log('Initial data check:', todayData.length, 'records');
      lastKnownDataCount = todayData.length;
      hasCheckedInitialState = true;
      return;
    }
    
    // If data count has decreased significantly, check if it was cleared
    if (todayData.length < lastKnownDataCount / 2 && lastKnownDataCount > 0) {
      console.log('Data count decreased from', lastKnownDataCount, 'to', todayData.length);
      
      // Check when data was last cleared
      const lastClearedResponse = await fetch('http://localhost:3000/api/usage/last-cleared');
      const lastClearedData = await lastClearedResponse.json();
      const lastClearedTime = new Date(lastClearedData.lastCleared);
      
      // If the last cleared time is more recent than our last known cleared time
      if (lastClearedTime > lastKnownClearedTime) {
        console.log('Data has been cleared from backend');
        // Clear local storage
        chrome.storage.local.clear(() => {
          websiteLimits = {};
          usageData = {};
          // Notify popup that data has been cleared
          chrome.runtime.sendMessage({ type: 'dataCleared' });
        });
        
        // Update last known cleared time
        lastKnownClearedTime = lastClearedTime;
      }
    }
    
    lastKnownDataCount = todayData.length;
  } catch (error) {
    console.error('Error checking if data was cleared:', error);
  }
}

// Check every 10 seconds if data has been cleared
setInterval(checkIfDataCleared, 10000);

// Also check immediately when the extension loads
checkIfDataCleared();

// Reset usage data at midnight
chrome.alarms.create('dailyReset', {
  periodInMinutes: 1440, // 24 hours
  when: getNextMidnight()
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'dailyReset') {
    usageData = {};
    chrome.storage.local.set({ usageData });
  }
});

// Helper function to get next midnight
function getNextMidnight() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.getTime();
} 