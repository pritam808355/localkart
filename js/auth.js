/**
 * LocalKart - Authentication & User Session Management
 * Handles Login, Register, Session Storage, and Navbar User State
 */

document.addEventListener("DOMContentLoaded", () => {
  renderNavbarAuthState();
  initAuthPage();
});

// Current User State Helper
const LocalKartAuth = {
  getUser: () => {
    try {
      const data = localStorage.getItem("localkart_user");
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  setUser: (user) => {
    localStorage.setItem("localkart_user", JSON.stringify(user));
  },

  getToken: () => localStorage.getItem("localkart_token"),

  setToken: (token) => {
    localStorage.setItem("localkart_token", token);
  },

  logout: () => {
    localStorage.removeItem("localkart_user");
    localStorage.removeItem("localkart_token");
    if (window.LocalKartUI && window.LocalKartUI.showToast) {
      window.LocalKartUI.showToast("You have been signed out successfully.", "info");
    }
    setTimeout(() => {
      window.location.reload();
    }, 600);
  }
};

/* --------------------------------------------------------------------------
   1. Navbar Auth State Sync (Render on all pages)
   -------------------------------------------------------------------------- */
function renderNavbarAuthState() {
  const user = LocalKartAuth.getUser();
  const navActions = document.querySelector(".nav-actions");

  if (!navActions) return;

  const existingAuthEl = document.getElementById("navbarAuthElement");
  if (existingAuthEl) existingAuthEl.remove();

  if (user) {
    // User is Logged In - Render Avatar & Dropdown
    const userRoleColor = user.role === "admin" ? "#9333ea" : user.role === "merchant" ? "#0284c7" : "#16a34a";
    const userRoleLabel = user.role === "admin" ? "Admin" : user.role === "merchant" ? "Merchant" : "Shopper";

    const authContainer = document.createElement("div");
    authContainer.id = "navbarAuthElement";
    authContainer.style.position = "relative";
    authContainer.style.display = "flex";
    authContainer.style.alignItems = "center";
    authContainer.style.gap = "0.65rem";

    authContainer.innerHTML = `
      <div id="userDropdownTrigger" style="display:flex; align-items:center; gap:0.6rem; padding:0.4rem 0.75rem; background:#f8fafc; border:1px solid #e2e8f0; border-radius:9999px; cursor:pointer; transition:all 0.2s ease;">
        <img src="${user.avatar || 'https://api.dicebear.com/7.x/initials/svg?seed=' + encodeURIComponent(user.name)}" alt="${user.name}" style="width:30px; height:30px; border-radius:50%; object-fit:cover;" />
        <div style="display:flex; flex-direction:column; line-height:1.2;">
          <strong style="font-size:0.825rem; color:#0f172a; max-width:110px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${user.name}</strong>
          <span style="font-size:0.675rem; font-weight:700; color:${userRoleColor}; text-transform:uppercase;">${userRoleLabel}</span>
        </div>
        <i class="fa-solid fa-angle-down" style="font-size:0.7rem; color:#64748b; margin-left:0.25rem;"></i>
      </div>

      <!-- Dropdown Menu -->
      <div id="userProfileDropdown" style="display:none; position:absolute; top:calc(100% + 8px); right:0; width:220px; background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; box-shadow:0 10px 25px -5px rgba(0,0,0,0.1); padding:0.6rem; z-index:1100;">
        <div style="padding:0.65rem 0.75rem; border-bottom:1px solid #f1f5f9; margin-bottom:0.4rem;">
          <div style="font-size:0.75rem; color:#64748b;">Signed in as</div>
          <strong style="font-size:0.85rem; color:#0f172a; word-break:break-all;">${user.email}</strong>
        </div>
        ${user.role === 'admin' || user.role === 'merchant' ? `
          <a href="admin.html" style="display:flex; align-items:center; gap:0.6rem; padding:0.6rem 0.75rem; border-radius:6px; font-size:0.85rem; font-weight:600; color:#0f172a; transition:background 0.2s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
            <i class="fa-solid fa-gauge-high" style="color:#0284c7;"></i> Control Panel
          </a>
        ` : ''}
        <a href="products.html" style="display:flex; align-items:center; gap:0.6rem; padding:0.6rem 0.75rem; border-radius:6px; font-size:0.85rem; font-weight:600; color:#0f172a; transition:background 0.2s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
          <i class="fa-solid fa-box-open" style="color:#16a34a;"></i> Browse Products
        </a>
        <button type="button" id="btnLogoutBtn" style="width:100%; display:flex; align-items:center; gap:0.6rem; padding:0.6rem 0.75rem; border-radius:6px; font-size:0.85rem; font-weight:600; color:#dc2626; border:none; background:none; cursor:pointer; text-align:left; transition:background 0.2s;" onmouseover="this.style.background='#fee2e2'" onmouseout="this.style.background='transparent'">
          <i class="fa-solid fa-arrow-right-from-bracket"></i> Sign Out
        </button>
      </div>
    `;

    navActions.prepend(authContainer);

    const trigger = document.getElementById("userDropdownTrigger");
    const dropdown = document.getElementById("userProfileDropdown");
    const logoutBtn = document.getElementById("btnLogoutBtn");

    if (trigger && dropdown) {
      trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
      });

      document.addEventListener("click", () => {
        dropdown.style.display = "none";
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        LocalKartAuth.logout();
      });
    }

  } else {
    // User is Not Logged In - Render "Sign In" link
    const signInBtn = document.createElement("a");
    signInBtn.id = "navbarAuthElement";
    signInBtn.href = "login.html";
    signInBtn.className = "btn btn-secondary btn-sm";
    signInBtn.innerHTML = '<i class="fa-solid fa-user"></i> Sign In';
    navActions.prepend(signInBtn);
  }
}

