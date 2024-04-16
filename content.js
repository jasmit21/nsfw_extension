console.log("Welcome To SAFEBROWSE's console");
// Function to extract image URLs from the page
function extractImageUrls() {
  const images = Array.from(document.querySelectorAll("img"));
  console.log("image array : ",images);
  return images.map((img) => img.src);
}
// Store original image URLs before hiding them
const originalImageUrls = {};


function hideImages() {
  const images = document.querySelectorAll("img");
  console.log("images hidden are : ",images);
  images.forEach((img) => {
    img.style.visibility = "hidden";
  });
  console.log("after hidden ",document.querySelector(`img[src="https://cluedin.dbit.in/dist/img/CluedIn.png"]`)); 
}



function findImageBySrc(imageUrl) {
  const images = document.querySelectorAll("img");
  for (let i = 0; i < images.length; i++) {
    if (images[i].src === imageUrl) {
      return images[i]; // Return the image element if its src matches imageUrl
    }
  }
  return null; // Return null if no matching image is found
}
function showImage(imageUrl, category, score) {
  console.log("Showing image:", imageUrl);
  if ((category === "Sexually explicit" || category === "Violent") && score > 0.5) {
    console.log(`Blocking image with URL: ${imageUrl}`);
    // Load default image instead of blocking
    const originalSrc = originalImageUrls[imageUrl];
    if (findImageBySrc(imageUrl)) {
      console.log("Inside 2nd if of block image");
      // const images = document.querySelectorAll("img");
      let img = findImageBySrc(imageUrl);
      img.style.visibility = "visible"; // Make the image visible
      img.src = 'https://placehold.jp/20/dedede/433d3d/250x250.png?text=Content%20is%20blocked%20%0Aby%20SafeBrowse'; //Load placeholder
      // images.forEach(img => {
      //   if (img.src === originalSrc) {
          
      //   }
      // });
    }
  } else {
    // Show the original image since it's safe
    if (findImageBySrc(imageUrl)) {
      console.log("inside if of displaying image");
      let img = findImageBySrc(imageUrl);
      img.src = imageUrl;
      img.style.visibility = "visible"; // Make the image visible
    }
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
    const { category, scores } = classification;
    console.log(`Category for Image ${index + 1}: ${category}, Score: ${scores}`);
    // Show or block the image based on category and score
    showImage(image_url, category, scores);
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
