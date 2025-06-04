// PawTrack Production JavaScript - iOS Safari Compatible

// Global variables
let countdownTimer = null;
let countdownElements = {};

/**
 * Initialize countdown timer - iOS Safari Compatible
 */
function initializeCountdown() {
  try {
    // Cache DOM elements
    countdownElements = {
      days: document.getElementById("days"),
      hours: document.getElementById("hours"),
      minutes: document.getElementById("minutes"),
      seconds: document.getElementById("seconds"),
    };

    // Check if elements exist
    const missingElements = Object.keys(countdownElements).filter(
      (key) => !countdownElements[key]
    );
    if (missingElements.length > 0) {
      console.error("Missing countdown elements:", missingElements);
      return;
    }

    // Create launch date - iOS Safari compatible
    let launchDate = new Date(2025, 10, 22, 10, 0, 0, 0); // November 22, 2025 10:00 AM

    // Fallback if date creation fails
    if (isNaN(launchDate.getTime())) {
      launchDate = new Date();
      launchDate.setFullYear(2025, 10, 22);
      launchDate.setHours(10, 0, 0, 0);
    }

    // Final validation
    if (isNaN(launchDate.getTime())) {
      setDefaultCountdown();
      return;
    }

    function updateCountdown() {
      try {
        const now = Date.now();
        const distance = launchDate.getTime() - now;

        if (distance > 0) {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor(
            (distance % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);

          updateCountdownDisplay("days", days);
          updateCountdownDisplay("hours", hours);
          updateCountdownDisplay("minutes", minutes);
          updateCountdownDisplay("seconds", seconds);
        } else {
          if (countdownTimer) {
            clearInterval(countdownTimer);
            countdownTimer = null;
          }
          setDefaultCountdown();
        }
      } catch (error) {
        console.error("Error updating countdown:", error);
        setDefaultCountdown();
      }
    }

    function updateCountdownDisplay(elementId, value) {
      const element = countdownElements[elementId];
      if (element) {
        const numValue = Math.max(0, Math.floor(Number(value)) || 0);
        element.textContent = numValue.toString().padStart(2, "0");
      }
    }

    function setDefaultCountdown() {
      Object.keys(countdownElements).forEach((key) => {
        if (countdownElements[key]) {
          countdownElements[key].textContent = "00";
        }
      });
    }

    // Clear existing timer
    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }

    // Start countdown
    updateCountdown();
    countdownTimer = setInterval(updateCountdown, 1000);

    // iOS Safari visibility handling
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden && countdownTimer) {
        updateCountdown();
      }
    });

    window.addEventListener("focus", function () {
      if (countdownTimer) {
        updateCountdown();
      }
    });
  } catch (error) {
    console.error("Error initializing countdown:", error);
    ["days", "hours", "minutes", "seconds"].forEach((id) => {
      const element = document.getElementById(id);
      if (element) element.textContent = "00";
    });
  }
}

/**
 * Initialize MDB components
 */
function initializeMDBComponents() {
  try {
    // Initialize Input components
    document.querySelectorAll("[data-mdb-input-init]").forEach((element) => {
      if (typeof mdb !== "undefined" && mdb.Input) {
        new mdb.Input(element);
      }
    });

    // Initialize Ripple effects
    document.querySelectorAll("[data-mdb-ripple-init]").forEach((element) => {
      if (typeof mdb !== "undefined" && mdb.Ripple) {
        new mdb.Ripple(element);
      }
    });

    // Initialize Alert components
    document.querySelectorAll("[data-mdb-alert-init]").forEach((element) => {
      if (typeof mdb !== "undefined" && mdb.Alert) {
        new mdb.Alert(element);
      }
    });

    // Initialize Modal components
    document.querySelectorAll(".modal").forEach((element) => {
      if (typeof mdb !== "undefined" && mdb.Modal) {
        new mdb.Modal(element);
      }
    });

    console.log("MDB Components initialized successfully");
  } catch (error) {
    console.warn("Error initializing MDB components:", error);
  }
}

/**
 * Initialize cookie consent functionality with Google Analytics integration
 */
