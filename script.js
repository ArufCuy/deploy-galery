// Photo data with expanded information
const photos = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538",
    title: "Mountain Landscape",
    author: "John Doe",
    likes: 243,
    liked: false,
    views: 1542,
    category: "landscape",
    date: "2025-03-15",
    inCollection: false,
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1682687220208-22d7a2543e88",
    title: "Ocean Sunset",
    author: "Jane Smith",
    likes: 187,
    liked: false,
    views: 1128,
    category: "landscape",
    date: "2025-03-12",
    inCollection: false,
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1682687220067-dced9a881b56",
    title: "Urban Architecture",
    author: "Alex Johnson",
    likes: 156,
    liked: false,
    views: 876,
    category: "urban",
    date: "2025-03-10",
    inCollection: false,
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1682687220923-c58b9a4592ea",
    title: "Forest Path",
    author: "Sarah Williams",
    likes: 321,
    liked: false,
    views: 2145,
    category: "nature",
    date: "2025-03-08",
    inCollection: false,
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1682687220945-922198770e60",
    title: "Desert Dunes",
    author: "Michael Brown",
    likes: 198,
    liked: false,
    views: 1432,
    category: "landscape",
    date: "2025-03-05",
    inCollection: false,
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538",
    title: "Snowy Mountains",
    author: "Emily Davis",
    likes: 275,
    liked: false,
    views: 1876,
    category: "landscape",
    date: "2025-03-02",
    inCollection: false,
  },
  {
    id: 7,
    url: "https://images.unsplash.com/photo-1682687221175-9129048e9663",
    title: "City Skyline",
    author: "David Wilson",
    likes: 210,
    liked: false,
    views: 1345,
    category: "urban",
    date: "2025-02-28",
    inCollection: false,
  },
  {
    id: 8,
    url: "https://images.unsplash.com/photo-1682687221080-5cb261c645cb",
    title: "Tropical Beach",
    author: "Olivia Martinez",
    likes: 289,
    liked: false,
    views: 1987,
    category: "landscape",
    date: "2025-02-25",
    inCollection: false,
  },
  {
    id: 9,
    url: "https://images.unsplash.com/photo-1682687220199-d0124f48f95b",
    title: "Autumn Forest",
    author: "Daniel Taylor",
    likes: 176,
    liked: false,
    views: 1234,
    category: "nature",
    date: "2025-02-22",
    inCollection: false,
  },
];

// Collections data
const collections = [
  { id: 1, name: "Favorites", count: 12 },
  { id: 2, name: "Landscapes", count: 8 },
  { id: 3, name: "Inspiration", count: 24 },
];

// DOM elements
const loader = document.getElementById("loader");
const mainContent = document.getElementById("main-content");
const photoGrid = document.getElementById("photo-grid");
const themeToggle = document.getElementById("theme-toggle");
const modal = document.getElementById("photo-modal");
const closeModal = document.getElementById("close-modal");
const modalImage = document.getElementById("modal-image");
const modalTitle = document.getElementById("modal-title");
const modalAuthor = document.getElementById("modal-author");
const modalCategory = document.getElementById("modal-category");
const modalLikes = document.getElementById("modal-likes");
const modalViews = document.getElementById("modal-views");
const modalLikeBtn = document.getElementById("modal-like");
const prevButton = document.getElementById("prev-photo");
const nextButton = document.getElementById("next-photo");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const filterSelect = document.getElementById("filter-select");
const gridViewBtn = document.getElementById("grid-view");
const listViewBtn = document.getElementById("list-view");
const noResults = document.getElementById("no-results");
const loadMoreBtn = document.getElementById("load-more");
const shareButton = document.getElementById("share-button");
const downloadButton = document.getElementById("download-button");
const addCollectionButton = document.getElementById("add-collection-button");
const shareModal = document.getElementById("share-modal");
const closeShareModal = document.getElementById("close-share");
const shareLink = document.getElementById("share-link");
const copyLinkBtn = document.getElementById("copy-link");
const collectionModal = document.getElementById("collection-modal");
const closeCollectionModal = document.getElementById("close-collection");
const saveToCollectionBtn = document.getElementById("save-to-collection");
const createCollectionBtn = document.getElementById("create-collection");
const newCollectionInput = document.getElementById("new-collection-name");
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toast-message");

// Current photo index for modal
let currentPhotoIndex = 0;
let currentFilter = "all";
let currentSearchTerm = "";
let currentView = "grid";
let visiblePhotos = 6; // Initial number of photos to show

