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

// Sample data for the gallery
const defaultMemories = [
  {
    id: 1,
    title: "3 Cowok belum siap foto",
    description: "Si Arup Belum siap tuh, tegang bet muka awokawok.",
    date: "April 20, 2024",
    category: ["mubarak", "friends"],
    year: "2024",
    image: "https://i.postimg.cc/kgs3NLHs/FNA02804.jpg",
  },
  {
    id: 2,
    title: "Dane nahan tawa kampret😭",
    description: "Ngakak bet sama muka dane!",
    date: "April 20, 2024",
    category: ["mubarak", "friends"],
    year: "2024",
    image: "https://i.postimg.cc/jStY7RMC/FNA02807.jpg",
  },
  {
    id: 3,
    title: "Udah happy guys lulus SMA",
    description:
      "Surprise birthday party for Sarah. Her reaction was priceless!",
    date: "April 20, 2024",
    category: ["mubarak", "friends"],
    year: "2024",
    image: "https://i.postimg.cc/zGBpMMB0/FNA02825.jpg",
  },
  {
    id: 4,
    title: "Pose bebas",
    description: "Nih lumayan nih fotonya.",
    date: "April 20, 2024",
    category: ["mubarak", "friends"],
    year: "2024",
    image: "https://i.postimg.cc/NfbpdYgK/FNA02877.jpg",
  },
  {
    id: 5,
    title: "Cuma ceweknya yang semangat foto",
    description: "Cowoknya capek semua foto keknya.",
    date: "April 20, 2024",
    category: ["mubarak", "friends"],
    year: "2024",
    image: "https://i.postimg.cc/dVxnKBZv/FNA02878.jpg",
  },
  {
    id: 6,
    title: "Merapat!",
    description: "Foto keluarga besar Mubarak fams.",
    date: "April 20, 2024",
    category: ["mubarak", "friends"],
    year: "2024",
    image: "https://i.postimg.cc/nVGkLZ93/FNA02884.jpg",
  },
  {
    id: 7,
    title: "Mencoba Keceh",
    description: "Kaca mata jaya kegedean awokawok",
    date: "April 20, 2024",
    category: ["mubarak", "friends"],
    year: "2024",
    image: "https://i.postimg.cc/wTWQhVVJ/FNA02918.jpg",
  },
  {
    id: 8,
    title: "Merapat Lagi!",
    description: "Kampusnya misah semua😭",
    date: "April 20, 2024",
    category: ["mubarak", "friends"],
    year: "2024",
    image: "https://i.postimg.cc/HxCwpPYG/FNA02892.jpg",
  },
  {
    id: 9,
    title: "Samping jaya tegang bet",
    description: "Gak afdol kalau foto gak miring kepala cewenya!",
    date: "April 20, 2024",
    category: ["mubarak", "friends"],
    year: "2024",
    image: "https://i.postimg.cc/kgs3NLHs/FNA02804.jpg",
  },
];

// Current state
let currentFilter = "all";
let currentLightboxIndex = 0;
let filteredMemories = [];
let memories = [];
let isDarkTheme = true;

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  // Load memories from localStorage or use default
  loadMemories();

  // Simulate loading
  setTimeout(() => {
    loadingScreen.classList.add("hidden");
    initializeGallery();
  }, 1500);

  // Initialize event listeners
  initEventListeners();

  // Handle scroll animations
  initScrollAnimations();

  // Check if dark theme is already set in localStorage
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    toggleTheme();
  }
});

// Load memories from localStorage
function loadMemories() {
  const savedMemories = localStorage.getItem("memories");

  if (savedMemories) {
    // Combine saved memories with default ones
    const parsedMemories = JSON.parse(savedMemories);
    memories = [...parsedMemories, ...defaultMemories];
  } else {
    memories = [...defaultMemories];
  }

  filteredMemories = [...memories];
}

