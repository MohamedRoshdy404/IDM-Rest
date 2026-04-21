// === Performance Optimization & Utilities ===

// Toast Notification System
class NotificationSystem {
  static show(message, type = "success", duration = 3000) {
    const notification = document.getElementById("notification");
    if (!notification) return;

    notification.textContent = message;
    notification.className = `notification notification-${type} active`;
    notification.setAttribute("aria-hidden", "false");

    if (duration > 0) {
      setTimeout(() => this.hide(), duration);
    }
  }

  static hide() {
    const notification = document.getElementById("notification");
    if (notification) {
      notification.classList.remove("active");
      notification.setAttribute("aria-hidden", "true");
    }
  }

  static success(message, duration = 3000) {
    this.show(message, "success", duration);
  }

  static error(message, duration = 5000) {
    this.show(message, "error", duration);
  }

  static info(message, duration = 3000) {
    this.show(message, "info", duration);
  }
}

// Debounce Function for Performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Copy to Clipboard with Error Handling
async function copyKeyToClipboard(key) {
  try {
    if (!key || key.trim() === "") {
      throw new Error("لا يوجد مفتاح للنسخ");
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(key);
      NotificationSystem.success("تم نسخ المفتاح بنجاح! ✓");
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = key;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        const successful = document.execCommand("copy");
        if (successful) {
          NotificationSystem.success("تم نسخ المفتاح بنجاح! ✓");
        } else {
          throw new Error("فشل النسخ");
        }
      } finally {
        document.body.removeChild(textArea);
      }
      return true;
    }
  } catch (error) {
    console.error("Copy error:", error);
    NotificationSystem.error("فشل نسخ المفتاح. حاول مرة أخرى.");
    return false;
  }
}

// Load Keys from API
async function loadKey() {
  const keyCodeElement = document.getElementById("keyCode");
  const copyBtn = document.getElementById("copyBtn");

  if (!keyCodeElement) return;

  try {
    // Show loading state
    keyCodeElement.textContent = "جاري تحميل المفتاح...";
    keyCodeElement.setAttribute("aria-label", "جاري تحميل المفتاح");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch("/.netlify/functions/getKey", {
      signal: controller.signal,
      headers: {
        Accept: "text/plain",
        "Cache-Control": "no-cache",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const key = await response.text();

    if (!key || key.trim() === "") {
      throw new Error("تم استقبال مفتاح فارغ من الخادم");
    }

    // Update UI with key
    keyCodeElement.textContent = key;
    keyCodeElement.setAttribute("aria-label", `مفتاح الوصول: ${key}`);

    // Setup copy button
    if (copyBtn) {
      copyBtn.disabled = false;
      copyBtn.addEventListener("click", () => copyKeyToClipboard(key));
    }
  } catch (error) {
    console.error("Error loading key:", error);

    const errorMessage =
      error.name === "AbortError"
        ? "انتهت مهلة الانتظار. حاول مرة أخرى."
        : "حدث خطأ في تحميل المفتاح. تحقق من الاتصال بالإنترنت.";

    keyCodeElement.textContent = errorMessage;
    keyCodeElement.setAttribute("aria-label", errorMessage);

    if (copyBtn) {
      copyBtn.disabled = true;
    }

    NotificationSystem.error(errorMessage, 5000);
  }
}

// Initialize lightbox with better UX
function initLightbox() {
  const explanationImage = document.getElementById("explanation-image");
  if (!explanationImage) return;

  const overlay = document.createElement("div");
  overlay.className = "lightbox-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "عارض الصور المكبرة");

  const enlargedImage = document.createElement("img");
  enlargedImage.src = explanationImage.src;
  enlargedImage.alt = explanationImage.alt || "صورة البرنامج";
  enlargedImage.loading = "lazy";
  enlargedImage.decoding = "async";

  const closeButton = document.createElement("button");
  closeButton.className = "lightbox-close";
  closeButton.setAttribute("aria-label", "إغلاق عارض الصور");
  closeButton.innerHTML = '<i class="fas fa-times" aria-hidden="true"></i>';

  overlay.appendChild(enlargedImage);
  overlay.appendChild(closeButton);
  document.body.appendChild(overlay);

  // Open lightbox
  explanationImage.addEventListener("click", (e) => {
    e.preventDefault();
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  });

  explanationImage.addEventListener("keypress", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      overlay.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  });

  // Close lightbox
  const closeLightbox = () => {
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  };

  closeButton.addEventListener("click", closeLightbox);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closeLightbox();
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("active")) {
      closeLightbox();
    }
  });
}

// Update current year
function updateYear() {
  const yearElement = document.getElementById("current-year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// Performance: Check if API is available
function checkAPISupport() {
  const hasClipboard = !!navigator.clipboard;
  const hasAbortController = typeof AbortController !== "undefined";
  return { hasClipboard, hasAbortController };
}

// === Main Initialization ===
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

function init() {
  // Update year
  updateYear();

  // Initialize lightbox
  initLightbox();

  // Load keys if on keys page
  if (document.getElementById("keyCode")) {
    loadKey();
  }

  // Log browser capabilities for debugging
  const support = checkAPISupport();
  if (!support.hasClipboard) {
    console.warn("Clipboard API not available, using fallback");
  }
}
