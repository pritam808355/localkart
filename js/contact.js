/**
 * LocalKart - Contact & About Page Logic
 * Form validation, inquiry tabs, FAQ accordion expand/collapse
 */

document.addEventListener("DOMContentLoaded", () => {
  initContactForm();
  initFaqAccordion();
});

function initContactForm() {
  const form = document.getElementById("mainContactForm");
  const tabCustomer = document.getElementById("tabInquiryCustomer");
  const tabMerchant = document.getElementById("tabInquiryMerchant");
  const shopFields = document.getElementById("shopRegistrationFields");
  const formTitle = document.getElementById("contactFormTitle");

  // Tab switching
  if (tabCustomer && tabMerchant && shopFields) {
    tabCustomer.addEventListener("click", () => {
      tabCustomer.classList.add("btn-primary");
      tabCustomer.classList.remove("btn-secondary");
      tabMerchant.classList.add("btn-secondary");
      tabMerchant.classList.remove("btn-primary");
      shopFields.style.display = "none";
      if (formTitle) formTitle.textContent = "Send an Inquiry or Feedback";
    });

    tabMerchant.addEventListener("click", () => {
      tabMerchant.classList.add("btn-primary");
      tabMerchant.classList.remove("btn-secondary");
      tabCustomer.classList.add("btn-secondary");
      tabCustomer.classList.remove("btn-primary");
      shopFields.style.display = "block";
      if (formTitle) formTitle.textContent = "Register Your Local Store with LocalKart";
    });
  }

  // Form Submission
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("contactName")?.value.trim();
      const email = document.getElementById("contactEmail")?.value.trim();
      const phone = document.getElementById("contactPhone")?.value.trim();
      const message = document.getElementById("contactMessage")?.value.trim();
      const isMerchant = tabMerchant && tabMerchant.classList.contains("btn-primary");

      if (!name || !email || !phone) {
        window.LocalKartUI.showToast("Please fill in all required fields (Name, Email, Phone).", "error");
        return;
      }

      const submitBtn = form.querySelector("button[type='submit']");
      const origText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';

      // Send to MongoDB REST API
      if (isMerchant) {
        const storeName = document.getElementById("storeNameInput")?.value.trim() || name + "'s Local Shop";
        const category = document.getElementById("storeCategorySelect")?.value || "Grocery & Kirana";
        const address = document.getElementById("storePhysicalAddress")?.value.trim() || "Local Neighborhood";
        
        LocalKart.api.registerStore({
          name: storeName,
          category,
          address,
          phone,
          email,
          description: message
        }).finally(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = origText;
          form.reset();
          window.LocalKartUI.showToast(
            `Thank you ${name}! Your store "${storeName}" has been registered in the database. Our onboarding manager will call you at ${phone}.`,
            "success"
          );
        });
      } else {
        LocalKart.api.submitInquiry({
          customerName: name,
          customerPhone: phone,
          customerEmail: email,
          message,
          type: "customer_inquiry"
        }).finally(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = origText;
          form.reset();
          window.LocalKartUI.showToast(
            `Thank you ${name}! Your message has been sent to our database. We will reply to ${email} shortly.`,
            "success"
          );
        });
      }
    });
  }
}

function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const questionBtn = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    if (questionBtn && answer) {
      questionBtn.addEventListener("click", () => {
        const isOpen = item.classList.contains("active");

        // Close other items
        faqItems.forEach((other) => {
          other.classList.remove("active");
          const otherAns = other.querySelector(".faq-answer");
          if (otherAns) otherAns.style.maxHeight = null;
        });

        // Toggle clicked item
        if (!isOpen) {
          item.classList.add("active");
          answer.style.maxHeight = answer.scrollHeight + "px";
        }
      });
    }
  });
}
