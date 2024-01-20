console.log("Welcome To SAFEBROWSE's console");

// Function to extract image URLs from the page
function extractImageUrls() {
  const images = Array.from(document.querySelectorAll("img"));
  return images.map((img) => img.src);
}

// Function to hide all images on the page
function hideImages() {
  const images = document.querySelectorAll("img");
  images.forEach((img) => {
    img.style.display = "none";
  });
}

// Function to show an image based on the server response
function showImage(imageUrl) {
  console.log("Showing image:", imageUrl);
  const img = document.querySelector(`img[src="${imageUrl}"]`);
  if (img) {
    img.src = imageUrl;
    img.style.display = "block";
  }
}

// Function to process an image
function processImage(imageUrls, index = 0) {
  if (index >= imageUrls.length) {
    return; // No more images to process
  }

  const imageUrl = imageUrls[index];
  fetch("http://127.0.0.1:8000/generate_caption_and_classify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image_urls: [imageUrl] }),
  })
  .then((response) => response.json())
  .then((data) => {
    console.log("Response from server for image:", index + 1, data);

    // Assuming response is an array with a single item for the current image
    const item = data[0];
    const { image_url, classification } = item;
    const { category, label } = classification;

    console.log(`Label for Image ${index + 1}: ${label}, Category: ${category}, URL: ${image_url}`);

    // Logic to determine if the image should be shown
    if (category === "Neutral" || (category !== "Neutral" && label < 0.6)) {
      showImage(image_url);
    }

    // Process the next image
    processImage(imageUrls, index + 1);
  })
  .catch((error) => {
    console.error("Error processing image", index + 1, error);
    // Process the next image even if there was an error
    processImage(imageUrls, index + 1);
  });
}

// Extract image URLs from the page and hide the images
const imageUrls = extractImageUrls();
hideImages();
console.log(imageUrls);

// Start processing images one by one
processImage(imageUrls);