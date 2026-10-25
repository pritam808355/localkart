/**
 * LocalKart - Local Business Marketplace
 * Main Common Scripts & UI Interactions
 */

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initLocationSelector();
  initContactStoreModal();
  highlightActiveNavLink();
  initHeroSearchForm();
});

/* --------------------------------------------------------------------------
   Mobile Navigation Drawer
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.getElementById("mobileToggleBtn");
  const drawer = document.getElementById("mobileNavDrawer");
  const overlay = document.getElementById("drawerOverlay");
  const closeBtn = document.getElementById("drawerCloseBtn");

  if (!toggleBtn || !drawer || !overlay) return;

  function openDrawer() {
    drawer.classList.add("open");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    drawer.classList.remove("open");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  toggleBtn.addEventListener("click", openDrawer);
  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
  overlay.addEventListener("click", closeDrawer);

  // Close when pressing Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer.classList.contains("open")) {
      closeDrawer();
    }
  });
}

/* --------------------------------------------------------------------------
   Location Selector Modal & Storage
   -------------------------------------------------------------------------- */
function initLocationSelector() {
  const locationBtn = document.getElementById("locationSelectBtn");
  const modal = document.getElementById("locationModal");
  const closeBtn = document.getElementById("closeLocationModal");
  const currentLocText = document.getElementById("currentLocationText");
  const localityPills = document.querySelectorAll(".locality-pill-select");
  const pincodeForm = document.getElementById("pincodeForm");

  // Load saved locality
  const savedLocation = localStorage.getItem("localkart_location") || "Sector 18, Central City";
  if (currentLocText) {
    currentLocText.textContent = savedLocation;
  }

  if (!locationBtn || !modal) return;

  function openModal() {
    modal.classList.add("show");
  }

  function closeModal() {
    modal.classList.remove("show");
  }

  locationBtn.addEventListener("click", openModal);
  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  localityPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const loc = pill.dataset.location;
      if (loc) {
        localStorage.setItem("localkart_location", loc);
        if (currentLocText) currentLocText.textContent = loc;
        showToast(`Delivering to ${loc}`, "success");
        closeModal();
      }
    });
  });

  if (pincodeForm) {
    pincodeForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const pincodeInput = document.getElementById("pincodeInput");
      if (pincodeInput && pincodeInput.value.trim().length >= 5) {
        const customLoc = `PIN ${pincodeInput.value.trim()}, Area`;
        localStorage.setItem("localkart_location", customLoc);
        if (currentLocText) currentLocText.textContent = customLoc;
        showToast(`Area set to PIN: ${pincodeInput.value.trim()}`, "success");
        closeModal();
      } else {
        showToast("Please enter a valid 6-digit Pincode", "error");
      }
    });
  }
}

/* --------------------------------------------------------------------------
   Global "Contact Store" Modal
   -------------------------------------------------------------------------- */
let activeStoreData = null;

function initContactStoreModal() {
  const modal = document.getElementById("contactStoreModal");
  const closeBtn = document.getElementById("closeContactStoreModal");
  const form = document.getElementById("directStoreInquiryForm");

  if (!modal) return;

  function closeModal() {
    modal.classList.remove("show");
  }

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const customerName = document.getElementById("modalInquirerName")?.value || "Customer";
      const customerPhone = document.getElementById("modalInquirerPhone")?.value || "";
      const message = document.getElementById("modalInquiryMessage")?.value || "";
      const storeName = activeStoreData ? activeStoreData.name : "the store";
      const storeId = activeStoreData ? activeStoreData.id : "";

      if (window.LocalKart && window.LocalKart.api) {
        LocalKart.api.submitInquiry({
          customerName,
          customerPhone,
          message,
          storeId,
          storeName,
          type: "product_inquiry"
        });
      }

      showToast(`Inquiry sent to ${storeName}! They will call you shortly at ${customerPhone}.`, "success");
      form.reset();
      closeModal();
    });
  }

  // Bind WhatsApp Direct action button
  const whatsappBtn = document.getElementById("modalStoreWhatsappBtn");
  if (whatsappBtn) {
    whatsappBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (!activeStoreData) return;
      const phone = activeStoreData.whatsapp || "919876543210";
      const defaultText = encodeURIComponent(`Hi ${activeStoreData.name}, I found your store on LocalKart and would like to inquire about your products.`);
      window.open(`https://wa.me/${phone}?text=${defaultText}`, "_blank");
    });
  }

  // Bind Direct Call action button
  const callBtn = document.getElementById("modalStoreCallBtn");
  if (callBtn) {
    callBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (!activeStoreData) return;
      window.location.href = `tel:${activeStoreData.phone.replace(/[^0-9+]/g, '')}`;
    });
  }
}

/**
 * Open contact store modal with prefilled store/product info
 */
function openContactModalForStore(storeId, productName = null) {
  const modal = document.getElementById("contactStoreModal");
  if (!modal || !window.LocalKart) return;

  const store = LocalKart.getStoreById(storeId);
  if (!store) return;

  activeStoreData = store;

  // Set modal elements
  const titleEl = document.getElementById("modalStoreTitle");
  const locEl = document.getElementById("modalStoreLocation");
  const hoursEl = document.getElementById("modalStoreHours");
  const logoEl = document.getElementById("modalStoreLogo");
  const msgInput = document.getElementById("modalInquiryMessage");

  if (titleEl) titleEl.textContent = store.name;
  if (locEl) locEl.textContent = `${store.address} (${store.distance})`;
  if (hoursEl) hoursEl.textContent = `Open today: ${store.openingHours}`;
  if (logoEl) logoEl.src = store.logo;

  if (msgInput) {
    if (productName) {
      msgInput.value = `Hi, I am interested in ordering/inquiring about "${productName}". Is this in stock for immediate local pickup or delivery?`;
    } else {
      msgInput.value = `Hello, I saw your business "${store.name}" on LocalKart. I would like to inquire about your current availability and home delivery options.`;
    }
  }

  modal.classList.add("show");
}