// Simulate loading
setTimeout(() => {
  loader.style.display = "none";
  mainContent.style.display = "block";
  renderPhotos();
}, 2000);

// Filter photos based on current filter and search term
function getFilteredPhotos() {
  return photos.filter((photo) => {
    const matchesFilter =
      currentFilter === "all" || photo.category === currentFilter;
    const matchesSearch =
      currentSearchTerm === "" ||
      photo.title.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
      photo.author.toLowerCase().includes(currentSearchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });
}

// Render photos to grid
function renderPhotos() {
  const filteredPhotos = getFilteredPhotos();
  photoGrid.innerHTML = "";

  // Show/hide no results message
  if (filteredPhotos.length === 0) {
    noResults.style.display = "flex";
    loadMoreBtn.style.display = "none";
    return;
  } else {
    noResults.style.display = "none";
  }

  // Update grid view class
  if (currentView === "list") {
    photoGrid.classList.add("list-view");
  } else {
    photoGrid.classList.remove("list-view");
  }

  // Show only the number of photos specified by visiblePhotos
  const photosToShow = filteredPhotos.slice(0, visiblePhotos);

  photosToShow.forEach((photo, index) => {
    const photoCard = document.createElement("div");
    photoCard.className = "photo-card";
    photoCard.setAttribute("data-index", filteredPhotos.indexOf(photo));

    photoCard.innerHTML = `
        <div class="photo-img-container">
          <span class="photo-category">${photo.category}</span>
          <img src="${photo.url}?auto=format&fit=crop&w=800&q=80" alt="${
      photo.title
    }" class="photo-img">
        </div>
        <div class="photo-info">
          <h3 class="photo-title">${photo.title}</h3>
          <p class="photo-author">by ${photo.author}</p>
          <div class="photo-actions">
            <button class="like-button ${
              photo.liked ? "liked" : ""
            }" data-id="${photo.id}">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="${
                photo.liked ? "var(--heart)" : "none"
              }" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="heart-icon"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              <span>${photo.likes}</span>
            </button>
            <div class="action-icons">
              <button class="action-icon share-icon" data-id="${photo.id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
              </button>
              <button class="action-icon download-icon" data-id="${photo.id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              </button>
              <button class="action-icon save-icon" data-id="${photo.id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="${
                  photo.inCollection ? "currentColor" : "none"
                }" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
              </button>
            </div>
          </div>
        </div>
      `;

    photoGrid.appendChild(photoCard);
  });

  // Show/hide load more button
  if (filteredPhotos.length > visiblePhotos) {
    loadMoreBtn.style.display = "flex";
  } else {
    loadMoreBtn.style.display = "none";
  }

  // Add event listeners to like buttons
  document.querySelectorAll(".like-button").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = parseInt(button.getAttribute("data-id"));
      toggleLike(id);
    });
  });

  // Add event listeners to share buttons
  document.querySelectorAll(".share-icon").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = parseInt(button.getAttribute("data-id"));
      openShareModal(id);
    });
  });

  // Add event listeners to download buttons
  document.querySelectorAll(".download-icon").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = parseInt(button.getAttribute("data-id"));
      downloadPhoto(id);
    });
  });

  // Add event listeners to save buttons
  document.querySelectorAll(".save-icon").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = parseInt(button.getAttribute("data-id"));
      openCollectionModal(id);
    });
  });

  // Add event listeners to photo cards
  document.querySelectorAll(".photo-card").forEach((card) => {
    card.addEventListener("click", () => {
      const index = parseInt(card.getAttribute("data-index"));
      openModal(index);
    });
  });
}

// Toggle like status
function toggleLike(id) {
  const photoIndex = photos.findIndex((photo) => photo.id === id);
  if (photoIndex !== -1) {
    const photo = photos[photoIndex];
    photo.liked = !photo.liked;
    photo.likes = photo.liked ? photo.likes + 1 : photo.likes - 1;

    // Update UI
    renderPhotos();

    // Update modal if open
    if (modal.classList.contains("open")) {
      const filteredPhotos = getFilteredPhotos();
      if (filteredPhotos[currentPhotoIndex].id === id) {
        updateModalContent();
      }
    }

    // Show toast
    showToast(
      photo.liked
        ? "Photo added to your likes!"
        : "Photo removed from your likes"
    );
  }
}

