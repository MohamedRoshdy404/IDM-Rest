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
document.addEventListener("DOMContentLoaded", function () {
  const currentYear = new Date().getFullYear();
  const yearElement = document.getElementById("current-year");
  if (yearElement) {
    yearElement.textContent = currentYear;
  }
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
async function loadKey() {
  try {
    const response = await fetch("/.netlify/functions/getKey");
    const key = await response.text();
    document.getElementById("keyCode").textContent = key;
    const copyBtn = document.getElementById("copyBtn");
    copyBtn.onclick = function () {
      navigator.clipboard.writeText(key);
      alert("تم نسخ المفتاح");
    };
  } catch (error) {
    console.error(error);
  }
}
document.addEventListener("DOMContentLoaded", loadKey);

// async function loadKey() {
//   try {
//     const response = await fetch("http://restidm.runasp.net/api/GetKeys/NewKey"); // حط رابط API هنا

//     // لأن الرد Text مش JSON
//     const key = await response.text();

//     // حط المفتاح في الصفحة
//     document.getElementById("keyCode").textContent = key;

//     // زر النسخ
//     document.getElementById("copyBtn").onclick = function () {
//       navigator.clipboard.writeText(key);
//       alert("تم نسخ المفتاح");
//     };

//   } catch (error) {
//     console.error("Error loading key:", error);
//     document.getElementById("keyCode").textContent = "حصل خطأ في تحميل المفتاح";
//   }
// }

// // تشغيل بعد تحميل الصفحة
// document.addEventListener("DOMContentLoaded", loadKey);
