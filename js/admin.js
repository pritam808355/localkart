/**
 * LocalKart - Admin & Merchant Control Panel Logic
 * Full CRUD operations for Stores, Products, and Inquiries via REST APIs
 */

document.addEventListener("DOMContentLoaded", () => {
  initAdminTabs();
  loadAllAdminData();
  setupStoreModal();
  setupProductModal();
  setupSearchFilters();
});

// App Admin State
const AdminState = {
  stores: [],
  products: [],
  inquiries: [],
  categories: [],
  health: null,
  activeTab: "overview"
};

/* --------------------------------------------------------------------------
   1. Tab Navigation
   -------------------------------------------------------------------------- */
function initAdminTabs() {
  const navItems = document.querySelectorAll(".admin-nav-item");
  const tabPanes = document.querySelectorAll(".admin-tab-pane");
  const heading = document.getElementById("adminPageHeading");
  const mobileToggle = document.getElementById("adminMobileToggle");
  const sidebar = document.getElementById("adminSidebar");

  navItems.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetTab = btn.dataset.tab;
      AdminState.activeTab = targetTab;

      navItems.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      tabPanes.forEach((p) => p.classList.remove("active"));
      const activePane = document.getElementById(`tab-${targetTab}`);
      if (activePane) activePane.classList.add("active");

      if (heading) {
        const titles = {
          overview: "Marketplace Overview",
          stores: "Neighborhood Stores Management",
          products: "Product Inventory Management",
          inquiries: "Customer Inquiries & Leads",
          settings: "System & Database Settings"
        };
        heading.textContent = titles[targetTab] || "Admin Dashboard";
      }

      if (sidebar && sidebar.classList.contains("show-mobile")) {
        sidebar.classList.remove("show-mobile");
      }
    });
  });

  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener("click", () => {
      sidebar.classList.toggle("show-mobile");
    });
  }
}

/* --------------------------------------------------------------------------
   2. Data Fetching & Sync
   -------------------------------------------------------------------------- */
async function loadAllAdminData() {
  // 1. Initial fallback load from LocalKart data so UI is NEVER blank
  if (window.LocalKart) {
    if (!AdminState.stores || AdminState.stores.length === 0) {
      AdminState.stores = LocalKart.getStores() || [];
    }
    if (!AdminState.products || AdminState.products.length === 0) {
      AdminState.products = LocalKart.getProducts() || [];
    }
    if (!AdminState.categories || AdminState.categories.length === 0) {
      AdminState.categories = LocalKart.getCategories() || [];
    }
  }

  try {
    // 2. Fetch Health
    const healthRes = await fetch("/api/health");
    if (healthRes.ok) {
      AdminState.health = await healthRes.json();
      updateHealthUI(AdminState.health);
    }

    // 3. Fetch Stores
    const storesRes = await fetch("/api/stores");
    if (storesRes.ok) {
      const sData = await storesRes.json();
      if (sData.data && sData.data.length > 0) AdminState.stores = sData.data;
    }

    // 4. Fetch Products
    const prodRes = await fetch("/api/products");
    if (prodRes.ok) {
      const pData = await prodRes.json();
      if (pData.data && pData.data.length > 0) AdminState.products = pData.data;
    }

    // 5. Fetch Inquiries
    const inqRes = await fetch("/api/inquiries");
    if (inqRes.ok) {
      const iData = await inqRes.json();
      if (iData.data) AdminState.inquiries = iData.data;
    }

    // 6. Fetch Categories
    const catRes = await fetch("/api/categories");
    if (catRes.ok) {
      const cData = await catRes.json();
      if (cData.data && cData.data.length > 0) AdminState.categories = cData.data;
    }
  } catch (err) {
    console.warn("Backend API offline or unreachable, running in local database client mode");
  }

  // Render Views
  renderOverviewStats();
  renderStoresTable(AdminState.stores);
  renderProductsTable(AdminState.products);
  renderInquiriesTable(AdminState.inquiries);
  populateStoreSelectDropdown();
}