// Open modal with photo
function openModal(index) {
  const filteredPhotos = getFilteredPhotos();
  currentPhotoIndex = index;
  updateModalContent();
  modal.classList.add("open");
  document.body.style.overflow = "hidden";

  // Increment view count
  const photo = filteredPhotos[currentPhotoIndex];
  photo.views++;
}

// Close modal
function closeModalHandler() {
  modal.classList.remove("open");
  document.body.style.overflow = "auto";
}

// Update modal content
function updateModalContent() {
  const filteredPhotos = getFilteredPhotos();
  const photo = filteredPhotos[currentPhotoIndex];

  modalImage.src = `${photo.url}?auto=format&fit=crop&w=1600&q=90`;
  modalImage.alt = photo.title;
  modalTitle.textContent = photo.title;
  modalAuthor.textContent = `by ${photo.author}`;
  modalCategory.textContent = photo.category;
  modalLikes.textContent = photo.likes;
  modalViews.textContent = photo.views;

  if (photo.liked) {
    modalLikeBtn.classList.add("liked");
    modalLikeBtn
      .querySelector(".heart-icon")
      .setAttribute("fill", "var(--heart)");
  } else {
    modalLikeBtn.classList.remove("liked");
    modalLikeBtn.querySelector(".heart-icon").setAttribute("fill", "none");
  }

  // Update share link
  shareLink.value = `https://darkshot.com/photos/${photo.id}`;
}

