// background.js
  
chrome.runtime.onInstalled.addListener(function () {
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [],
      addRuleIds: ["1"] // The rule ID from your rules JSON file
    });
  });
  