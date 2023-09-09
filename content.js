// content.js
console.log("hello jasmit ");

// Define a function to hide images
function hideImages() {
  const images = document.querySelectorAll('img'); // Select all <img> elements

  images.forEach((image) => {
    image.style.display = 'none'; // Hide the image by setting its display property to 'none'
  });
}

// Call the hideImages function immediately when the content script runs
hideImages();


// Get all the image elements on the page
const imageElements = document.getElementsByTagName("img");

// Create an array to store the image URLs
const imageUrls = [];

// Loop through the image elements and extract their src attributes
for (let i = 0; i < imageElements.length; i++) {
  const imageUrl = imageElements[i].src;
  imageUrls.push(imageUrl);
}
// fetch()

// Now you can do whatever you want with the extracted image URLs
console.log(imageUrls);

// Create a JSON object containing the image URLs
const data = { imageUrls };

// Send a POST request to your Flask server

// content.js

