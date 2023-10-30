// Function to extract image URLs from the page
console.log("hoga ??");
function extractImageUrls() {
  const images = Array.from(document.querySelectorAll("img"));
  return images.map((img) => img.src);
}

// Function to hide all images on the page
function hideImageByUrl(imageUrl) {
  const images = document.querySelectorAll("img");
  images.forEach((img) => {
    if (img.src === imageUrl) {
      img.style.display = "none";
    }
  });
}

// Function to show images based on the server response
function showImages(imageUrls) {
  const images = document.querySelectorAll("img");
  images.forEach((img, index) => {
    if (imageUrls[index]) {
      img.src = imageUrls[index];
      img.style.display = "block";
    }
  });
}

// Extract image URLs from the page and hide the images
const imageUrls = extractImageUrls();
// hideImages();
console.log(imageUrls);

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

      // Find the category with the highest score
      let maxScore = -1;
      let maxCategory = '';
      for (let j = 0; j < data.labels.length; j++) {
        if (data.scores[j] > maxScore) {
            maxScore = data.scores[j];
            maxCategory = data.labels[j];
            }
          }
      
      console.log('Highest scoring category for image ' + i + ':', maxCategory, 'with score:', maxScore);
      if(maxCategory == 'Sexually explicit'){
        hideImageByUrl(imageUrls[i]);
      }
      
      // You can access the generated caption in data.caption and print it
    })
    .catch(error => {
      console.error('Error for image ' + i + ':', error);
    });
}
