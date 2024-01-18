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

// Function to show images based on the server response
function showImages(imageUrls) {
  console.log("inside Show images function\n");
  if (Array.isArray(imageUrls)) {
    imageUrls.forEach((imageUrl) => {
      const img = document.querySelector(`img[src="${imageUrl}"]`);
      if (img) {
        img.src = imageUrl;
        img.style.display = "block";
      }
    });
  }
}

// Extract image URLs from the page and hide the images
const imageUrls = extractImageUrls();
hideImages();
console.log(imageUrls);
const allowedImageUrls = [];

// Make an HTTP POST request to the Captioning Server
fetch("http://127.0.0.1:5000/generate_caption_and_classify", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ image_urls: imageUrls }),
})
.then((response) => response.json())
.then((data) => {
  console.log("Response from server:", data);

  // Process the response to decide which images to show
  data.forEach((item, index) => {
    const { image_url, classification } = item;
    const { category, label } = classification;

    console.log(`Label for Image ${index + 1}: ${label}, Category: ${category}, URL: ${image_url}`);

    // Logic to determine if the image should be shown
    if (category === "Neutral" || (category !== "Neutral" && label < 0.6)) {
      allowedImageUrls.push(image_url);
    }
  });

  showImages(allowedImageUrls);
})
.catch((error) => {
  console.error("Error:", error);
});
