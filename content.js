// content.js
console.log("Welcome to SafeBrowse ");
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

// Make an HTTP POST request to the /generate_caption route
for (let i = 0; i < imageUrls.length; i++) {
  fetch('http://127.0.0.1:5000/generate_caption', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ image_url: imageUrls[i] }) // Send the current image URL
  })
    .then(response => response.json())
    .then(data => {
      console.log("Response for image " + i + ":");
      console.log('Response from /generate_caption:', data);
      // You can access the generated caption in data.caption and print it
    })
    .catch(error => {
      console.error('Error for image ' + i + ':', error);
    });
}
