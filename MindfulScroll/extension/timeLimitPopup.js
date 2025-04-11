// Time Limit Popup functionality
function showTimeLimitPopup(url) {
  console.log('Showing time limit popup for:', url);
  
  // Create the popup container
  const popupContainer = document.createElement('div');
  popupContainer.id = 'mindfulScrollPopup';
  popupContainer.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 10000;
    text-align: center;
    width: 300px;
    font-family: Arial, sans-serif;
  `;
  
  // Create the overlay
  const overlay = document.createElement('div');
  overlay.id = 'mindfulScrollOverlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
  `;
  
  // Set the popup content
  popupContainer.innerHTML = `
    <h2 style="margin: 0 0 15px 0; color: #1f2937;">Time Limit Reached</h2>
    <p style="margin: 0 0 20px 0; color: #4b5563;">You've hit the time limit for ${url}</p>
    <div style="display: flex; justify-content: center;">
      <button id="mindfulScrollContinueBtn" style="
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
  
  // Add elements to the page
  document.body.appendChild(overlay);
  document.body.appendChild(popupContainer);
  
  // Add event listener to the continue button
  const continueBtn = document.getElementById('mindfulScrollContinueBtn');
  continueBtn.addEventListener('click', () => {
    console.log('Continue button clicked');
    popupContainer.remove();
    overlay.remove();
    
    // Notify the background script that the user chose to continue
    chrome.runtime.sendMessage({
      type: 'continueAnyway',
      url: url
    });
  });
}

// Export the function for use in other scripts
window.showTimeLimitPopup = showTimeLimitPopup; 