function updateHealthUI(health) {
  const pill = document.getElementById("dbStatusPill");
  const dot = document.getElementById("dbStatusDot");
  const text = document.getElementById("dbStatusText");

  if (!pill || !health) return;

  const isMongo = health.database && health.database.isConnectedToMongo;
  if (isMongo) {
    pill.style.backgroundColor = "#dcfce7";
    pill.style.color = "#15803d";
    pill.style.borderColor = "#86efac";
    if (dot) dot.style.backgroundColor = "#22c55e";
    if (text) text.textContent = "MongoDB Connected";
  } else {
    pill.style.backgroundColor = "#fef3c7";
    pill.style.color = "#92400e";
    pill.style.borderColor = "#fde68a";
    if (dot) dot.style.backgroundColor = "#f59e0b";
    if (text) text.textContent = "Hybrid Local Store (data/db.json)";
  }

  // Update Settings Tab Diagnostics
  const settingsStatus = document.getElementById("settingsDbStatus");
  if (settingsStatus) {
    settingsStatus.innerHTML = `
      <p><strong>Database Driver:</strong> ${health.database.driver}</p>
      <p><strong>MongoDB Active:</strong> ${isMongo ? "Yes ✅" : "No (Using data/db.json fallback) 📁"}</p>
      <p><strong>Total Stores:</strong> ${health.database.totalStores}</p>
      <p><strong>Total Products:</strong> ${health.database.totalProducts}</p>
      <p><strong>Total Inquiries:</strong> ${health.database.totalInquiries}</p>
    `;
  }
}

function renderOverviewStats() {
  const totalStores = document.getElementById("statTotalStores");
  const totalProducts = document.getElementById("statTotalProducts");
  const totalInquiries = document.getElementById("statTotalInquiries");
  const totalCategories = document.getElementById("statTotalCategories");

  if (totalStores) totalStores.textContent = AdminState.stores.length;
  if (totalProducts) totalProducts.textContent = AdminState.products.length;
  if (totalInquiries) totalInquiries.textContent = AdminState.inquiries.length;
  if (totalCategories) totalCategories.textContent = AdminState.categories.length;

  // Render recent inquiries snippet on overview
  const recentInqList = document.getElementById("overviewRecentInquiries");
  if (recentInqList) {
    if (AdminState.inquiries.length === 0) {
      recentInqList.innerHTML = `<tr><td colspan="4" style="text-align:center; color:#94a3b8; padding: 2rem;">No customer inquiries received yet.</td></tr>`;
    } else {
      recentInqList.innerHTML = AdminState.inquiries.slice(0, 5).map(inq => `
        <tr>
          <td><strong>${inq.customerName}</strong></td>
          <td>${inq.customerPhone}</td>
          <td><span style="display:inline-block; max-width:250px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${inq.message}</span></td>
          <td><span class="status-badge ${inq.status || 'new'}">${inq.status || 'new'}</span></td>
        </tr>
      `).join("");
    }
  }
}

/* --------------------------------------------------------------------------
   3. Stores Management
   -------------------------------------------------------------------------- */
function renderStoresTable(stores) {
  const tbody = document.getElementById("adminStoresTableBody");
  if (!tbody) return;

  if (stores.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#94a3b8; padding: 2.5rem;">No stores match your search.</td></tr>`;
    return;
  }

  tbody.innerHTML = stores.map(store => `
    <tr>
      <td>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <img src="${store.logo}" alt="${store.name}" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover; border: 1px solid #e2e8f0;" />
          <div>
            <strong style="color: #0f172a; display: block;">${store.name}</strong>
            <span style="font-size: 0.75rem; color: #64748b;">ID: ${store.id}</span>
          </div>
        </div>
      </td>
      <td><span class="badge badge-category">${store.category}</span></td>
      <td>${store.locality || store.address}</td>
      <td>
        <div><i class="fa-solid fa-phone" style="font-size: 0.75rem; color: #16a34a;"></i> ${store.phone}</div>
      </td>
      <td>
        <div style="display: flex; align-items: center; gap: 0.35rem; font-weight: 700; color: #92400e;">
          <i class="fa-solid fa-star" style="color: #f59e0b;"></i> ${store.rating} (${store.reviewsCount})
        </div>
      </td>
      <td>
        <button class="btn btn-sm ${store.isVerified ? 'btn-outline-primary' : 'btn-secondary'}" onclick="toggleStoreVerification('${store.id}')" title="Click to toggle verified badge">
          <i class="fa-solid ${store.isVerified ? 'fa-circle-check' : 'fa-circle-xmark'}"></i>
          ${store.isVerified ? 'Verified' : 'Unverified'}
        </button>
      </td>
      <td>
        <div class="action-btns-group">
          <button class="btn-icon-action" onclick="openEditStoreModal('${store.id}')" title="Edit Store">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="btn-icon-action danger" onclick="deleteStore('${store.id}')" title="Delete Store">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join("");
}

async function toggleStoreVerification(id) {
  const store = AdminState.stores.find(s => s.id === id);
  if (!store) return;

  const newStatus = !store.isVerified;
  try {
    const res = await fetch(`/api/stores/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isVerified: newStatus })
    });
    if (res.ok) {
      store.isVerified = newStatus;
      renderStoresTable(AdminState.stores);
      showToast(`Verification status updated for "${store.name}"`, "success");
    }
  } catch (err) {
    showToast("Failed to update store verification", "error");
  }
}

