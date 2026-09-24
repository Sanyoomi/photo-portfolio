const filterButtons = document.querySelectorAll(".filter-button");
const photoCards = document.querySelectorAll(".photo-card");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxTitle = document.querySelector("#lightbox-title");
const lightboxLocation = document.querySelector("#lightbox-location");
const lightboxClose = document.querySelector(".lightbox-close");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedFilter = button.dataset.filter;

    filterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });

    photoCards.forEach((card) => {
      const isVisible = selectedFilter === "all" || card.dataset.category === selectedFilter;
      card.classList.toggle("is-hidden", !isVisible);
    });
  });
});

document.querySelectorAll(".photo-button").forEach((button) => {
  button.addEventListener("click", () => {
    lightboxImage.src = button.dataset.full;
    lightboxImage.alt = button.querySelector("img").alt;
    lightboxTitle.textContent = button.dataset.title;
    lightboxLocation.textContent = button.dataset.location;
    lightbox.showModal();
  });
});

lightboxClose.addEventListener("click", () => lightbox.close());

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    lightbox.close();
  }
});

document.querySelector("#current-year").textContent = new Date().getFullYear();