function initializeCookieConsent() {
  const CONSENT_KEY = "pawtrack_cookie_consent";
  const cookieBanner = document.getElementById("cookieConsent");
  const acceptBtn = document.getElementById("acceptCookiesBtn");
  const declineBtn = document.getElementById("declineCookiesBtn");
  const closeBtn = document.getElementById("closeCookiesBtn");

  if (!cookieBanner || !acceptBtn) return;

  // Check existing consent status
  const consentStatus = localStorage.getItem(CONSENT_KEY);

  // Initialize Google Analytics based on consent
  if (consentStatus === "true") {
    enableGoogleAnalytics();
  } else if (consentStatus === "declined") {
    disableGoogleAnalytics();
  }

  // Show banner if consent not given
  if (!consentStatus) {
    setTimeout(() => {
      cookieBanner.classList.remove("d-none");
      cookieBanner.style.transform = "translateY(100%)";
      cookieBanner.style.transition = "transform 0.3s ease-out";
      setTimeout(() => {
        cookieBanner.style.transform = "translateY(0)";
      }, 10);
    }, 2000);
  }

  // Handle acceptance
  acceptBtn.addEventListener("click", function () {
    localStorage.setItem(CONSENT_KEY, "true");
    enableGoogleAnalytics();
    hideCookieBanner();
    showInfoToast("Analytics enabled. Thank you!");
  });

  // Handle decline
  if (declineBtn) {
    declineBtn.addEventListener("click", function () {
      localStorage.setItem(CONSENT_KEY, "declined");
      disableGoogleAnalytics();
      hideCookieBanner();
      showInfoToast("Analytics disabled. Your privacy is respected.");
    });
  }

  // Handle close
  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      hideCookieBanner();
    });
  }

  function hideCookieBanner() {
    cookieBanner.style.transform = "translateY(100%)";
    setTimeout(() => {
      cookieBanner.classList.add("d-none");
    }, 300);
  }
}

/**
 * Enable Google Analytics tracking
 */
function enableGoogleAnalytics() {
  if (typeof gtag !== "undefined") {
    gtag("consent", "update", {
      analytics_storage: "granted",
    });

    gtag("config", "G-59D6SLH36C", {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });

    console.log("Google Analytics enabled");
  }
}

/**
 * Disable Google Analytics tracking
 */
function disableGoogleAnalytics() {
  if (typeof gtag !== "undefined") {
    gtag("consent", "update", {
      analytics_storage: "denied",
    });

    console.log("Google Analytics disabled");
  }

  clearGoogleAnalyticsCookies();
  window["ga-disable-G-59D6SLH36C"] = true;
}

/**
 * Clear Google Analytics cookies
 */
