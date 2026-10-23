/* Gallery lightbox interaction */
(() => {
  const lightbox = document.querySelector("#lightbox");
  const lightboxImage = document.querySelector("#lightbox-image");
  const lightboxCaption = document.querySelector("#lightbox-caption");
  const closeButton = document.querySelector(".lightbox-close");
  const artworkButtons = document.querySelectorAll(".artwork-button");

  function openLightbox(button) {
    const image = button.querySelector("img");
    lightboxImage.src = button.dataset.full || image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = button.dataset.caption || image.alt;

    if (typeof lightbox.showModal === "function") {
      lightbox.showModal();
    } else {
      lightbox.setAttribute("open", "");
    }
  }

  function closeLightbox() {
    if (typeof lightbox.close === "function" && lightbox.open) {
      lightbox.close();
    } else {
      lightbox.removeAttribute("open");
    }
    lightboxImage.src = "";
  }

  artworkButtons.forEach((button) => {
    button.addEventListener("click", () => openLightbox(button));
  });

  closeButton.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.open) closeLightbox();
  });
})();
