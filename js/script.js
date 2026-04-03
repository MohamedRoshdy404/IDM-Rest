// Copy key function
function copyKey(key) {
  navigator.clipboard.writeText(key).then(
    function () {
      alert("تم نسخ المفتاح: " + key);
    },
    function (err) {
      console.error("Could not copy text: ", err);
    },
  );
}

// Update current year in footer
document.addEventListener("DOMContentLoaded", function () {
  const currentYear = new Date().getFullYear();
  const yearElement = document.getElementById("current-year");
  if (yearElement) {
    yearElement.textContent = currentYear;
  }

  // Lightbox for explanation image
  const explanationImage = document.getElementById("explanation-image");
  if (explanationImage) {
    const overlay = document.createElement("div");
    overlay.className = "lightbox-overlay";

    const enlargedImage = document.createElement("img");
    enlargedImage.src = explanationImage.src;
    enlargedImage.alt = explanationImage.alt || "صورة البرنامج";

    overlay.appendChild(enlargedImage);
    document.body.appendChild(overlay);

    explanationImage.addEventListener("click", () => {
      overlay.classList.add("active");
      document.body.style.overflow = "hidden";
    });

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay || e.target === enlargedImage) {
        overlay.classList.remove("active");
        document.body.style.overflow = "";
      }
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        overlay.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  }
});
