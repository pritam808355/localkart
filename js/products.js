/**
 * LocalKart - Products Catalog Logic
 * Live client-side filtering, sorting, price range, category filter
 */

document.addEventListener("DOMContentLoaded", async () => {
  if (window.LocalKart && window.LocalKart.api) {
    await LocalKart.api.initLiveSync();
  }
  initProductsCatalog();
});

function initProductsCatalog() {
  const container = document.getElementById("productsCatalogGrid");
  const countDisplay = document.getElementById("catalogProductCount");
  const searchInput = document.getElementById("catalogSearchInput");
  const priceSlider = document.getElementById("catalogPriceSlider");
  const priceDisplay = document.getElementById("catalogPriceDisplay");
  const sortSelect = document.getElementById("catalogSortSelect");
  const categoryRadios = document.querySelectorAll("input[name='productCategoryFilter']");
  const resetBtn = document.getElementById("resetFiltersBtn");
  const mobileToggleBtn = document.getElementById("toggleFilterMobileBtn");
  const filterSidebar = document.getElementById("filtersSidebar");

  if (!container || !window.LocalKart) return;

  // Filter state
  const state = {
    search: "",
    category: "all",
    maxPrice: 2000,
    sortBy: "featured"
  };

  // Parse URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const initialQuery = urlParams.get("q");
  const initialCategory = urlParams.get("category");

  if (initialQuery) {
    state.search = initialQuery;
    if (searchInput) searchInput.value = initialQuery;
  }

  if (initialCategory) {
    state.category = initialCategory;
    categoryRadios.forEach(radio => {
      if (radio.value === initialCategory) {
        radio.checked = true;
        updateActiveCategoryLabel(radio);
      }
    });
  }

  // Mobile Filter Sidebar Toggle
  if (mobileToggleBtn && filterSidebar) {
    mobileToggleBtn.addEventListener("click", () => {
      filterSidebar.classList.toggle("show-mobile");
      mobileToggleBtn.innerHTML = filterSidebar.classList.contains("show-mobile")
        ? '<i class="fa-solid fa-xmark"></i> Hide Filters'
        : '<i class="fa-solid fa-filter"></i> Filters';
    });
  }

  // Event Listeners
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      state.search = e.target.value.trim().toLowerCase();
      renderFilteredProducts();
    });
  }

  if (priceSlider) {
    priceSlider.addEventListener("input", (e) => {
      state.maxPrice = Number(e.target.value);
      if (priceDisplay) priceDisplay.textContent = `₹${state.maxPrice.toLocaleString("en-IN")}`;
      renderFilteredProducts();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      state.sortBy = e.target.value;
      renderFilteredProducts();
    });
  }

  categoryRadios.forEach(radio => {
    radio.addEventListener("change", (e) => {
      state.category = e.target.value;
      updateActiveCategoryLabel(e.target);
      renderFilteredProducts();
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      state.search = "";
      state.category = "all";
      state.maxPrice = 2000;
      state.sortBy = "featured";

      if (searchInput) searchInput.value = "";
      if (priceSlider) {
        priceSlider.value = 2000;
        if (priceDisplay) priceDisplay.textContent = "₹2,000";
      }
      if (sortSelect) sortSelect.value = "featured";

      categoryRadios.forEach(r => {
        if (r.value === "all") {
          r.checked = true;
          updateActiveCategoryLabel(r);
        } else {
          r.checked = false;
        }
      });

      renderFilteredProducts();
      window.LocalKartUI.showToast("All filters have been reset", "info");
    });
  }

  function updateActiveCategoryLabel(activeRadio) {
    document.querySelectorAll(".category-radio-label").forEach(label => {
      label.classList.remove("active");
    });
    if (activeRadio.closest(".category-radio-label")) {
      activeRadio.closest(".category-radio-label").classList.add("active");
    }
  }

  function renderFilteredProducts() {
    let list = LocalKart.getProducts();

    // 1. Category Filter
    if (state.category !== "all") {
      list = list.filter(p => p.categorySlug === state.category);
    }

    // 2. Search Text
    if (state.search) {
      list = list.filter(p =>
        p.name.toLowerCase().includes(state.search) ||
        p.storeName.toLowerCase().includes(state.search) ||
        p.category.toLowerCase().includes(state.search) ||
        p.description.toLowerCase().includes(state.search)
      );
    }

    // 3. Price Filter
    list = list.filter(p => p.price <= state.maxPrice);

    // 4. Sort
    if (state.sortBy === "price-low") {
      list.sort((a, b) => a.price - b.price);
    } else if (state.sortBy === "price-high") {
      list.sort((a, b) => b.price - a.price);
    } else if (state.sortBy === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    } else if (state.sortBy === "discount") {
      list.sort((a, b) => b.discountNum - a.discountNum);
    } else {
      // Featured: default ordering
      list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    // Update Counter
    if (countDisplay) {
      countDisplay.textContent = list.length;
    }

    // Render cards
    if (list.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <i class="fa-solid fa-magnifying-glass"></i>
          </div>
          <h3>No Local Products Found</h3>
          <p>We couldn't find any products matching your current filters. Try searching with different keywords or reset your filters.</p>
          <button type="button" class="btn btn-primary btn-sm" id="emptyStateResetBtn">
            <i class="fa-solid fa-rotate-left"></i> Reset All Filters
          </button>
        </div>
      `;
      const emptyReset = document.getElementById("emptyStateResetBtn");
      if (emptyReset && resetBtn) {
        emptyReset.addEventListener("click", () => resetBtn.click());
      }
    } else {
      container.innerHTML = list.map(p => LocalKartUI.renderProductCardHTML(p)).join("");
    }
  }

  // Initial render
  renderFilteredProducts();
}
