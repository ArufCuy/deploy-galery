// DOM Elements
const camera = document.getElementById("camera");
const photoCanvas = document.getElementById("photoCanvas");
const photoPreview = document.getElementById("photoPreview");
const captureBtn = document.getElementById("captureBtn");
const switchCameraBtn = document.getElementById("switchCameraBtn");
const retakeBtn = document.getElementById("retakeBtn");
const saveBtn = document.getElementById("saveBtn");
const savePhotoModal = document.getElementById("savePhotoModal");
const saveModalClose = document.getElementById("saveModalClose");
const cancelSavePhoto = document.getElementById("cancelSavePhoto");
const savePhotoForm = document.getElementById("savePhotoForm");
const imageUpload = document.getElementById("imageUpload");
const uploadPreview = document.getElementById("uploadPreview");
const uploadBtn = document.getElementById("uploadBtn");
const uploadForm = document.getElementById("uploadForm");
const themeToggle = document.getElementById("themeToggle");

// State variables
let stream = null;
let facingMode = "user"; // 'user' for front camera, 'environment' for back camera
let capturedImage = null;
let uploadedImage = null;
let isDarkTheme = true;

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  // Start camera
  startCamera();

  // Initialize event listeners
  initEventListeners();

  // Check if dark theme is already set in localStorage
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    toggleTheme();
  }
});

// Initialize camera
async function startCamera() {
  try {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    const constraints = {
      video: {
        facingMode: facingMode,
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    };

    stream = await navigator.mediaDevices.getUserMedia(constraints);
    camera.srcObject = stream;

    // Enable capture button once camera is ready
    camera.onloadedmetadata = () => {
      captureBtn.disabled = false;
    };
  } catch (error) {
    console.error("Error accessing camera:", error);
    showNotification("Camera access denied or not available", "error");

    // Show fallback message in camera container
    const cameraContainer = document.querySelector(".camera-container");
    cameraContainer.innerHTML = `
      <div class="empty-preview">
        <i class="fas fa-exclamation-triangle"></i>
        <p>Camera access denied or not available. Please check your browser permissions or use the upload option below.</p>
      </div>
    `;
  }
}

// Initialize all event listeners
function initEventListeners() {
  // Capture photo
  captureBtn.addEventListener("click", capturePhoto);

  // Switch camera (front/back)
  switchCameraBtn.addEventListener("click", switchCamera);

  // Retake photo
  retakeBtn.addEventListener("click", retakePhoto);

  // Save photo button
  saveBtn.addEventListener("click", openSaveModal);

  // Modal controls
  saveModalClose.addEventListener("click", closeSaveModal);
  cancelSavePhoto.addEventListener("click", closeSaveModal);

  // Form submission
  savePhotoForm.addEventListener("submit", handleSavePhoto);

  // File upload
  imageUpload.addEventListener("change", handleImageUpload);

  // Upload form submission
  uploadForm.addEventListener("submit", handleUploadSubmit);

  // Theme toggle
  themeToggle.addEventListener("click", toggleTheme);
}

// Capture photo from camera
function capturePhoto() {
  const context = photoCanvas.getContext("2d");

  // Set canvas dimensions to match video
  photoCanvas.width = camera.videoWidth;
  photoCanvas.height = camera.videoHeight;

  // Draw the video frame to the canvas
  context.drawImage(camera, 0, 0, photoCanvas.width, photoCanvas.height);

  // Get the image data
  capturedImage = photoCanvas.toDataURL("image/png");

  // Display the captured image
  photoPreview.innerHTML = `<img src="${capturedImage}" alt="Captured photo">`;

  // Enable buttons
  retakeBtn.disabled = false;
  saveBtn.disabled = false;
}

// Switch between front and back cameras
function switchCamera() {
  facingMode = facingMode === "user" ? "environment" : "user";
  startCamera();
}

// Retake photo
function retakePhoto() {
  // Clear the preview
  photoPreview.innerHTML = `
    <div class="empty-preview">
      <i class="fas fa-camera"></i>
      <p>Your captured photo will appear here</p>
    </div>
  `;

  // Reset state
  capturedImage = null;

  // Disable buttons
  retakeBtn.disabled = true;
  saveBtn.disabled = true;
}

// Open save modal
function openSaveModal() {
  savePhotoModal.classList.add("active");
  document.body.style.overflow = "hidden"; // Prevent scrolling

  // Set default date to today
  document.getElementById("photoDate").valueAsDate = new Date();
}

// Close save modal
function closeSaveModal() {
  savePhotoModal.classList.remove("active");
  savePhotoForm.reset();
  document.body.style.overflow = ""; // Restore scrolling
}

// Handle save photo form submission
function handleSavePhoto(e) {
  e.preventDefault();

  // Get form data
  const photoData = {
    title: document.getElementById("photoTitle").value,
    description: document.getElementById("photoDescription").value,
    date: new Date(
      document.getElementById("photoDate").value
    ).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    category: document.getElementById("photoCategory").value,
    year: new Date(document.getElementById("photoDate").value)
      .getFullYear()
      .toString(),
    image: capturedImage || uploadedImage,
  };

  // In a real application, this would send data to a server
  // For this demo, we'll store in localStorage

  // Get existing memories or initialize empty array
  let memories = JSON.parse(localStorage.getItem("memories") || "[]");

  // Add new memory
  memories.unshift(photoData);

  // Save to localStorage
  localStorage.setItem("memories", JSON.stringify(memories));

  // Close modal
  closeSaveModal();

  // Reset state
  if (capturedImage) {
    retakePhoto();
  } else {
    // Reset upload
    uploadPreview.innerHTML = "";
    uploadedImage = null;
    uploadBtn.disabled = true;
    uploadForm.reset();
  }

  // Show success message
  showNotification("Photo saved to gallery successfully!");

  // Redirect to gallery after a short delay
  setTimeout(() => {
    window.location.href = "index.html#gallery";
  }, 2000);
}

// Handle image upload
function handleImageUpload(e) {
  uploadPreview.innerHTML = "";
  const file = e.target.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      uploadedImage = event.target.result;

      const previewItem = document.createElement("div");
      previewItem.className = "file-preview-item scale-in";
      previewItem.innerHTML = `<img src="${uploadedImage}" alt="Preview">`;
      uploadPreview.appendChild(previewItem);

      // Enable upload button
      uploadBtn.disabled = false;
    };
    reader.readAsDataURL(file);
  } else {
    uploadBtn.disabled = true;
  }
}