async function deleteStore(id) {
  const store = AdminState.stores.find(s => s.id === id);
  const name = store ? store.name : "this store";

  if (!confirm(`Are you sure you want to delete "${name}" from the database?`)) return;

  try {
    const res = await fetch(`/api/stores/${id}`, { method: "DELETE" });
    if (res.ok) {
      AdminState.stores = AdminState.stores.filter(s => s.id !== id);
      renderStoresTable(AdminState.stores);
      renderOverviewStats();
      populateStoreSelectDropdown();
      showToast(`Store "${name}" deleted successfully!`, "success");
    }
  } catch (err) {
    showToast("Failed to delete store", "error");
  }
}

function setupStoreModal() {
  const modal = document.getElementById("adminStoreModal");
  const form = document.getElementById("adminStoreForm");
  const openBtn = document.getElementById("btnOpenAddStoreModal");
  const closeBtn = document.getElementById("btnCloseStoreModal");

  if (!modal || !form) return;

  function closeModal() {
    modal.classList.remove("show");
    form.reset();
    document.getElementById("adminStoreModalTitle").textContent = "Add New Local Store";
    document.getElementById("storeEditId").value = "";
  }

  if (openBtn) {
    openBtn.addEventListener("click", () => {
      form.reset();
      document.getElementById("adminStoreModalTitle").textContent = "Add New Local Store";
      document.getElementById("storeEditId").value = "";
      modal.classList.add("show");
    });
  }

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const editId = document.getElementById("storeEditId").value;
    const name = document.getElementById("inputStoreName").value.trim();
    const category = document.getElementById("inputStoreCategory").value;
    const address = document.getElementById("inputStoreAddress").value.trim();
    const locality = document.getElementById("inputStoreLocality").value.trim();
    const phone = document.getElementById("inputStorePhone").value.trim();
    const hours = document.getElementById("inputStoreHours").value.trim();
    const desc = document.getElementById("inputStoreDesc").value.trim();
    const image = document.getElementById("inputStoreImage").value.trim();
    const logo = document.getElementById("inputStoreLogo").value.trim();

    const payload = {
      name,
      category,
      address,
      locality,
      phone,
      openingHours: hours || "9:00 AM - 9:00 PM",
      description: desc,
      ...(image ? { image } : {}),
      ...(logo ? { logo } : {})
    };

    try {
      if (editId) {
        // Update existing store
        const res = await fetch(`/api/stores/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          showToast(`Store "${name}" updated successfully!`, "success");
        }
      } else {
        // Create new store
        const res = await fetch("/api/stores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          showToast(`Store "${name}" registered successfully!`, "success");
        }
      }

      closeModal();
      await loadAllAdminData();
    } catch (err) {
      showToast("Operation failed", "error");
    }
  });
}

function openEditStoreModal(id) {
  const store = AdminState.stores.find(s => s.id === id);
  if (!store) return;

  document.getElementById("storeEditId").value = store.id;
  document.getElementById("adminStoreModalTitle").textContent = `Edit Store: ${store.name}`;
  document.getElementById("inputStoreName").value = store.name;
  document.getElementById("inputStoreCategory").value = store.category;
  document.getElementById("inputStoreAddress").value = store.address;
  document.getElementById("inputStoreLocality").value = store.locality || "";
  document.getElementById("inputStorePhone").value = store.phone;
  document.getElementById("inputStoreHours").value = store.openingHours || "";
  document.getElementById("inputStoreDesc").value = store.description;
  document.getElementById("inputStoreImage").value = store.image || "";
  document.getElementById("inputStoreLogo").value = store.logo || "";

  document.getElementById("adminStoreModal").classList.add("show");
}

/* --------------------------------------------------------------------------
   4. Products Inventory Management
   -------------------------------------------------------------------------- */
function renderProductsTable(products) {
  const tbody = document.getElementById("adminProductsTableBody");
  if (!tbody) return;

  if (products.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#94a3b8; padding: 2.5rem;">No products found matching filters.</td></tr>`;
    return;
  }

  tbody.innerHTML = products.map(p => `
    <tr>
      <td>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <img src="${p.image}" alt="${p.name}" style="width: 44px; height: 44px; border-radius: 8px; object-fit: cover; border: 1px solid #e2e8f0;" />
          <div>
            <strong style="color: #0f172a; display: block;">${p.name}</strong>
            <span style="font-size: 0.75rem; color: #64748b;">${p.category}</span>
          </div>
        </div>
      </td>
      <td><strong>${p.storeName}</strong></td>
      <td>
        <div>
          <strong style="color: #0f172a; font-size: 0.95rem;">₹${p.price.toLocaleString("en-IN")}</strong>
          <span style="font-size: 0.75rem; text-decoration: line-through; color: #94a3b8; margin-left: 0.35rem;">₹${p.originalPrice.toLocaleString("en-IN")}</span>
        </div>
      </td>
      <td><span class="badge badge-discount">${p.discount}</span></td>
      <td>
        <button class="btn btn-sm ${p.inStock ? 'btn-outline-primary' : 'btn-secondary'}" onclick="toggleProductStock('${p.id}')">
          <i class="fa-solid ${p.inStock ? 'fa-check' : 'fa-xmark'}"></i>
          ${p.inStock ? 'In Stock' : 'Out of Stock'}
        </button>
      </td>
      <td>
        <div class="action-btns-group">
          <button class="btn-icon-action" onclick="openEditProductModal('${p.id}')" title="Edit Product">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="btn-icon-action danger" onclick="deleteProduct('${p.id}')" title="Delete Product">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join("");
}

async function toggleProductStock(id) {
  const product = AdminState.products.find(p => p.id === id);
  if (!product) return;

  const newStock = !product.inStock;
  try {
    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inStock: newStock })
    });
    if (res.ok) {
      product.inStock = newStock;
      renderProductsTable(AdminState.products);
      showToast(`Stock status updated for "${product.name}"`, "success");
    }
  } catch (err) {
    showToast("Failed to update stock", "error");
  }
}

async function deleteProduct(id) {
  const product = AdminState.products.find(p => p.id === id);
  const name = product ? product.name : "this product";

  if (!confirm(`Are you sure you want to remove "${name}" from inventory?`)) return;

  try {
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      AdminState.products = AdminState.products.filter(p => p.id !== id);
      renderProductsTable(AdminState.products);
      renderOverviewStats();
      showToast(`Product "${name}" deleted successfully!`, "success");
    }
  } catch (err) {
    showToast("Failed to delete product", "error");
  }
}

function setupProductModal() {
  const modal = document.getElementById("adminProductModal");
  const form = document.getElementById("adminProductForm");
  const openBtn = document.getElementById("btnOpenAddProductModal");
  const closeBtn = document.getElementById("btnCloseProductModal");

  if (!modal || !form) return;

  function closeModal() {
    modal.classList.remove("show");
    form.reset();
    document.getElementById("adminProductModalTitle").textContent = "Add New Product to Inventory";
    document.getElementById("productEditId").value = "";
  }

  if (openBtn) {
    openBtn.addEventListener("click", () => {
      populateStoreSelectDropdown();
      form.reset();
      document.getElementById("adminProductModalTitle").textContent = "Add New Product to Inventory";
      document.getElementById("productEditId").value = "";
      modal.classList.add("show");
    });
  }

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const editId = document.getElementById("productEditId").value;
    const name = document.getElementById("inputProductName").value.trim();
    const storeId = document.getElementById("inputProductStore").value;
    const storeObj = (AdminState.stores || []).find(s => s.id === storeId) || (window.LocalKart ? LocalKart.getStoreById(storeId) : null);
    const storeName = storeObj ? storeObj.name : "Local Merchant";
    const category = document.getElementById("inputProductCategory").value;
    const categorySlug = document.getElementById("inputProductCategory").selectedOptions[0]?.dataset.slug || "all";
    const price = Number(document.getElementById("inputProductPrice").value);
    const originalPrice = Number(document.getElementById("inputProductOrigPrice").value) || price;
    const desc = document.getElementById("inputProductDesc").value.trim();
    const image = document.getElementById("inputProductImage").value.trim();

    const payload = {
      name,
      storeId,
      storeName,
      category,
      categorySlug,
      price,
      originalPrice,
      description: desc,
      ...(image ? { image } : {})
    };

    try {
      if (editId) {
        // Update product
        const res = await fetch(`/api/products/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          showToast(`Product "${name}" updated successfully!`, "success");
        } else {
          // Local update fallback
          const idx = AdminState.products.findIndex(p => p.id === editId);
          if (idx !== -1) {
            AdminState.products[idx] = { ...AdminState.products[idx], ...payload };
            renderProductsTable(AdminState.products);
          }
          showToast(`Product "${name}" updated!`, "success");
        }
      } else {
        // Create product
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          showToast(`Product "${name}" added to inventory!`, "success");
        } else {
          // Local create fallback
          const newLocalP = {
            id: `prod-${Date.now()}`,
            ...payload,
            discount: originalPrice > price ? `${Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF` : "Best Price",
            rating: 4.8,
            reviewsCount: 1,
            inStock: true,
            image: image || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
          };
          AdminState.products.unshift(newLocalP);
          if (window.LOCALKART_DATA) LOCALKART_DATA.products.unshift(newLocalP);
          renderProductsTable(AdminState.products);
          renderOverviewStats();
          showToast(`Product "${name}" added to inventory!`, "success");
        }
      }

      closeModal();
      await loadAllAdminData();
    } catch (err) {
      // Offline client fallback
      const newLocalP = {
        id: `prod-${Date.now()}`,
        ...payload,
        discount: originalPrice > price ? `${Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF` : "Best Price",
        rating: 4.8,
        reviewsCount: 1,
        inStock: true,
        image: image || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
      };
      AdminState.products.unshift(newLocalP);
      if (window.LOCALKART_DATA) LOCALKART_DATA.products.unshift(newLocalP);
      renderProductsTable(AdminState.products);
      renderOverviewStats();
      closeModal();
      showToast(`Product "${name}" added to inventory!`, "success");
    }
  });
}

