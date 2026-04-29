const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const revealItems = document.querySelectorAll(".reveal");

// Mobile navigation: keep the menu state and accessibility label in sync.
if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");

    document.body.classList.toggle("nav-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      document.body.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open navigation");
    });
  });
}

// Smooth scrolling only affects same-page anchors; normal page links still load normally.
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const targetId = anchor.getAttribute("href");
    const target = targetId ? document.querySelector(targetId) : null;

    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// Reusable FAQ accordion used by the Shopify demo and SaaS concept pages.
document.querySelectorAll("[data-accordion]").forEach((accordion) => {
  accordion.querySelectorAll(".accordion-item button").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".accordion-item");
      const isOpen = button.getAttribute("aria-expanded") === "true";

      if (!item) {
        return;
      }

      item.classList.toggle("is-open", !isOpen);
      button.setAttribute("aria-expanded", String(!isOpen));
    });
  });
});

// Shopify-style product page demo interactions: gallery, variants, quantity, and feedback.
document.querySelectorAll("[data-product-gallery]").forEach((gallery) => {
  const mainImage = gallery.querySelector("[data-main-image]");
  const mainLabel = gallery.querySelector("[data-main-label]");
  const thumbs = gallery.querySelectorAll("[data-thumb]");
  const variants = gallery.querySelectorAll("[data-variant]");
  const quantityValue = gallery.querySelector("[data-quantity-value]");
  const quantityMinus = gallery.querySelector("[data-quantity-minus]");
  const quantityPlus = gallery.querySelector("[data-quantity-plus]");
  const cartForm = gallery.querySelector("[data-cart-form]");
  const cartFeedback = gallery.querySelector("[data-cart-feedback]");
  const buyNowButton = gallery.querySelector("[data-buy-now]");
  let quantity = 1;

  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      thumbs.forEach((item) => item.classList.remove("is-active"));
      thumb.classList.add("is-active");

      if (mainImage && thumb.dataset.gradient) {
        mainImage.style.background = thumb.dataset.gradient;
      }

      if (mainImage && thumb.dataset.tone) {
        mainImage.dataset.productTone = thumb.dataset.tone;
      }

      if (mainLabel && thumb.dataset.label) {
        mainLabel.textContent = thumb.dataset.label;
      }
    });
  });

  variants.forEach((variant) => {
    variant.addEventListener("click", () => {
      const variantName = variant.textContent.trim().toLowerCase();
      const matchingThumb = Array.from(thumbs).find((thumb) => {
        const thumbLabel = thumb.dataset.label ? thumb.dataset.label.toLowerCase() : "";

        return thumbLabel.includes(variantName);
      });

      variants.forEach((item) => item.classList.remove("is-selected"));
      variant.classList.add("is-selected");

      if (matchingThumb) {
        matchingThumb.click();
      }
    });
  });

  const updateQuantity = () => {
    if (quantityValue) {
      quantityValue.textContent = String(quantity);
    }
  };

  if (quantityMinus) {
    quantityMinus.addEventListener("click", () => {
      quantity = Math.max(1, quantity - 1);
      updateQuantity();
    });
  }

  if (quantityPlus) {
    quantityPlus.addEventListener("click", () => {
      quantity += 1;
      updateQuantity();
    });
  }

  if (cartForm) {
    cartForm.addEventListener("submit", (event) => {
      const selectedVariant = gallery.querySelector("[data-variant].is-selected");
      const variantName = selectedVariant ? selectedVariant.textContent.trim() : "selected variant";

      event.preventDefault();

      if (cartFeedback) {
        cartFeedback.textContent = `Added ${quantity} x ${variantName} to the demo cart.`;
      }
    });
  }

  if (buyNowButton) {
    buyNowButton.addEventListener("click", () => {
      const selectedVariant = gallery.querySelector("[data-variant].is-selected");
      const variantName = selectedVariant ? selectedVariant.textContent.trim() : "selected variant";

      if (cartFeedback) {
        cartFeedback.textContent = `Buy Now selected for ${variantName} in this static demo.`;
      }
    });
  }
});

// Lightweight CTA feedback for concept buttons that do not submit a real form.
document.querySelectorAll("[data-cta-feedback]").forEach((button) => {
  button.addEventListener("click", () => {
    const feedbackScope = button.closest("section") || document;
    const feedback = feedbackScope.querySelector("[data-global-feedback]") || document.querySelector("[data-global-feedback]");

    if (feedback) {
      feedback.textContent = button.dataset.ctaFeedback || "Demo action selected.";
    }
  });
});

// Reveal sections once on scroll so the pages feel polished without heavy libraries.
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