function clearGoogleAnalyticsCookies() {
  const gaCookies = [
    "_ga",
    "_ga_G-59D6SLH36C",
    "_gid",
    "_gat",
    "_gat_gtag_G_59D6SLH36C",
    "__utma",
    "__utmt",
    "__utmb",
    "__utmc",
    "__utmz",
    "__utmv",
  ];

  gaCookies.forEach((cookieName) => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
    const rootDomain = window.location.hostname.split(".").slice(-2).join(".");
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${rootDomain};`;
  });

  console.log("Google Analytics cookies cleared");
}

/**
 * Initialize form submission handling
 */
function initializeFormHandling() {
  const form = document.querySelector("form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Check reCAPTCHA first
    if (typeof grecaptcha !== "undefined") {
      const recaptchaResponse = grecaptcha.getResponse();
      if (!recaptchaResponse) {
        showErrorToast(
          "Please complete the reCAPTCHA verification before submitting."
        );
        return;
      }
    }

    // Validate required fields
    const requiredFields = form.querySelectorAll("[required]");
    let isValid = true;

    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        isValid = false;
        field.classList.add("is-invalid");
        field.addEventListener(
          "input",
          function () {
            this.classList.remove("is-invalid");
          },
          { once: true }
        );
      }
    });

    // Check if at least one service is selected
    const serviceCheckboxes = form.querySelectorAll(
      'input[name="services[]"]:checked'
    );
    if (serviceCheckboxes.length === 0) {
      showErrorToast("Please select at least one service type.");
      return;
    }

    if (!isValid) {
      showErrorToast("Please fill in all required fields.");
      return;
    }

    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin me-2"></i>Submitting...';
    }

    showInfoToast("Submitting your application... Please wait.");

    // Submit via fetch
    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
    })
      .then((response) => {
        if (response.ok) {
          showInfoToast(
            "Thank you! Your application has been submitted successfully."
          );
          form.reset();
          if (typeof grecaptcha !== "undefined") {
            grecaptcha.reset();
          }
        } else {
          throw new Error("Submission failed");
        }
      })
      .catch((error) => {
        console.error("Form submission error:", error);
        showErrorToast(
          "There was an error submitting your application. Please try again."
        );
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML =
            '<i class="fas fa-paper-plane me-2"></i>Send Questionnaire';
        }
      });
  });
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initializeSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      if (href === "#") {
        if (!this.hasAttribute("data-mdb-target")) {
          return;
        }
      }

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

/**
 * Initialize range slider with value display
 */
function initializeRangeSlider() {
  const rangeInput = document.getElementById("usefulnessRange");
  if (!rangeInput) return;

  const rangeLabels = [
    "Not useful",
    "Slightly useful",
    "Moderately useful",
    "Very useful",
    "Extremely useful",
  ];

  function updateRangeLabel() {
    const value = parseInt(rangeInput.value);
    const label = rangeLabels[value - 1] || "Unknown";

    let valueDisplay = document.getElementById("rangeValue");
    if (!valueDisplay) {
      valueDisplay = document.createElement("div");
      valueDisplay.id = "rangeValue";
      valueDisplay.className = "text-center mt-2 fw-bold text-primary";
      rangeInput.parentNode.appendChild(valueDisplay);
    }
    valueDisplay.textContent = `${value} - ${label}`;
  }

  rangeInput.addEventListener("input", updateRangeLabel);
  updateRangeLabel();

  window.updateRangeLabel = updateRangeLabel;
}

/**
 * Initialize service checkbox visual feedback
 */
function initializeServiceCheckboxes() {
  document.querySelectorAll(".service-checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      const label = document.querySelector(`label[for="${this.id}"]`);
      if (!label) return;

      if (this.checked) {
        label.classList.add("border-primary", "bg-light");
        label.style.borderWidth = "2px";
      } else {
        label.classList.remove("border-primary", "bg-light");
        label.style.borderWidth = "1px";
      }
    });
  });
}

/**
 * Show info toast notification
 */
function showInfoToast(message) {
  const toastHtml = `
    <div class="toast-container z-max position-fixed top-0 end-0 p-3">
      <div class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-mdb-autohide="false">
        <div class="toast-header">
          <i class="fas fa-info-circle text-info me-2"></i>
          <strong class="me-auto">Info</strong>
          <button type="button" class="btn-close" aria-label="Close"></button>
        </div>
        <div class="toast-body">${message}</div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", toastHtml);
  const newToast = document.querySelector(".toast-container:last-child .toast");

  try {
    if (typeof mdb !== "undefined" && mdb.Toast) {
      const toastInstance = new mdb.Toast(newToast, {
        autohide: false,
        delay: 60000,
      });
      toastInstance.show();

      setTimeout(() => {
        if (toastInstance) {
          toastInstance.hide();
          setTimeout(() => {
            const container = document.querySelector(
              ".toast-container:last-child"
            );
            if (container) container.remove();
          }, 500);
        }
      }, 60000);

      const closeBtn = newToast.querySelector(".btn-close");
      if (closeBtn) {
        closeBtn.addEventListener("click", () => {
          toastInstance.hide();
          setTimeout(() => {
            const container = document.querySelector(
              ".toast-container:last-child"
            );
            if (container) container.remove();
          }, 500);
        });
      }
    } else {
      newToast.classList.add("show");
      setTimeout(() => {
        const container = document.querySelector(".toast-container:last-child");
        if (container) container.remove();
      }, 60000);
    }
  } catch (error) {
    console.warn("Error showing toast:", error);
    setTimeout(() => {
      const container = document.querySelector(".toast-container:last-child");
      if (container) container.remove();
    }, 60000);
  }
}

/**
 * Show error toast notification
 */
function showErrorToast(message) {
  const toastHtml = `
    <div class="toast-container position-fixed top-0 end-0 p-3">
      <div class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-mdb-autohide="false">
        <div class="toast-header">
          <i class="fas fa-exclamation-triangle text-danger me-2"></i>
          <strong class="me-auto">Error</strong>
          <button type="button" class="btn-close" aria-label="Close"></button>
        </div>
        <div class="toast-body">${message}</div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", toastHtml);
  const newToast = document.querySelector(".toast-container:last-child .toast");

  try {
    if (typeof mdb !== "undefined" && mdb.Toast) {
      const toastInstance = new mdb.Toast(newToast, {
        autohide: false,
        delay: 10000,
      });
      toastInstance.show();

      setTimeout(() => {
        if (toastInstance) {
          toastInstance.hide();
          setTimeout(() => {
            const container = document.querySelector(
              ".toast-container:last-child"
            );
            if (container) container.remove();
          }, 500);
        }
      }, 10000);

      const closeBtn = newToast.querySelector(".btn-close");
      if (closeBtn) {
        closeBtn.addEventListener("click", () => {
          toastInstance.hide();
          setTimeout(() => {
            const container = document.querySelector(
              ".toast-container:last-child"
            );
            if (container) container.remove();
          }, 500);
        });
      }
    } else {
      newToast.classList.add("show");
      setTimeout(() => {
        const container = document.querySelector(".toast-container:last-child");
        if (container) container.remove();
      }, 10000);
    }
  } catch (error) {
    console.warn("Error showing toast:", error);
    setTimeout(() => {
      const container = document.querySelector(".toast-container:last-child");
      if (container) container.remove();
    }, 10000);
  }
}

/**
 * Initialize privacy modal functionality
 */
function initializePrivacyModal() {
  document
    .querySelectorAll('[data-mdb-target="#privacyModal"]')
    .forEach((trigger) => {
      trigger.addEventListener("click", function (e) {
        e.preventDefault();

        const modal = document.getElementById("privacyModal");
        if (modal) {
          try {
            if (typeof mdb !== "undefined" && mdb.Modal) {
              const modalInstance = mdb.Modal.getOrCreateInstance(modal);
              modalInstance.show();
            } else {
              modal.classList.add("show");
              modal.style.display = "block";
              document.body.classList.add("modal-open");

              const backdrop = document.createElement("div");
              backdrop.className = "modal-backdrop fade show";
              document.body.appendChild(backdrop);

              const closeModal = () => {
                modal.classList.remove("show");
                modal.style.display = "none";
                document.body.classList.remove("modal-open");
                if (backdrop.parentNode) {
                  backdrop.parentNode.removeChild(backdrop);
                }
              };

              backdrop.addEventListener("click", closeModal);
              modal
                .querySelectorAll('[data-mdb-dismiss="modal"]')
                .forEach((closeBtn) => {
                  closeBtn.addEventListener("click", closeModal);
                });
            }
          } catch (error) {
            console.warn("Error opening privacy modal:", error);
          }
        }
      });
    });
}

// Document ready handler with multiple fallbacks
function documentReady(fn) {
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    setTimeout(fn, 1);
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

// Initialize everything
documentReady(function () {
  // Initialize MDB components when ready
  if (typeof mdb !== "undefined") {
    initializeMDBComponents();
  } else {
    setTimeout(() => {
      if (typeof mdb !== "undefined") {
        initializeMDBComponents();
      } else {
        console.warn(
          "MDBootstrap not loaded, continuing without MDB components"
        );
      }
    }, 100);
  }

  // Add small delay for iOS Safari
  setTimeout(() => {
    initializeCountdown();
    initializeCookieConsent();
    initializeFormHandling();
    initializeSmoothScrolling();
    initializeRangeSlider();
    initializeServiceCheckboxes();
    initializePrivacyModal();
  }, 50);
});

// Cleanup
window.addEventListener("beforeunload", function () {
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
});
