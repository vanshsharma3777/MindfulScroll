document.addEventListener('DOMContentLoaded', () => {
  const websiteUrlInput = document.getElementById('websiteInput');
  const timeLimitInput = document.getElementById('timeLimit');
  const addWebsiteBtn = document.getElementById('addWebsite');
  const websitesList = document.getElementById('websitesList');
  const timeLimitPopup = document.getElementById('timeLimitPopup');
  const overlay = document.getElementById('overlay');
  const limitUrl = document.getElementById('limitUrl');
  const continueBtn = document.getElementById('continueBtn');
  const dashboardBtn = document.getElementById('dashboardBtn');
  const container = document.querySelector('.container');

  // Check if this is a time limit popup
  const urlParams = new URLSearchParams(window.location.search);
  const limitUrlParam = urlParams.get('url');
  
  if (limitUrlParam) {
    // Show time limit popup
    container.style.display = 'none';
    timeLimitPopup.classList.remove('hidden');
    overlay.classList.remove('hidden');
    limitUrl.textContent = limitUrlParam;
    
    continueBtn.addEventListener('click', () => {
      // Send message to background script to allow continued access
      chrome.runtime.sendMessage({ 
        type: 'continueAnyway',
        url: limitUrlParam
      });
      window.close();
    });

    dashboardBtn.addEventListener('click', () => {
      // Open dashboard in new tab
      chrome.tabs.create({ url: chrome.runtime.getURL('dashboard.html') });
      window.close();
    });
    return;
  }

  // Load saved websites
  loadWebsites();

  // Listen for data cleared message
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'dataCleared') {
      websitesList.innerHTML = '';
    }
  });

  // Add website button click handler
  addWebsiteBtn.addEventListener('click', () => {
    const url = websiteUrlInput.value.trim();
    const timeLimit = parseInt(timeLimitInput.value);

    if (!url || !timeLimit) {
      alert('Please enter both URL and time limit');
      return;
    }

    chrome.storage.local.get(['websiteLimits'], (result) => {
      const websiteLimits = result.websiteLimits || {};
      websiteLimits[url] = timeLimit;
      
      chrome.storage.local.set({ websiteLimits }, () => {
        websiteUrlInput.value = '';
        timeLimitInput.value = '';
        loadWebsites();
      });
    });
  });

  // Load saved websites
  function loadWebsites() {
    chrome.storage.local.get(['websiteLimits'], (result) => {
      const websiteLimits = result.websiteLimits || {};
      websitesList.innerHTML = '';

      Object.entries(websiteLimits).forEach(([url, limit]) => {
        const div = document.createElement('div');
        div.className = 'website-item';
        div.innerHTML = `
          <span>${url} (${limit} minutes)</span>
          <button class="remove-website" data-url="${url}">Remove</button>
        `;
        websitesList.appendChild(div);
      });

      // Add remove button handlers
      document.querySelectorAll('.remove-website').forEach(button => {
        button.addEventListener('click', (e) => {
          const url = e.target.dataset.url;
          chrome.storage.local.get(['websiteLimits'], (result) => {
            const websiteLimits = result.websiteLimits || {};
            delete websiteLimits[url];
            chrome.storage.local.set({ websiteLimits }, loadWebsites);
          });
        });
      });
    });
  }
}); 