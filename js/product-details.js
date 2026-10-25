/**
 * LocalKart - Product Details Page Logic
 * Interactive gallery, dynamic product loading, store info, inquiry handler
 */

document.addEventListener("DOMContentLoaded", async () => {
  if (window.LocalKart && window.LocalKart.api) {
    await LocalKart.api.initLiveSync();
  }
  initProductDetails();
});

function initProductDetails() {
  if (!window.LocalKart) return;

  // Read product ID from query parameter: ?id=prod-1
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id") || "prod-1";

  // Look up product or fallback to first product
  let product = LocalKart.getProductById(productId);
  if (!product) {
    product = LocalKart.getProducts()[0];
  }

  const store = LocalKart.getStoreById(product.storeId);

  // Update Breadcrumbs
  const breadcrumbCategory = document.getElementById("breadcrumbCategory");
  const breadcrumbProduct = document.getElementById("breadcrumbProduct");
  if (breadcrumbCategory) {
    breadcrumbCategory.textContent = product.category;
    breadcrumbCategory.href = `products.html?category=${product.categorySlug}`;
  }
  if (breadcrumbProduct) {
    breadcrumbProduct.textContent = product.name;
  }

  // Update Document Title
  document.title = `${product.name} | LocalKart`;

  // Render Image Gallery
  const previewImg = document.getElementById("detailMainPreview");
  const thumbnailStrip = document.getElementById("detailThumbnailStrip");

  if (previewImg && product.gallery && product.gallery.length > 0) {
    previewImg.src = product.gallery[0];
    previewImg.alt = product.name;

    if (thumbnailStrip) {
      thumbnailStrip.innerHTML = product.gallery
        .map((imgUrl, index) => `
          <button class="thumbnail-item ${index === 0 ? "active" : ""}" data-src="${imgUrl}" aria-label="View thumbnail ${index + 1}">
            <img src="${imgUrl}" alt="${product.name} thumb ${index + 1}" />
          </button>
        `)
        .join("");

      // Thumbnail Click Event
      const thumbs = thumbnailStrip.querySelectorAll(".thumbnail-item");
      thumbs.forEach((thumb) => {
        thumb.addEventListener("click", () => {
          thumbs.forEach(t => t.classList.remove("active"));
          thumb.classList.add("active");
          const targetSrc = thumb.dataset.src;
          previewImg.style.opacity = "0.4";
          setTimeout(() => {
            previewImg.src = targetSrc;
            previewImg.style.opacity = "1";
          }, 150);
        });
      });
    }
  }

  // Render Product Meta & Pricing
  const categoryBadge = document.getElementById("detailCategoryBadge");
  const discountBadge = document.getElementById("detailDiscountBadge");
  const titleEl = document.getElementById("detailTitle");
  const ratingStars = document.getElementById("detailRatingStars");
  const ratingText = document.getElementById("detailRatingText");
  const currentPrice = document.getElementById("detailCurrentPrice");
  const origPrice = document.getElementById("detailOrigPrice");
  const savingsAmount = document.getElementById("detailSavingsAmount");
  const descriptionEl = document.getElementById("detailDescription");

  if (categoryBadge) categoryBadge.textContent = product.category;
  if (discountBadge) discountBadge.textContent = product.discount;
  if (titleEl) titleEl.textContent = product.name;
  if (ratingStars) ratingStars.textContent = `${product.rating} ★`;
  if (ratingText) ratingText.textContent = `(${product.reviewsCount} customer reviews)`;
  if (currentPrice) currentPrice.textContent = `₹${product.price.toLocaleString("en-IN")}`;
  if (origPrice) origPrice.textContent = `₹${product.originalPrice.toLocaleString("en-IN")}`;
  if (savingsAmount) savingsAmount.textContent = `You Save ₹${(product.originalPrice - product.price).toLocaleString("en-IN")} (${product.discount})`;
  if (descriptionEl) descriptionEl.textContent = product.description;

  // Render Features Checklist
  const featuresList = document.getElementById("detailFeaturesList");
  if (featuresList && product.features) {
    featuresList.innerHTML = product.features
      .map(feat => `
        <li>
          <i class="fa-solid fa-circle-check"></i>
          <span>${feat}</span>
        </li>
      `)
      .join("");
  }

  // Render Specifications Table
  const specsTableBody = document.getElementById("detailSpecsTable");
  if (specsTableBody && product.specs) {
    specsTableBody.innerHTML = Object.entries(product.specs)
      .map(([key, val]) => `
        <tr>
          <th>${key}</th>
          <td>${val}</td>
        </tr>
      `)
      .join("");
  }

  // Render Store Highlight Card
  if (store) {
    const storeLogo = document.getElementById("detailStoreLogo");
    const storeName = document.getElementById("detailStoreName");
    const storeDistance = document.getElementById("detailStoreDistance");
    const storeAddress = document.getElementById("detailStoreAddress");
    const storeHours = document.getElementById("detailStoreHours");
    const contactStoreBtn = document.getElementById("detailContactStoreBtn");
    const visitStoreBtn = document.getElementById("detailVisitStoreBtn");

    if (storeLogo) storeLogo.src = store.logo;
    if (storeName) storeName.textContent = store.name;
    if (storeDistance) storeDistance.textContent = store.distance;
    if (storeAddress) storeAddress.textContent = store.address;
    if (storeHours) storeHours.textContent = `Open today: ${store.openingHours}`;

    if (contactStoreBtn) {
      contactStoreBtn.addEventListener("click", () => {
        window.LocalKartUI.openContactModalForStore(store.id, product.name);
      });
    }

    if (visitStoreBtn) {
      visitStoreBtn.href = `stores.html?storeId=${store.id}`;
    }
  }

  // Render Related Products (same category or popular)
  const relatedGrid = document.getElementById("detailRelatedProductsGrid");
  if (relatedGrid) {
    const related = LocalKart.getProducts()
      .filter(p => p.id !== product.id && (p.categorySlug === product.categorySlug || p.isPopular))
      .slice(0, 4);

    relatedGrid.innerHTML = related.map(p => LocalKartUI.renderProductCardHTML(p)).join("");
  }
}
