// DOM Elements
const loadingScreen = document.getElementById("loadingScreen");
const galleryGrid = document.getElementById("galleryGrid");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxDescription = document.getElementById("lightboxDescription");
const lightboxDate = document.getElementById("lightboxDate");
const lightboxCategory = document.getElementById("lightboxCategory");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");
const addMemoryBtn = document.getElementById("addMemoryBtn");
const addMemoryModal = document.getElementById("addMemoryModal");
const modalClose = document.getElementById("modalClose");
const cancelAddMemory = document.getElementById("cancelAddMemory");
const addMemoryForm = document.getElementById("addMemoryForm");
const fileInput = document.getElementById("memoryImage");
const filePreview = document.getElementById("filePreview");
const filterButtons = document.querySelectorAll(".filter-btn");
const themeToggle = document.getElementById("themeToggle");
const mainNav = document.getElementById("mainNav");

// Google Drive Configuration (Public URL)
const MEMORIES_JSON_URL = "https://drive.google.com/uc?export=download&id=13aVjz95tV5JBDqVT4V25APaduQ2AZ45d"; // Ganti YOUR_JSON_FILE_ID
const GDRIVE_FOLDER_ID = "1hYtNaH_AVSZuE_HG5TXXCBqaQgSIBcVy"; // Ganti YOUR_FOLDER_ID dari link folder

// Current state
let currentFilter = "all";
let currentLightboxIndex = 0;
let filteredMemories = [];
let memories = [];
let isDarkTheme = true;

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(async () => {
    await loadMemoriesFromGoogleDrive();
    if (loadingScreen) loadingScreen.classList.add("hidden");
    initializeGallery();
  }, 1500);

  initEventListeners();
  initScrollAnimations();

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") toggleTheme();
});

// Load memories from Google Drive JSON
async function loadMemoriesFromGoogleDrive() {
  try {
    const response = await fetch(MEMORIES_JSON_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch memories: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Raw Google Drive Response:", data);

    if (!Array.isArray(data) || data.length === 0) {
      console.warn("Empty or invalid data from Google Drive");
      showNotification("No memories found in Google Drive - add some data!", "error");
      memories = [];
    } else {
      memories = data.map(row => ({
        id: row.id || "Unknown ID",
        title: row.title || "Untitled",
        description: row.description || "",
        date: row.date || "Unknown Date",
        category: row.category ? row.category.split(",") : ["uncategorized"],
        year: row.year || "Unknown Year",
        image: row.image || "https://via.placeholder.com/600x800?text=No+Image"
      }));
    }
    filteredMemories = [...memories];
  } catch (error) {
    console.error("Error fetching from Google Drive:", error.message);
    showNotification(`Failed to load memories: ${error.message}`, "error");
    memories = [];
    filteredMemories = [];
  }
}

// Initialize the gallery with photos
function initializeGallery() {
  if (!galleryGrid) return;

  galleryGrid.innerHTML = "";

  filteredMemories =
    currentFilter === "all"
      ? [...memories]
      : memories.filter(
          memory =>
            memory.category.includes(currentFilter) || memory.year === currentFilter
        );

  filteredMemories.forEach((memory, index) => {
    const galleryItem = document.createElement("div");
    galleryItem.className = "gallery-item fade-in";
    galleryItem.style.animationDelay = `${index * 0.1}s`;

    galleryItem.innerHTML = `
      <img src="${memory.image}" alt="${memory.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/600x800?text=Image+Not+Found';">
      <div class="gallery-item-overlay">
        <h3 class="gallery-item-title">${memory.title}</h3>
        <div class="gallery-item-meta">
          <span>${memory.date}</span>
          <span>${memory.category.join(", ")}</span>
        </div>
      </div>
    `;

    galleryItem.addEventListener("click", () => openLightbox(index));
    galleryGrid.appendChild(galleryItem);
  });

  if (filteredMemories.length === 0) {
    const emptyMessage = document.createElement("div");
    emptyMessage.className = "empty-gallery-message";
    emptyMessage.innerHTML = `
      <i class="fas fa-search"></i>
      <p>No memories found for this filter. Try another category or add new memories!</p>
    `;
    galleryGrid.appendChild(emptyMessage);
  }
}

// Initialize all event listeners
function initEventListeners() {
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      currentFilter = button.getAttribute("data-filter");
      initializeGallery();
    });
  });

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener("click", () => navigateLightbox(-1));
  if (lightboxNext) lightboxNext.addEventListener("click", () => navigateLightbox(1));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && lightbox.classList.contains("active")) closeLightbox();
  });

  if (addMemoryBtn) addMemoryBtn.addEventListener("click", openAddMemoryModal);
  if (modalClose) modalClose.addEventListener("click", closeAddMemoryModal);
  if (cancelAddMemory) cancelAddMemory.addEventListener("click", closeAddMemoryModal);
  if (addMemoryForm) addMemoryForm.addEventListener("submit", handleAddMemory);
  if (fileInput) fileInput.addEventListener("change", handleFilePreview);
  if (themeToggle) themeToggle.addEventListener("click", toggleTheme);
  window.addEventListener("scroll", handleScroll);
}

