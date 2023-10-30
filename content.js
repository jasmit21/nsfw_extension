// Function to extract image URLs from the page
console.log("Welcome To SAFEBROWSE's console");
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
  if (typeof imageUrls === "string") {
    // If a single URL is provided, find the matching img element
    const img = document.querySelector(`img[src="${imageUrls}"]`);
    if (img) {
      img.src = imageUrls;
      img.style.display = "block";
    }
  } else if (Array.isArray(imageUrls)) {
    // If an array of URLs is provided, update images in their original positions
    imageUrls.forEach((imageUrl, index) => {
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
// Make an HTTP POST request to the server to fetch responses
fetch("http://127.0.0.1:5000/generate_caption", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ image_urls: imageUrls }),
})
  .then((response) => response.json())
  .then((data) => {
    console.log("Response from server:", data);

    for (let i = 0; i < data.length; i++) {
      if (data[i].label == "Sexually explicit" || data[i].label == "Violent") {
        if (data[i].scores < 0.6) {
          console.log(
            "Label for Image ",
            i + 1,
            ":",
            data[i].label,
            "img_url: ",
            data[i].image_url
          );

          allowedImageUrls.push(data[i].image_url);
        }
      } else if (data[i].label == "Neutral") {
        console.log(
          "Label for Image ",
          i + 1,
          ":",
          data[i].label,
          "img_url: ",
          data[i].image_url
        );

        allowedImageUrls.push(data[i].image_url);
      }
    }
    showImages(allowedImageUrls);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