/* --------------------------------------------------------------------------
   Hero Search Redirect
   -------------------------------------------------------------------------- */
function initHeroSearchForm() {
  const heroForm = document.getElementById("heroSearchForm");
  if (!heroForm) return;

  heroForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const queryInput = document.getElementById("heroSearchQuery");
    const categorySelect = document.getElementById("heroCategorySelect");

    const query = queryInput ? queryInput.value.trim() : "";
    const category = categorySelect ? categorySelect.value : "all";

    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category && category !== "all") params.set("category", category);

    window.location.href = `products.html?${params.toString()}`;
  });
}

/* --------------------------------------------------------------------------
   Active Nav Link Highlighter
   -------------------------------------------------------------------------- */
function highlightActiveNavLink() {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const links = document.querySelectorAll(".nav-link");

  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPath || (currentPath === "" && href === "index.html")) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

/* --------------------------------------------------------------------------
   Toast Notification Service
   -------------------------------------------------------------------------- */
function showToast(message, type = "info") {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast-alert toast-${type}`;

  let icon = "fa-circle-check";
  if (type === "error") icon = "fa-circle-exclamation";
  if (type === "info") icon = "fa-circle-info";

  toast.innerHTML = `
    <i class="fa-solid ${icon}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(15px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4000);
}

/* --------------------------------------------------------------------------
   Shared Component Renderers (HTML Templates)
   -------------------------------------------------------------------------- */
/**
 * Render a single Product Card
 */
function renderProductCardHTML(p) {
  return `
    <article class="product-card" data-id="${p.id}" data-category="${p.categorySlug}">
      <div class="product-card-thumb">
        <a href="product-details.html?id=${p.id}" title="${p.name}">
          <img src="${p.image}" alt="${p.name}" class="product-card-img" loading="lazy" />
        </a>
        <div class="product-card-badges">
          <span class="badge badge-discount">${p.discount}</span>
          <span class="badge badge-category">${p.category}</span>
        </div>
      </div>
      <div class="product-card-content">
        <div class="product-store-meta">
          <a href="stores.html?storeId=${p.storeId}" class="product-store-link">
            <i class="fa-solid fa-store"></i> ${p.storeName}
          </a>
        </div>
        <a href="product-details.html?id=${p.id}">
          <h3 class="product-title" title="${p.name}">${p.name}</h3>
        </a>
        <div class="product-rating">
          <div class="stars">
            <i class="fa-solid fa-star"></i>
            <span>${p.rating}</span>
          </div>
          <span>(${p.reviewsCount} verified reviews)</span>
        </div>
        <div class="product-price-row">
          <span class="product-current-price">₹${p.price.toLocaleString("en-IN")}</span>
          <span class="product-orig-price">₹${p.originalPrice.toLocaleString("en-IN")}</span>
          <span class="product-savings-badge">Save ₹${(p.originalPrice - p.price).toLocaleString("en-IN")}</span>
        </div>
        <div class="product-card-action">
          <a href="product-details.html?id=${p.id}" class="btn btn-outline-primary btn-sm btn-full">
            <i class="fa-regular fa-eye"></i> View Product
          </a>
        </div>
      </div>
    </article>
  `;
}

/**
 * Render a single Store Card
 */
function renderStoreCardHTML(s) {
  const badgesHTML = s.badges
    ? s.badges.map((b) => `<span class="store-tag-pill"><i class="fa-solid fa-check"></i> ${b}</span>`).join("")
    : "";

  return `
    <article class="store-card" data-id="${s.id}">
      <div class="store-card-header">
        <img src="${s.image}" alt="${s.name}" class="store-card-cover" loading="lazy" />
        <div class="store-card-badges">
          <span class="badge badge-verified"><i class="fa-solid fa-circle-check"></i> Verified</span>
        </div>
      </div>
      <div class="store-card-body">
        <div class="store-logo-wrapper">
          <img src="${s.logo}" alt="${s.name} Logo" class="store-logo" />
        </div>
        <div class="store-title-meta">
          <h3 class="store-title">
            ${s.name}
            <i class="fa-solid fa-circle-check store-verified-icon" title="LocalKart Verified Store"></i>
          </h3>
          <div class="store-meta-pills">
            <span class="badge badge-category">${s.category}</span>
            <span class="store-rating-pill">
              <i class="fa-solid fa-star"></i> ${s.rating} (${s.reviewsCount})
            </span>
          </div>
        </div>
        <div class="store-location">
          <i class="fa-solid fa-location-dot"></i>
          <span>${s.address} • <strong>${s.distance}</strong></span>
        </div>
        <p class="store-description">${s.description}</p>
        <div class="store-card-tags">
          ${badgesHTML}
        </div>
        <div class="store-card-footer">
          <div class="store-hours-indicator">
            <span class="status-dot"></span>
            <span>Open: ${s.openingHours}</span>
          </div>
          <button type="button" class="btn btn-primary btn-sm" onclick="openContactModalForStore('${s.id}')">
            <i class="fa-regular fa-comment-dots"></i> View Store
          </button>
        </div>
      </div>
    </article>
  `;
}

// Export functions to window
window.LocalKartUI = {
  showToast,
  openContactModalForStore,
  renderProductCardHTML,
  renderStoreCardHTML
};