// Initialize the gallery with photos
function initializeGallery() {
  // Clear skeleton loading placeholders
  galleryGrid.innerHTML = "";

  // Filter memories based on current filter
  filteredMemories =
    currentFilter === "all"
      ? [...memories]
      : memories.filter(
          (memory) =>
            memory.category.includes(currentFilter) ||
            memory.year === currentFilter
        );

  // Create gallery items
  filteredMemories.forEach((memory, index) => {
    const galleryItem = document.createElement("div");
    galleryItem.className = "gallery-item fade-in";
    galleryItem.style.animationDelay = `${index * 0.1}s`;

    galleryItem.innerHTML = `
      <img src="${memory.image}" alt="${memory.title}" loading="lazy">
      <div class="gallery-item-overlay">
        <h3 class="gallery-item-title">${memory.title}</h3>
        <div class="gallery-item-meta">
          <span>${memory.date}</span>
          <span>${memory.category.join(
            ", "
          )}</span> <!-- Tampilin semua kategori -->
        </div>
      </div>
    `;

    galleryItem.addEventListener("click", () => openLightbox(index));
    galleryGrid.appendChild(galleryItem);
  });

  // Show message if no memories match the filter
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
  // Filter buttons
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Update active state
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // Apply filter
      currentFilter = button.getAttribute("data-filter");
      initializeGallery();
    });
  });

  // Lightbox controls
  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", () => navigateLightbox(-1));
  lightboxNext.addEventListener("click", () => navigateLightbox(1));

  // Close lightbox with escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("active")) {
      closeLightbox();
    }
  });

  // Modal controls
  addMemoryBtn.addEventListener("click", openAddMemoryModal);
  modalClose.addEventListener("click", closeAddMemoryModal);
  cancelAddMemory.addEventListener("click", closeAddMemoryModal);

  // Form submission
  addMemoryForm.addEventListener("submit", handleAddMemory);

  // File input preview
  fileInput.addEventListener("change", handleFilePreview);

  // Theme toggle
  themeToggle.addEventListener("click", toggleTheme);

  // Scroll event for navbar
  window.addEventListener("scroll", handleScroll);
}

// Open lightbox with the selected image
function openLightbox(index) {
  currentLightboxIndex = index;
  const memory = filteredMemories[index];

  lightboxImage.src = memory.image;
  lightboxTitle.textContent = memory.title;
  lightboxDescription.textContent = memory.description;
  lightboxDate.textContent = memory.date;
  lightboxCategory.textContent = memory.category;

  lightbox.classList.add("active");
  document.body.style.overflow = "hidden"; // Prevent scrolling
}

// Close the lightbox
function closeLightbox() {
  lightbox.classList.remove("active");
  document.body.style.overflow = ""; // Restore scrolling
}

// Navigate through images in the lightbox
function navigateLightbox(direction) {
  currentLightboxIndex =
    (currentLightboxIndex + direction + filteredMemories.length) %
    filteredMemories.length;
  openLightbox(currentLightboxIndex);
}

// Open the add memory modal
function openAddMemoryModal() {
  addMemoryModal.classList.add("active");
  document.body.style.overflow = "hidden"; // Prevent scrolling

  // Set default date to today
  document.getElementById("memoryDate").valueAsDate = new Date();
}

// Close the add memory modal
function closeAddMemoryModal() {
  addMemoryModal.classList.remove("active");
  addMemoryForm.reset();
  filePreview.innerHTML = "";
  document.body.style.overflow = ""; // Restore scrolling
}

// Handle file input preview
function handleFilePreview(e) {
  filePreview.innerHTML = "";
  const file = e.target.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      const previewItem = document.createElement("div");
      previewItem.className = "file-preview-item scale-in";
      previewItem.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
      filePreview.appendChild(previewItem);
    };
    reader.readAsDataURL(file);
  }
}

// Handle form submission for adding a new memory
function handleAddMemory(e) {
  e.preventDefault();

  // Get file
  const file = fileInput.files[0];

  if (!file) {
    showNotification("Please select an image", "error");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    // Create new memory object
    const newMemory = {
      id: Date.now(), // Use timestamp as ID
      title: document.getElementById("memoryTitle").value,
      description: document.getElementById("memoryDescription").value,
      date: new Date(
        document.getElementById("memoryDate").value
      ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      category: document.getElementById("memoryCategory").value,
      year: new Date(document.getElementById("memoryDate").value)
        .getFullYear()
        .toString(),
      image: event.target.result,
    };

    // Get existing memories from localStorage
    let savedMemories = JSON.parse(localStorage.getItem("memories") || "[]");

    // Add new memory
    savedMemories.unshift(newMemory);

    // Save to localStorage
    localStorage.setItem("memories", JSON.stringify(savedMemories));

    // Update memories array
    memories = [...savedMemories, ...defaultMemories];

    // Reset filter to show all
    currentFilter = "all";
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    document.querySelector('[data-filter="all"]').classList.add("active");

    // Refresh gallery
    initializeGallery();

    // Close modal
    closeAddMemoryModal();

    // Show success message
    showNotification("Memory added successfully!");
  };

  reader.readAsDataURL(file);
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

// Handle scroll events
function handleScroll() {
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
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  // Observe all sections
  document.querySelectorAll("section").forEach((section) => {
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
    background-color: var(--accent-primary);
    color: white;
    padding: 15px 20px;
    border-radius: var(--border-radius-md);
    box-shadow: var(--shadow-soft);
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
`;
document.head.appendChild(style);