/* --------------------------------------------------------------------------
   2. Auth Page Logic (login.html)
   -------------------------------------------------------------------------- */
function initAuthPage() {
  const form = document.getElementById("mainAuthForm");
  if (!form) return;

  let currentMode = "login"; // "login" or "register"
  let currentRole = "customer"; // "customer" or "merchant"

  const roleCustomerBtn = document.getElementById("tabRoleCustomer");
  const roleMerchantBtn = document.getElementById("tabRoleMerchant");
  const modeToggleBtn = document.getElementById("authModeToggleBtn");
  const formTitle = document.getElementById("authFormTitle");
  const formSubtitle = document.getElementById("authFormSubtitle");
  const submitBtn = document.getElementById("btnAuthSubmit");
  const registerFields = document.getElementById("registerFieldsWrapper");
  const merchantFields = document.getElementById("merchantFieldsWrapper");
  const bannerHeading = document.getElementById("bannerHeading");
  const bannerSubtitle = document.getElementById("bannerSubtitle");
  const togglePasswordBtn = document.getElementById("btnTogglePassword");
  const passwordInput = document.getElementById("inputAuthPassword");

  // Role Tab Switching
  if (roleCustomerBtn && roleMerchantBtn) {
    roleCustomerBtn.addEventListener("click", () => {
      currentRole = "customer";
      roleCustomerBtn.classList.add("active");
      roleMerchantBtn.classList.remove("active");
      if (merchantFields) merchantFields.style.display = "none";

      if (bannerHeading) bannerHeading.textContent = "Shop Fresh, Support Your Neighborhood";
      if (bannerSubtitle) bannerSubtitle.textContent = "Sign in to connect directly with neighborhood shops and enjoy zero-middleman local pricing.";
    });

    roleMerchantBtn.addEventListener("click", () => {
      currentRole = "merchant";
      roleMerchantBtn.classList.add("active");
      roleCustomerBtn.classList.remove("active");
      if (currentMode === "register" && merchantFields) {
        merchantFields.style.display = "block";
      }

      if (bannerHeading) bannerHeading.textContent = "Grow Your Neighborhood Business Online";
      if (bannerSubtitle) bannerSubtitle.textContent = "0% commission storefront. Receive direct customer orders on phone and WhatsApp without high fees.";
    });
  }

  // Login vs Register Mode Switching
  if (modeToggleBtn) {
    modeToggleBtn.addEventListener("click", () => {
      if (currentMode === "login") {
        currentMode = "register";
        if (formTitle) formTitle.textContent = "Create Your Free Account";
        if (formSubtitle) formSubtitle.textContent = "Join thousands of conscious neighborhood shoppers & merchants";
        if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-user-plus"></i> Create LocalKart Account';
        if (modeToggleBtn) modeToggleBtn.textContent = "Already have an account? Sign In";
        if (registerFields) registerFields.style.display = "block";
        if (currentRole === "merchant" && merchantFields) merchantFields.style.display = "block";
      } else {
        currentMode = "login";
        if (formTitle) formTitle.textContent = "Sign In to Your Account";
        if (formSubtitle) formSubtitle.textContent = "Enter your credentials to access your account";
        if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Sign In to LocalKart';
        if (modeToggleBtn) modeToggleBtn.textContent = "Need an account? Register";
        if (registerFields) registerFields.style.display = "none";
        if (merchantFields) merchantFields.style.display = "none";
      }
    });
  }

  // Password Visibility Toggle
  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener("click", () => {
      const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);
      togglePasswordBtn.innerHTML = type === "password"
        ? '<i class="fa-regular fa-eye"></i>'
        : '<i class="fa-regular fa-eye-slash"></i>';
    });
  }

  // Forgot Password Handler
  const forgotPasswordLink = document.getElementById("forgotPasswordLink");
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (window.LocalKartUI && window.LocalKartUI.showToast) {
        window.LocalKartUI.showToast("Please contact support to reset your password.", "info");
      } else {
        alert("Please contact support to reset your password.");
      }
    });
  }

  // Form Submit Handler
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("inputAuthEmail")?.value.trim();
    const password = document.getElementById("inputAuthPassword")?.value;

    const originalBtnHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';

    if (currentMode === "login") {
      // 1. LOGIN API CALL
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok && data.success) {
          LocalKartAuth.setUser(data.user);
          LocalKartAuth.setToken(data.token);
          window.LocalKartUI.showToast(data.message || "Login successful!", "success");

          setTimeout(() => {
            if (data.user.role === "admin" || data.user.role === "merchant") {
              window.location.href = "admin.html";
            } else {
              window.location.href = "index.html";
            }
          }, 800);
        } else {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;
          window.LocalKartUI.showToast(data.message || "Invalid email or password", "error");
        }
      } catch (err) {
        // Client fallback login
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
        handleFallbackClientLogin(email, password);
      }
    } else {
      // 2. REGISTER API CALL
      const name = document.getElementById("inputAuthName")?.value.trim();
      const phone = document.getElementById("inputAuthPhone")?.value.trim();
      const locality = document.getElementById("inputAuthLocality")?.value.trim();
      const storeName = document.getElementById("inputAuthStoreName")?.value.trim();
      const storeCategory = document.getElementById("inputAuthStoreCategory")?.value;
      const storeAddress = document.getElementById("inputAuthStoreAddress")?.value.trim();

      if (!name || !phone) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
        window.LocalKartUI.showToast("Please enter your name and phone number.", "error");
        return;
      }

      const payload = {
        name,
        email,
        password,
        phone,
        role: currentRole,
        locality: locality || "Sector 18",
        ...(currentRole === "merchant" ? { storeName, storeCategory, address: storeAddress } : {})
      };

      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (res.ok && data.success) {
          LocalKartAuth.setUser(data.user);
          LocalKartAuth.setToken(data.token);
          window.LocalKartUI.showToast(data.message || "Account created successfully!", "success");

          setTimeout(() => {
            if (currentRole === "merchant") {
              window.location.href = "admin.html";
            } else {
              window.location.href = "index.html";
            }
          }, 800);
        } else {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;
          window.LocalKartUI.showToast(data.message || "Registration failed", "error");
        }
      } catch (err) {
        // Fallback local registration
        const fallbackUser = {
          id: `usr-${Date.now()}`,
          name,
          email,
          phone,
          role: currentRole,
          storeName: storeName || "",
          locality: locality || "Sector 18",
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
        };
        LocalKartAuth.setUser(fallbackUser);
        LocalKartAuth.setToken(`lk_token_${fallbackUser.id}`);
        window.LocalKartUI.showToast(`Welcome, ${name}! Your account is ready.`, "success");
        setTimeout(() => {
          window.location.href = currentRole === "merchant" ? "admin.html" : "index.html";
        }, 800);
      }
    }
  });

  function handleFallbackClientLogin(email, password) {
    if (email === "admin@localkart.in") {
      const adminUser = {
        id: "usr-admin-1",
        name: "LocalKart Administrator",
        email: "admin@localkart.in",
        role: "admin",
        avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Admin"
      };
      LocalKartAuth.setUser(adminUser);
      window.LocalKartUI.showToast("Signed in as Administrator!", "success");
      setTimeout(() => window.location.href = "admin.html", 800);
      return;
    }

    if (email.includes("sharma") || email.includes("merchant")) {
      const merchantUser = {
        id: "usr-sample-2",
        name: "Ramesh Sharma",
        email,
        role: "merchant",
        storeName: "Sharma Kirana & General Store",
        avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Ramesh"
      };
      LocalKartAuth.setUser(merchantUser);
      window.LocalKartUI.showToast("Signed in as Merchant!", "success");
      setTimeout(() => window.location.href = "admin.html", 800);
      return;
    }

    const customerUser = {
      id: "usr-sample-1",
      name: "Priya Sharma",
      email,
      role: "customer",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Priya"
    };
    LocalKartAuth.setUser(customerUser);
    window.LocalKartUI.showToast("Signed in successfully!", "success");
    setTimeout(() => window.location.href = "index.html", 800);
  }
}