// Handle upload form submission
function handleUploadSubmit(e) {
  e.preventDefault();

  if (uploadedImage) {
    // Open save modal to add details
    openSaveModal();
  }
}

// Show notification
function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.className = `notification ${type} scale-in`;

  const icon = type === "success" ? "check-circle" : "exclamation-circle";

  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${icon}"></i>
      <p>${message}</p>
    </div>
  `;

  document.body.appendChild(notification);

  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.classList.add("fade-out");
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Toggle between dark and light theme
function toggleTheme() {
  isDarkTheme = !isDarkTheme;

  if (isDarkTheme) {
    document.documentElement.style.setProperty("--bg-primary", "#121212");
    document.documentElement.style.setProperty("--bg-secondary", "#1e1e1e");
    document.documentElement.style.setProperty("--bg-tertiary", "#252525");
    document.documentElement.style.setProperty("--text-primary", "#ffffff");
    document.documentElement.style.setProperty("--text-secondary", "#b3b3b3");
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.style.setProperty("--bg-primary", "#f5f5f5");
    document.documentElement.style.setProperty("--bg-secondary", "#ffffff");
    document.documentElement.style.setProperty("--bg-tertiary", "#e9e9e9");
    document.documentElement.style.setProperty("--text-primary", "#121212");
    document.documentElement.style.setProperty("--text-secondary", "#555555");
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    localStorage.setItem("theme", "light");
  }
}

// Add error notification style
const style = document.createElement("style");
style.textContent = `
  .notification.error {
    background-color: #e74c3c;
  }
  
  .notification.success {
    background-color: var(--accent-primary);
  }
`;
document.head.appendChild(style);