// Navigate to previous photo
function prevPhoto() {
  const filteredPhotos = getFilteredPhotos();
  currentPhotoIndex =
    (currentPhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
  updateModalContent();
}

// Navigate to next photo
function nextPhoto() {
  const filteredPhotos = getFilteredPhotos();
  currentPhotoIndex = (currentPhotoIndex + 1) % filteredPhotos.length;
  updateModalContent();
}

// Toggle theme
function toggleTheme() {
  const body = document.body;
  if (body.classList.contains("dark-mode")) {
    body.classList.remove("dark-mode");
    body.classList.add("light-mode");
    localStorage.setItem("theme", "light");
  } else {
    body.classList.remove("light-mode");
    body.classList.add("dark-mode");
    localStorage.setItem("theme", "dark");
  }
}

// Apply saved theme
function applySavedTheme() {
  const savedTheme = localStorage.getItem("theme");
  const body = document.body;

  if (savedTheme === "light") {
    body.classList.remove("dark-mode");
    body.classList.add("light-mode");
  } else {
    body.classList.remove("light-mode");
    body.classList.add("dark-mode");
  }
}

// Search photos
function searchPhotos() {
  currentSearchTerm = searchInput.value.trim();
  visiblePhotos = 6; // Reset visible photos count
  renderPhotos();
}

// Filter photos by category
function filterPhotos() {
  currentFilter = filterSelect.value;
  visiblePhotos = 6; // Reset visible photos count
  renderPhotos();
}

// Toggle view mode
function toggleView(mode) {
  currentView = mode;

  // Update active button
  if (mode === "grid") {
    gridViewBtn.classList.add("active");
    listViewBtn.classList.remove("active");
  } else {
    gridViewBtn.classList.remove("active");
    listViewBtn.classList.add("active");
  }

  renderPhotos();
}

// Load more photos
function loadMore() {
  visiblePhotos += 3;
  renderPhotos();
}

// Open share modal
function openShareModal(id) {
  const photo = photos.find((p) => p.id === id);
  if (photo) {
    shareLink.value = `https://darkshot.com/photos/${photo.id}`;
    shareModal.classList.add("open");
    document.body.style.overflow = "hidden";
  }
}

// Close share modal
function closeShareModalHandler() {
  shareModal.classList.remove("open");
  if (!modal.classList.contains("open")) {
    document.body.style.overflow = "auto";
  }
}

// Copy share link
function copyShareLink() {
  shareLink.select();
  document.execCommand("copy");
  showToast("Link copied to clipboard!");
}

// Open collection modal
function openCollectionModal(id) {
  const photo = photos.find((p) => p.id === id);
  if (photo) {
    // Reset checkboxes
    document
      .querySelectorAll(".collection-checkbox input")
      .forEach((checkbox) => {
        checkbox.checked = false;
      });

    collectionModal.classList.add("open");
    document.body.style.overflow = "hidden";

    // Store the photo id for later use
    collectionModal.setAttribute("data-photo-id", id);
  }
}

// Close collection modal
function closeCollectionModalHandler() {
  collectionModal.classList.remove("open");
  if (!modal.classList.contains("open")) {
    document.body.style.overflow = "auto";
  }
}

// Save to collection
function saveToCollection() {
  const photoId = parseInt(collectionModal.getAttribute("data-photo-id"));
  const photo = photos.find((p) => p.id === photoId);

  if (photo) {
    photo.inCollection = true;

    // Get selected collections
    const selectedCollections = [];
    document
      .querySelectorAll(".collection-checkbox input:checked")
      .forEach((checkbox) => {
        selectedCollections.push(checkbox.id.replace("collection-", ""));
      });

    closeCollectionModalHandler();
    showToast("Photo saved to collection!");
    renderPhotos();
  }
}

// Create new collection
function createNewCollection() {
  const collectionName = newCollectionInput.value.trim();

  if (collectionName) {
    // Add new collection
    const newId = collections.length + 1;
    collections.push({
      id: newId,
      name: collectionName,
      count: 0,
    });

    // Add new checkbox to the list
    const collectionsListEl = document.querySelector(".collections-list");
    const newCollectionItem = document.createElement("div");
    newCollectionItem.className = "collection-item";
    newCollectionItem.innerHTML = `
        <div class="collection-checkbox">
          <input type="checkbox" id="collection-${newId}" checked>
          <label for="collection-${newId}">${collectionName}</label>
        </div>
        <span class="collection-count">0 photos</span>
      `;

    collectionsListEl.appendChild(newCollectionItem);

    // Clear input
    newCollectionInput.value = "";

    showToast("New collection created!");
  }
}

// Download photo
function downloadPhoto(id) {
  const photo = photos.find((p) => p.id === id);
  if (photo) {
    // In a real app, this would trigger a download
    // For this demo, we'll just show a toast
    showToast("Photo download started!");
  }
}

// Show toast message
function showToast(message) {
  toastMessage.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// Apply saved theme on load
applySavedTheme();

// Event listeners
themeToggle.addEventListener("click", toggleTheme);
closeModal.addEventListener("click", closeModalHandler);
prevButton.addEventListener("click", prevPhoto);
nextButton.addEventListener("click", nextPhoto);
modalLikeBtn.addEventListener("click", () => {
  const filteredPhotos = getFilteredPhotos();
  toggleLike(filteredPhotos[currentPhotoIndex].id);
});
searchButton.addEventListener("click", searchPhotos);
searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    searchPhotos();
  }
});
filterSelect.addEventListener("change", filterPhotos);
gridViewBtn.addEventListener("click", () => toggleView("grid"));
listViewBtn.addEventListener("click", () => toggleView("list"));
loadMoreBtn.addEventListener("click", loadMore);
shareButton.addEventListener("click", () => {
  const filteredPhotos = getFilteredPhotos();
  openShareModal(filteredPhotos[currentPhotoIndex].id);
});
downloadButton.addEventListener("click", () => {
  const filteredPhotos = getFilteredPhotos();
  downloadPhoto(filteredPhotos[currentPhotoIndex].id);
});
addCollectionButton.addEventListener("click", () => {
  const filteredPhotos = getFilteredPhotos();
  openCollectionModal(filteredPhotos[currentPhotoIndex].id);
});
closeShareModal.addEventListener("click", closeShareModalHandler);
copyLinkBtn.addEventListener("click", copyShareLink);
closeCollectionModal.addEventListener("click", closeCollectionModalHandler);
saveToCollectionBtn.addEventListener("click", saveToCollection);
createCollectionBtn.addEventListener("click", createNewCollection);

// Share options functionality
document.querySelectorAll(".share-option").forEach((option) => {
  option.addEventListener("click", () => {
    const platform = option.querySelector("span").textContent;
    showToast(`Sharing to ${platform}...`);

    // In a real app, this would open the sharing functionality
    // For this demo, we'll just close the modal
    setTimeout(() => {
      closeShareModalHandler();
    }, 1000);
  });
});

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (modal.classList.contains("open")) {
    if (e.key === "Escape") {
      closeModalHandler();
    } else if (e.key === "ArrowLeft") {
      prevPhoto();
    } else if (e.key === "ArrowRight") {
      nextPhoto();
    }
  } else if (
    shareModal.classList.contains("open") ||
    collectionModal.classList.contains("open")
  ) {
    if (e.key === "Escape") {
      if (shareModal.classList.contains("open")) {
        closeShareModalHandler();
      } else {
        closeCollectionModalHandler();
      }
    }
  }
});
