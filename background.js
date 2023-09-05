// background.js

// Listen for a click on the extension's browser action
// chrome.browserAction.onClicked.addListener(tab => {
//     // Send a message to the content script to block images
//     chrome.tabs.sendMessage(tab.id, { action: "blockImages", flag: 1 });
//   });

// background.js

// Listen for a click on the extension's browser action
// chrome.browserAction.onClicked.addListener(tab => {
//     // Send a message to the content script to block the page load
//     chrome.tabs.sendMessage(tab.id, { action: "blockPageLoad", flag: 1 });
//   });
// background.js

// Listen for a click on the extension's browser action
// chrome.browserAction.onClicked.addListener(tab => {
//     // Determine whether to block the page load (set flag as needed)
//     const shouldBlock = 1 // Set this based on your conditions
//     const flagValue = shouldBlock ? 1 : 0;
  
//     // Send a message to the content script to set the flag
//     chrome.tabs.sendMessage(tab.id, { action: "setLoadFlag", flag: flagValue });
//   });
  
// content.js
