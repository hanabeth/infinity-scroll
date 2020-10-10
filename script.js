const imageContainer = document.getElementById("image-container");
const loader = document.getElementById("loader");

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];
let isInitialLoad = true;

//  Unsplash API
let imageCount = 5;
// Provide Unsplash API key below. Details in README.
const apiKey = "";
let apiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${imageCount}`;

// Update API URL with new count after initial load.
function updateUrlWithNewCount(newImageCount) {
  apiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${newImageCount}`;
}

// Check if all images fiinshed loading
function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    ready = true;
    loader.hidden = true;
  }
}

// Helper function to st attributes on DOM elements
function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

// Create elements for links and phots, then add to DOM
function displayPhotos() {
  imagesLoaded = 0;
  totalImages = photosArray.length;
  // Run function for each object in photosArray
  photosArray.forEach((photo) => {
    const item = document.createElement("a");
    setAttributes(item, {
      href: photo.links.html,
      target: "_blank",
    });

    const img = document.createElement("img");
    setAttributes(img, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description,
    });

    img.addEventListener("load", imageLoaded);

    item.appendChild(img);
    imageContainer.append(item);
  });
}

// Get photos from Unsplash API
async function getPhotos() {
  try {
    const response = await fetch(apiUrl);
    photosArray = await response.json();
    displayPhotos();

    if (isInitialLoad) {
      updateUrlWithNewCount(30);
      isInitialLoad = false;
    }
  } catch (error) {
    console.log("There was an error when getting photos.");
  }
}

// Load more photos if scrolling near bottom of page
window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
    ready
  ) {
    ready = false;
    getPhotos();
  }
});

// On load get photos
getPhotos();