function openEditProductModal(id) {
  populateStoreSelectDropdown();
  const p = AdminState.products.find(item => item.id === id);
  if (!p) return;

  document.getElementById("productEditId").value = p.id;
  document.getElementById("adminProductModalTitle").textContent = `Edit Product: ${p.name}`;
  document.getElementById("inputProductName").value = p.name;
  document.getElementById("inputProductStore").value = p.storeId;
  document.getElementById("inputProductCategory").value = p.category;
  document.getElementById("inputProductPrice").value = p.price;
  document.getElementById("inputProductOrigPrice").value = p.originalPrice;
  document.getElementById("inputProductDesc").value = p.description;
  document.getElementById("inputProductImage").value = p.image || "";

  document.getElementById("adminProductModal").classList.add("show");
}

function populateStoreSelectDropdown() {
  const select = document.getElementById("inputProductStore");
  if (!select) return;

  const storesList = (AdminState.stores && AdminState.stores.length > 0)
    ? AdminState.stores
    : (window.LocalKart ? LocalKart.getStores() : []);

  if (storesList && storesList.length > 0) {
    select.innerHTML = storesList.map(s => `
      <option value="${s.id}">${s.name} (${s.locality || 'Sector 18'})</option>
    `).join("");
  }
}

/* --------------------------------------------------------------------------
   5. Customer Inquiries & Leads Management
   -------------------------------------------------------------------------- */
