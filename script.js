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

// Notion API Configuration
const NOTION_API_TOKEN = "ntn_XY3676093712hJHw7Jowo9m7VXH1OUYPanQ1OyNj6IOawp"; // Tokenmu
const NOTION_DATABASE_ID = "1a8015e9461b805685d9d04f38085571"; // Database ID-mu

// Current state
let currentFilter = "all";
let currentLightboxIndex = 0;
let filteredMemories = [];
let memories = [];
let isDarkTheme = true;

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(async () => {
    await loadMemoriesFromNotion(); // Ambil data dari Notion
    loadingScreen.classList.add("hidden");
    initializeGallery();
  }, 1500);

  initEventListeners();
  initScrollAnimations();

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") toggleTheme();
});

// Load memories from Notion
async function loadMemoriesFromNotion() {
  try {
    const response = await fetch(
      `https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${NOTION_API_TOKEN}`,
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Gagal ambil data dari Notion: ${response.status} - ${errorText}`
      );
    }

    const data = await response.json();
    memories = data.results.map((page) => ({
      id: page.id,
      title: page.properties.Title?.title[0]?.text.content || "Untitled",
      description:
        page.properties.Description?.rich_text[0]?.text.content || "",
      date: page.properties.Date?.date?.start || "Unknown Date",
      category: page.properties.Category?.multi_select?.map(
        (cat) => cat.name
      ) || ["uncategorized"],
      year: page.properties.Year?.rich_text[0]?.text.content || "Unknown Year",
      image:
        page.properties.Image?.files[0]?.file?.url ||
        page.properties.Image?.rich_text[0]?.text.content ||
        "https://via.placeholder.com/600x800?text=No+Image",
    }));

    filteredMemories = [...memories];
  } catch (error) {
    console.error("Error fetching from Notion:", error.message);
    showNotification(
      `Failed to load memories from Notion: ${error.message}`,
      "error"
    );
    memories = [];
    filteredMemories = [];
  }
}

// Initialize the gallery with photos
function initializeGallery() {
  galleryGrid.innerHTML = "";

  filteredMemories =
    currentFilter === "all"
      ? [...memories]
      : memories.filter(
          (memory) =>
            memory.category.includes(currentFilter) ||
            memory.year === currentFilter
        );

  filteredMemories.forEach((memory, index) => {
    const galleryItem = document.createElement("div");
    galleryItem.className = "gallery-item fade-in";
    galleryItem.style.animationDelay = `${index * 0.1}s`;

    galleryItem.innerHTML = `
      <img src="${memory.image}" alt="${
      memory.title
    }" loading="lazy" onerror="this.src='https://via.placeholder.com/600x800?text=Image+Not+Found';">
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
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      currentFilter = button.getAttribute("data-filter");
      initializeGallery();
    });
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", () => navigateLightbox(-1));
  lightboxNext.addEventListener("click", () => navigateLightbox(1));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("active"))
      closeLightbox();
  });

  addMemoryBtn.addEventListener("click", openAddMemoryModal);
  modalClose.addEventListener("click", closeAddMemoryModal);
  cancelAddMemory.addEventListener("click", closeAddMemoryModal);
  addMemoryForm.addEventListener("submit", handleAddMemory);
  fileInput.addEventListener("change", handleFilePreview);
  themeToggle.addEventListener("click", toggleTheme);
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
  lightboxCategory.textContent = memory.category.join(", ");

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
    (currentLightboxIndex + direction + filteredMemories.length) %
    filteredMemories.length;
  openLightbox(currentLightboxIndex);
}

// Open the add memory modal
function openAddMemoryModal() {
  addMemoryModal.classList.add("active");
  document.body.style.overflow = "hidden";
  document.getElementById("memoryDate").valueAsDate = new Date();
}

// Close the add memory modal
function closeAddMemoryModal() {
  addMemoryModal.classList.remove("active");
  addMemoryForm.reset();
  filePreview.innerHTML = "";
  document.body.style.overflow = "";
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

// Handle form submission for adding a new memory to Notion
async function handleAddMemory(e) {
  e.preventDefault();

  const file = fileInput.files[0];
  if (!file) {
    showNotification("Please select an image", "error");
    return;
  }

  const reader = new FileReader();
  reader.onload = async function (event) {
    const selectedCategories = Array.from(
      document.getElementById("memoryCategory").selectedOptions
    ).map((option) => option.value);

    const newMemory = {
      id: Date.now(),
      title: document.getElementById("memoryTitle").value || "Untitled",
      description: document.getElementById("memoryDescription").value || "",
      date:
        new Date(
          document.getElementById("memoryDate").value
        ).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }) || new Date().toLocaleDateString("en-US"),
      category:
        selectedCategories.length > 0 ? selectedCategories : ["uncategorized"],
      year:
        new Date(document.getElementById("memoryDate").value)
          .getFullYear()
          .toString() || new Date().getFullYear().toString(),
      image: event.target.result, // Base64 image
    };

    try {
      await saveToNotion(newMemory);
      showNotification("Memory added successfully!");
      closeAddMemoryModal();
      window.location.reload(); // Refresh halaman
    } catch (error) {
      console.error("Error saving to Notion:", error);
      showNotification("Failed to save memory to Notion", "error");
    }
  };

  reader.readAsDataURL(file);
}

// Save memory to Notion
async function saveToNotion(memory) {
  const response = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${NOTION_API_TOKEN}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
    body: JSON.stringify({
      parent: { database_id: NOTION_DATABASE_ID },
      properties: {
        Title: { title: [{ text: { content: memory.title } }] },
        Description: { rich_text: [{ text: { content: memory.description } }] },
        Date: { date: { start: memory.date } },
        Category: {
          multi_select: memory.category.map((cat) => ({ name: cat })),
        },
        Year: { rich_text: [{ text: { content: memory.year } }] },
        Image: {
          files: [
            { name: `${memory.title}.jpg`, external: { url: memory.image } },
          ],
        },
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error("Failed to save to Notion: " + errorText);
  }
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
`;
document.head.appendChild(style);
