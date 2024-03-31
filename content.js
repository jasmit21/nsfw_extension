// console.log("Welcome To SAFEBROWSE's console");

// // Function to extract image URLs from the page
// function extractImageUrls() {
//   const images = Array.from(document.querySelectorAll("img"));
//   return images.map((img) => img.src);
// }

// // Function to hide all images on the page
// function hideImages() {
//   const images = document.querySelectorAll("img");
//   images.forEach((img) => {
//     img.style.display = "none";
//   });
// }

// // Function to show an image based on the server response
// function showImage(imageUrl) {
//   console.log("Showing image:", imageUrl);
//   const img = document.querySelector(`img[src="${imageUrl}"]`);
//   if (img) {
//     img.src = imageUrl;
//     img.style.display = "block";
//   }
// }

// // Function to process an image
// function processImage(imageUrls, index = 0) {
//   if (index >= imageUrls.length) {
//     return; // No more images to process
//   }

//   const imageUrl = imageUrls[index];
//   fetch("http://127.0.0.1:8000/generate_caption_and_classify", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ image_urls: [imageUrl] }),
//   })
//   .then((response) => response.json())
//   .then((data) => {
//     console.log("Response from server for image:", index + 1, data);

//     // Assuming response is an array with a single item for the current image
//     const item = data[0];
//     const { image_url, classification } = item;
//     const { category, label } = classification;

//     console.log(`Label for Image ${index + 1}: ${label}, Category: ${category}, URL: ${image_url}`);

//     // Logic to determine if the image should be shown
//     if (category === "Neutral" || (category !== "Neutral" && label < 0.6)) {
//       showImage(image_url);
//     }

//     // Process the next image
//     processImage(imageUrls, index + 1);
//   })
//   .catch((error) => {
//     console.error("Error processing image", index + 1, error);
//     // Process the next image even if there was an error
//     processImage(imageUrls, index + 1);
//   });
// }

// // Extract image URLs from the page and hide the images
// const imageUrls = extractImageUrls();
// hideImages();
// console.log(imageUrls);

// // Start processing images one by one
// processImage(imageUrls);

//new code 

console.log("Welcome To SAFEBROWSE's console");

// Function to extract image URLs from the page
function extractImageUrls() {
  const images = Array.from(document.querySelectorAll("img"));
  console.log("image array : ",images);
  return images.map((img) => img.src);
}

// Store original image URLs before hiding them
const originalImageUrls = {};

// function hideImages() {
//   const images = document.querySelectorAll("img");
//   images.forEach((img) => {
//     // Store the original src attribute value
//     originalImageUrls[img.src] = img.src;
//     img.src = ""; // Remove the src attribute
//   });
// }
function hideImages() {
  const images = document.querySelectorAll("img");
  console.log("images hidden are : ",images);
  images.forEach((img) => {
    img.style.visibility = "hidden";
  });
  console.log("after hidden ",document.querySelector(`img[src="https://cluedin.dbit.in/dist/img/CluedIn.png"]`)); 
}


// Function to show an image based on the server response
// function showImage(imageUrl, category, score) {
//   console.log("Showing image:", imageUrl);
//   if ((category === "Sexually explicit" || category === "Violent") && score > 0.5) {
//     console.log(`Blocking image with URL: ${imageUrl}`);
//     // Block or hide the image
//     const img = document.querySelector(`img[src="${imageUrl}"]`);
//     if (img) {
//       img.style.display = "none";
//     }
//   } else {
//     // Show the image since it's safe
//     const img = document.querySelector(`img[src="${imageUrl}"]`);
//     console.log("img(inside show images and response): ",img);
//     if (img) {
//       console.log("inside if of displaying image");
//       img.src = imageUrl;
//       img.style.display = "block";
//     }
//   }
// }
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
    // Block or hide the image
    const originalSrc = originalImageUrls[imageUrl];
    if (originalSrc) {
      const images = document.querySelectorAll("img");
      images.forEach(img => {
        if (img.src === originalSrc) {
          img.style.visibility = "hidden"; // Hide the image
        }
      });
    }
  } else {
    // Show the image since it's safe
    // const img = document.querySelector(`img[src="${imageUrl}"]`);
    // findImageBySrc(imageUrl);
    // console.log("img(inside show images and response): ", img);
    if (findImageBySrc(imageUrl)) {
      console.log("inside if of displaying image");
      let img = findImageBySrc(imageUrl);
      img.src = imageUrl;
      img.style.visibility = "visible"; // Make the image visible
    }
  }
}

// function showImage(imageUrl, category, score) {
//   console.log("Showing image:", imageUrl);
//   console.log("originalImageUrls: ",originalImageUrls);
//   if ((category === "Sexually explicit" || category === "Violent") && score > 0.5) {
//     console.log(`Blocking image with URL: ${imageUrl}`);
//     // Block or hide the image
//     const originalSrc = originalImageUrls[imageUrl];
//     console.log("=======originalSrc====",originalSrc);
//     const img = document.querySelector(`img[src="${originalSrc}"]`);
//     if (img) {
//       img.style.display = "none"; // Ensure the image is hidden
//     }
//   } else {
//     // Show the image since it's safe
//     const originalSrc = originalImageUrls[imageUrl];
//     console.log("=======originalSrc====",originalSrc);
//     const img = document.querySelector(`img[src="${originalSrc}"]`);
//     console.log("img(inside show images and response): ", img);
//     if (img) {
//       console.log("inside if of displaying image");
//       img.src = imageUrl;
//       img.style.display = ""; // Reset display property to default (inline or block)
//     }
//   }
// }

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