function renderInquiriesTable(inquiries) {
  const tbody = document.getElementById("adminInquiriesTableBody");
  if (!tbody) return;

  if (inquiries.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#94a3b8; padding: 2.5rem;">No customer inquiries received yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = inquiries.map(inq => {
    const inqId = inq.id || inq._id;
    const cleanPhone = inq.customerPhone ? inq.customerPhone.replace(/[^0-9]/g, "") : "";
    const waText = encodeURIComponent(`Hello ${inq.customerName}, regarding your inquiry on LocalKart...`);
    const waLink = `https://wa.me/91${cleanPhone}?text=${waText}`;

    return `
      <tr>
        <td>
          <strong style="color: #0f172a; display: block;">${inq.customerName}</strong>
          <span style="font-size: 0.75rem; color: #64748b;">${inq.customerEmail || 'No email provided'}</span>
        </td>
        <td>
          <a href="tel:${cleanPhone}" style="color: #16a34a; font-weight: 600;">
            <i class="fa-solid fa-phone"></i> ${inq.customerPhone}
          </a>
        </td>
        <td>
          <div style="font-size: 0.825rem; color: #334155; line-height: 1.4; max-width: 320px;">
            ${inq.productName ? `<strong>Item:</strong> ${inq.productName}<br/>` : ''}
            ${inq.message}
          </div>
        </td>
        <td><span class="badge badge-category">${inq.storeName || 'General Marketplace'}</span></td>
        <td>
          <select class="form-control" style="padding: 0.35rem 0.65rem; font-size: 0.8rem; font-weight: 700; border-radius: 6px;" onchange="updateInquiryStatus('${inqId}', this.value)">
            <option value="new" ${inq.status === 'new' ? 'selected' : ''}>🟡 New Lead</option>
            <option value="contacted" ${inq.status === 'contacted' ? 'selected' : ''}>🔵 Contacted</option>
            <option value="completed" ${inq.status === 'completed' ? 'selected' : ''}>🟢 Completed</option>
          </select>
        </td>
        <td>
          <div class="action-btns-group">
            <a href="${waLink}" target="_blank" class="btn-icon-action success" title="Chat on WhatsApp">
              <i class="fa-brands fa-whatsapp"></i>
            </a>
            <button class="btn-icon-action danger" onclick="deleteInquiry('${inqId}')" title="Delete Inquiry">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

async function updateInquiryStatus(id, newStatus) {
  try {
    const res = await fetch(`/api/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    });
    if (res.ok) {
      showToast(`Inquiry status updated to "${newStatus}"`, "success");
      const inq = AdminState.inquiries.find(i => (i.id || i._id) === id);
      if (inq) inq.status = newStatus;
    }
  } catch (err) {
    showToast("Failed to update status", "error");
  }
}