// Open lightbox with the selected image
function openLightbox(index) {
  currentLightboxIndex = index;
  const memory = filteredMemories[index];

  if (lightboxImage) lightboxImage.src = memory.image;
  if (lightboxTitle) lightboxTitle.textContent = memory.title;
  if (lightboxDescription) lightboxDescription.textContent = memory.description;
  if (lightboxDate) lightboxDate.textContent = memory.date;
  if (lightboxCategory) lightboxCategory.textContent = memory.category.join(", ");

  lightbox.classList.add("active");
  document.body.style.overflow = "hidden";
}

// Close the lightbox
function closeLightbox() {
  lightbox.classList.remove("active");
  document.body.style.overflow = "";
}

// Navigate through images in the lightbox
function navigateLightbox(direction) {
  currentLightboxIndex =
    (currentLightboxIndex + direction + filteredMemories.length) % filteredMemories.length;
  openLightbox(currentLightboxIndex);
}

// Open the add memory modal
function openAddMemoryModal() {
  if (addMemoryModal) {
    addMemoryModal.classList.add("active");
    document.body.style.overflow = "hidden";
    const memoryDateInput = document.getElementById("memoryDate");
    if (memoryDateInput) memoryDateInput.valueAsDate = new Date();
  }
}

// Close the add memory modal
function closeAddMemoryModal() {
  if (addMemoryModal) {
    addMemoryModal.classList.remove("active");
    if (addMemoryForm) addMemoryForm.reset();
    if (filePreview) filePreview.innerHTML = "";
    document.body.style.overflow = "";
  }
}

// Handle file input preview
function handleFilePreview(e) {
  if (!filePreview) return;
  filePreview.innerHTML = "";
  const file = e.target.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      const previewItem = document.createElement("div");
      previewItem.className = "file-preview-item scale-in";
      previewItem.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
      filePreview.appendChild(previewItem);
    };
    reader.readAsDataURL(file);
  }
}

// Handle form submission for adding a new memory to Google Drive
async function handleAddMemory(e) {
  e.preventDefault();

  const file = fileInput.files[0];
  if (!file) {
    showNotification("Please select an image", "error");
    return;
  }

  const selectedCategories = Array.from(
    document.getElementById("memoryCategory").selectedOptions
  ).map(option => option.value);

  const newMemory = {
    id: Date.now().toString(),
    title: document.getElementById("memoryTitle").value || "Untitled",
    description: document.getElementById("memoryDescription").value || "",
    date: new Date(document.getElementById("memoryDate").value).toISOString().split('T')[0],
    category: selectedCategories.length > 0 ? selectedCategories.join(",") : "uncategorized",
    year: new Date(document.getElementById("memoryDate").value).getFullYear().toString() || new Date().getFullYear().toString()
  };

  // Simulasi upload (karena nggak bisa langsung upload tanpa API key)
  showNotification("Upload not supported without API key - add manually to Google Drive and update memories.json", "error");

  // Uncomment ini kalau mau simulasi update memori lokal
  /*
  const imageUrl = "https://via.placeholder.com/600x800?text=Uploaded+Image"; // Ganti dengan URL manual
  newMemory.image = imageUrl;
  memories.unshift(newMemory);
  filteredMemories = [...memories];
  initializeGallery();
  showNotification("Memory added locally (manual upload needed to Google Drive)!");
  closeAddMemoryModal();
  */
}

// Show a notification message
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
  setTimeout(() => {
    notification.classList.add("fade-out");
    setTimeout(() => notification.remove(), 300);
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
    if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.style.setProperty("--bg-primary", "#f5f5f5");
    document.documentElement.style.setProperty("--bg-secondary", "#ffffff");
    document.documentElement.style.setProperty("--bg-tertiary", "#e9e9e9");
    document.documentElement.style.setProperty("--text-primary", "#121212");
    document.documentElement.style.setProperty("--text-secondary", "#555555");
    if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    localStorage.setItem("theme", "light");
  }
}

// Handle scroll events
function handleScroll() {
  if (!mainNav) return;
  if (window.scrollY > 100) {
    mainNav.style.background = isDarkTheme
      ? "rgba(30, 30, 30, 0.95)"
      : "rgba(255, 255, 255, 0.95)";
    mainNav.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
  } else {
    mainNav.style.background = isDarkTheme
      ? "var(--bg-secondary)"
      : "var(--bg-secondary)";
    mainNav.style.boxShadow = "none";
  }
}

// Initialize scroll animations using Intersection Observer
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll("section").forEach(section => {
    section.classList.add("hidden");
    observer.observe(section);
  });
}

// Add CSS for notification and hidden elements
const style = document.createElement("style");
style.textContent = `
  .notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: var(--accent-primary, #6200ea);
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    z-index: 1000;
  }
  .notification-content {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .notification.fade-out {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.3s, transform 0.3s;
  }
  .notification.error {
    background-color: #e74c3c;
  }
  .hidden {
    opacity: 0;
  }
  .fade-in {
    animation: fadeIn 0.5s ease-in forwards;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .lightbox {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    justify-content: center;
    align-items: center;
    flex-direction: column;
    z-index: 1000;
  }
  .lightbox.active {
    display: flex;
  }
  .lightbox img {
    max-width: 80%;
    max-height: 80%;
  }
`;
document.head.appendChild(style);
