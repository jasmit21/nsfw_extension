// content.js
console.log("hello jasmit ");
// Get all the image elements on the page
const imageElements = document.getElementsByTagName("img");

// Create an array to store the image URLs
const imageUrls = [];

// Loop through the image elements and extract their src attributes
for (let i = 0; i < imageElements.length; i++) {
  const imageUrl = imageElements[i].src;
  imageUrls.push(imageUrl);
}

// Now you can do whatever you want with the extracted image URLs
console.log(imageUrls);
// content.js

// Listen for a message from the background script
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.action === "blockImages") {
//       if (message.flag === 1) {
//         // Select all image elements and set their 'src' attribute to an empty value
//         const imageElements = document.getElementsByTagName("img");
//         for (let i = 0; i < imageElements.length; i++) {
//           imageElements[i].src = "";
//         }
//       }
//     }
//   });
// content.js

// Listen for a message from the background script
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.action === "blockPageLoad" && message.flag === 1) {
//       // Stop the page from loading
//       window.stop();
//     }
//   });
// content.js

// let shouldBlockLoad = false;

// Listen for a message from the background script
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === "setLoadFlag") {
//     shouldBlockLoad = message.flag === 1;
//   }
// });