async function deleteInquiry(id) {
  if (!confirm("Are you sure you want to delete this customer inquiry?")) return;

  try {
    const res = await fetch(`/api/inquiries/${id}`, { method: "DELETE" });
    if (res.ok) {
      AdminState.inquiries = AdminState.inquiries.filter(i => (i.id || i._id) !== id);
      renderInquiriesTable(AdminState.inquiries);
      renderOverviewStats();
      showToast("Inquiry deleted successfully!", "success");
    }
  } catch (err) {
    showToast("Failed to delete inquiry", "error");
  }
}

/* --------------------------------------------------------------------------
   6. Search & Filter Listeners
   -------------------------------------------------------------------------- */
function setupSearchFilters() {
  const storeSearch = document.getElementById("adminStoreSearchInput");
  if (storeSearch) {
    storeSearch.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      const filtered = AdminState.stores.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.locality.toLowerCase().includes(q)
      );
      renderStoresTable(filtered);
    });
  }

  const productSearch = document.getElementById("adminProductSearchInput");
  if (productSearch) {
    productSearch.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      const filtered = AdminState.products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.storeName.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
      renderProductsTable(filtered);
    });
  }

  // Export JSON Backup button
  const exportBtn = document.getElementById("btnExportDatabaseBackup");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const backupData = {
        exportedAt: new Date().toISOString(),
        stores: AdminState.stores,
        products: AdminState.products,
        categories: AdminState.categories,
        inquiries: AdminState.inquiries
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `localkart_db_backup_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      showToast("Database backup downloaded successfully!", "success");
    });
  }

  // Re-seed DB trigger
  const reseedBtn = document.getElementById("btnReseedDatabase");
  if (reseedBtn) {
    reseedBtn.addEventListener("click", () => {
      if (confirm("Reset and re-populate the sample neighborhood stores and products?")) {
        loadAllAdminData().then(() => {
          showToast("Database refreshed and reloaded!", "success");
        });
      }
    });
  }
}

// Global Toast helper
function showToast(msg, type = "info") {
  if (window.LocalKartUI && window.LocalKartUI.showToast) {
    window.LocalKartUI.showToast(msg, type);
  } else {
    alert(msg);
  }
}

// Make functions accessible globally
window.openEditStoreModal = openEditStoreModal;
window.deleteStore = deleteStore;
window.toggleStoreVerification = toggleStoreVerification;
window.openEditProductModal = openEditProductModal;
window.deleteProduct = deleteProduct;
window.toggleProductStock = toggleProductStock;
window.updateInquiryStatus = updateInquiryStatus;
window.deleteInquiry = deleteInquiry;
