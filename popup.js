// Example popup.js
document.addEventListener("DOMContentLoaded", function () {
    const imageToggleCheckboxes = document.querySelectorAll(".image-toggle");
  
    // Add a click event listener to each toggle checkbox
    imageToggleCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("click", function () {
        const imageId = checkbox.getAttribute("data-image-id");
        const displayImage = checkbox.checked;
        
        // Send a message to the content script to toggle image visibility
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { imageId, displayImage });
        });
      });
    });
  });
  