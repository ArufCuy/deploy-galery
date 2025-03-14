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

function _0x5374(){const _0x3a80eb=['12210570MLFOlt','AIzaSyC-cA5m5vvM_D5YEytpDR_iMx6DXkW16L8','1278SFDnnA','1:231296372256:web:6ef0f8f938edb1a9fb3645','697251OYvZPB','10zYPYsQ','635xDYVuX','620719zZxKkq','4496XwsdSd','26324pkZsNV','upload-img-ff1b5.firebaseapp.com','450365BVxNum','231296372256','28049qzQinZ','upload-img-ff1b5.firebasestorage.app','19683xbSagt','upload-img-ff1b5'];_0x5374=function(){return _0x3a80eb;};return _0x5374();}function _0x37f1(_0x28e208,_0x45fffc){const _0x5374f5=_0x5374();return _0x37f1=function(_0x37f157,_0x3d344b){_0x37f157=_0x37f157-0xc1;let _0x396bda=_0x5374f5[_0x37f157];return _0x396bda;},_0x37f1(_0x28e208,_0x45fffc);}const _0x41eac7=_0x37f1;(function(_0x97aadc,_0x71d3d4){const _0x2c2542=_0x37f1,_0x443a0e=_0x97aadc();while(!![]){try{const _0x58efe7=-parseInt(_0x2c2542(0xc9))/0x1+parseInt(_0x2c2542(0xc3))/0x2*(parseInt(_0x2c2542(0xc2))/0x3)+-parseInt(_0x2c2542(0xc7))/0x4*(-parseInt(_0x2c2542(0xc4))/0x5)+-parseInt(_0x2c2542(0xd1))/0x6*(parseInt(_0x2c2542(0xcb))/0x7)+-parseInt(_0x2c2542(0xc6))/0x8*(parseInt(_0x2c2542(0xcd))/0x9)+parseInt(_0x2c2542(0xcf))/0xa+parseInt(_0x2c2542(0xc5))/0xb;if(_0x58efe7===_0x71d3d4)break;else _0x443a0e['push'](_0x443a0e['shift']());}catch(_0x4e2ea0){_0x443a0e['push'](_0x443a0e['shift']());}}}(_0x5374,0xb5408));const firebaseConfig={'apiKey':_0x41eac7(0xd0),'authDomain':_0x41eac7(0xc8),'projectId':_0x41eac7(0xce),'storageBucket':_0x41eac7(0xcc),'messagingSenderId':_0x41eac7(0xca),'appId':_0x41eac7(0xc1)};

// Deklarasi db di luar blok
let db;

// Pastikan Firebase ada sebelum inisialisasi
if (typeof firebase === "undefined") {
  console.error("Firebase SDK not loaded. Check script tags in HTML.");
} else {
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore(); // Inisialisasi db di sini
}

// Sample data for the gallery (sebagai fallback)
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
  console.log("App starting...");
  if (typeof firebase !== "undefined" && db) {
    loadMemoriesFromFirebase();
    setTimeout(() => {
      console.log("Hiding loading screen...");
      loadingScreen.classList.add("hidden");
      initializeGallery();
    }, 2000);
    initEventListeners();
    initScrollAnimations();
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      toggleTheme();
    }
  } else {
    console.error("Firebase not available, loading default memories...");
    memories = [...defaultMemories];
    filteredMemories = [...memories];
    setTimeout(() => {
      loadingScreen.classList.add("hidden");
      initializeGallery();
    }, 2000);
    initEventListeners();
    initScrollAnimations();
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      toggleTheme();
    }
  }
});

// Load memories from Firebase with real-time listener
function loadMemoriesFromFirebase() {
  console.log("Loading memories from Firebase...");
  db.collection("memories")
    .orderBy("id", "desc")
    .onSnapshot(
      (snapshot) => {
        console.log("Snapshot received:", snapshot.docs.length, "items");
        memories = snapshot.docs.map((doc) => doc.data());
        if (memories.length === 0) {
          console.log("No data in Firebase, using default memories...");
          memories = [...defaultMemories];
        }
        filteredMemories = [...memories];
        initializeGallery();
      },
      (error) => {
        console.error("Error loading memories from Firebase:", error);
        memories = [...defaultMemories];
        filteredMemories = [...memories];
        initializeGallery();
        showNotification(
          "Failed to connect to Firebase, using default data",
          "error"
        );
      }
    );
}

// Initialize the gallery with photos
function initializeGallery() {
  console.log("Initializing gallery with", filteredMemories.length, "items");
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
      <img src="${memory.image}" alt="${memory.title}" loading="lazy">
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
    if (e.key === "Escape" && lightbox.classList.contains("active")) {
      closeLightbox();
    }
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

// Upload image to Imgur
async function uploadToImgur(file) {
  const clientID = "89fb5d88289de64";
  const formData = new FormData();
  formData.append("image", file);
  formData.append("type", "file");
  formData.append("title", document.getElementById("memoryTitle").value);
  formData.append(
    "description",
    document.getElementById("memoryDescription").value
  );

  try {
    const response = await fetch("https://api.imgur.com/3/image", {
      method: "POST",
      headers: {
        Authorization: `Client-ID ${clientID}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (data.success) {
      return data.data.link;
    } else {
      throw new Error("Upload failed: " + data.data.error);
    }
  } catch (error) {
    console.error("Error uploading to Imgur:", error);
    showNotification("Failed to upload image to Imgur", "error");
    return null;
  }
}

// Handle form submission for adding a new memory
async function handleAddMemory(e) {
  e.preventDefault();

  const file = fileInput.files[0];
  if (!file) {
    showNotification("Please select an image", "error");
    return;
  }

  const imageUrl = await uploadToImgur(file);
  if (!imageUrl) {
    return;
  }

  const newMemory = {
    id: Date.now(),
    title: document.getElementById("memoryTitle").value,
    description: document.getElementById("memoryDescription").value,
    date: new Date(
      document.getElementById("memoryDate").value
    ).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    category: [document.getElementById("memoryCategory").value],
    year: new Date(document.getElementById("memoryDate").value)
      .getFullYear()
      .toString(),
    image: imageUrl,
  };

  if (typeof firebase !== "undefined" && db) {
    try {
      console.log("Saving new memory to Firebase:", newMemory);
      await db
        .collection("memories")
        .doc(newMemory.id.toString())
        .set(newMemory);
      closeAddMemoryModal();
      showNotification("Memory added successfully!");
    } catch (error) {
      console.error("Error saving to Firebase:", error);
      showNotification("Failed to save memory", "error");
    }
  } else {
    console.error("Firebase not available, cannot save memory.");
    showNotification("Cannot save memory, Firebase not loaded", "error");
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
    notification.className += " fade-out";
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
    background-color: var(--accent-primary, #4CAF50);
    color: white;
    padding: 15px 20px;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
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
  .gallery-item {
    position: relative;
  }
  .gallery-item-overlay {
    position: absolute;
    bottom: 0;
    background: rgba(0,0,0,0.7);
    color: white;
    width: 100%;
    padding: 5px;
  }
  .fade-in {
    opacity: 0;
    animation: fadeIn 0.5s forwards;
  }
  @keyframes fadeIn {
    to { opacity: 1; }
  }
  .hidden {
    opacity: 0;
  }
`;
document.head.appendChild(style);
