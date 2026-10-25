/**
 * LocalKart - Stores Directory Logic
 * Store search, category filter pills, dynamic cards rendering
 */

document.addEventListener("DOMContentLoaded", async () => {
  if (window.LocalKart && window.LocalKart.api) {
    await LocalKart.api.initLiveSync();
  }
  initStoresDirectory();
});

function initStoresDirectory() {
  const grid = document.getElementById("storesDirectoryGrid");
  const searchInput = document.getElementById("storesSearchInput");
  const countDisplay = document.getElementById("storesCountDisplay");
  const pillsContainer = document.getElementById("storesCategoryPills");

  if (!grid || !window.LocalKart) return;

  let currentCategory = "all";
  let searchQuery = "";

  // Check URL param ?storeId= or ?category=
  const urlParams = new URLSearchParams(window.location.search);
  const targetCategory = urlParams.get("category");
  const targetStoreId = urlParams.get("storeId");

  if (targetCategory) {
    currentCategory = targetCategory;
  }

  // Render Category Filter Pills
  if (pillsContainer) {
    const categories = [
      { id: "all", name: "All Neighborhood Stores" },
      { id: "Grocery & Kirana", name: "Grocery & Kirana" },
      { id: "Fruits & Vegetables", name: "Fruits & Vegetables" },
      { id: "Bakery & Sweets", name: "Bakery & Sweets" },
      { id: "Home & Handcrafted", name: "Home & Handcrafted" },
      { id: "Electronics & Mobile", name: "Electronics & Mobile" },
      { id: "Pharmacy & Wellness", name: "Pharmacy & Wellness" },
      { id: "Fashion & Tailoring", name: "Fashion & Tailoring" }
    ];

    pillsContainer.innerHTML = categories
      .map(
        (cat) => `
        <button class="stores-pill ${cat.id === currentCategory ? "active" : ""}" data-category="${cat.id}">
          ${cat.name}
        </button>
      `
      )
      .join("");

    const pills = pillsContainer.querySelectorAll(".stores-pill");
    pills.forEach((pill) => {
      pill.addEventListener("click", () => {
        pills.forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");
        currentCategory = pill.dataset.category;
        renderStores();
      });
    });
  }

  // Search Input Listener
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      renderStores();
    });
  }

  function renderStores() {
    let stores = LocalKart.getStores();

    // 1. Category Filter
    if (currentCategory !== "all") {
      stores = stores.filter((s) => s.category.toLowerCase() === currentCategory.toLowerCase());
    }

    // 2. Search Query
    if (searchQuery) {
      stores = stores.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery) ||
          s.locality.toLowerCase().includes(searchQuery) ||
          s.address.toLowerCase().includes(searchQuery) ||
          s.category.toLowerCase().includes(searchQuery) ||
          s.description.toLowerCase().includes(searchQuery)
      );
    }

    // Update Counter
    if (countDisplay) {
      countDisplay.textContent = stores.length;
    }

    if (stores.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">
            <i class="fa-solid fa-store-slash"></i>
          </div>
          <h3>No Local Stores Found</h3>
          <p>We couldn't find any registered store matching "${searchQuery}". Try broadening your search or choosing another category.</p>
        </div>
      `;
    } else {
      grid.innerHTML = stores.map((s) => LocalKartUI.renderStoreCardHTML(s)).join("");

      // If targeted storeId was in URL, scroll to it and highlight
      if (targetStoreId) {
        setTimeout(() => {
          const targetCard = document.querySelector(`.store-card[data-id="${targetStoreId}"]`);
          if (targetCard) {
            targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
            targetCard.style.outline = "3px solid #16a34a";
            targetCard.style.boxShadow = "0 10px 25px -5px rgba(22, 163, 74, 0.4)";
          }
        }, 200);
      }
    }
  }

  // Initial render
  renderStores();
}
