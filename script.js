const header = document.querySelector("#site-header");
const progress = document.querySelector("#page-progress");
const menuToggle = document.querySelector("#menu-toggle");
const siteNav = document.querySelector("#site-nav");
const filterButtons = document.querySelectorAll(".filter-button");
const photoCards = document.querySelectorAll(".photo-card");
const photoButtons = document.querySelectorAll(".photo-button");
const galleryCount = document.querySelector("#gallery-count");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxTitle = document.querySelector("#lightbox-title");
const lightboxLocation = document.querySelector("#lightbox-location");
const lightboxCounter = document.querySelector("#lightbox-counter");
const lightboxClose = document.querySelector(".lightbox-close");
const lightboxPrev = document.querySelector(".lightbox-prev");
const lightboxNext = document.querySelector(".lightbox-next");
const backToTop = document.querySelector("#back-to-top");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let visibleButtons = [...photoButtons];
let currentLightboxIndex = 0;
let touchStartX = 0;

function updatePageProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
  progress.style.width = `${Math.min(ratio * 100, 100)}%`;
  header.classList.toggle("is-scrolled", window.scrollY > 42);
}

function closeMenu() {
  siteNav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "打开导航菜单");
}

menuToggle.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "关闭导航菜单" : "打开导航菜单");
});

siteNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedFilter = button.dataset.filter;
    let visibleCount = 0;

    filterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });

    photoCards.forEach((card) => {
      const isVisible = selectedFilter === "all" || card.dataset.category === selectedFilter;
      card.classList.toggle("is-hidden", !isVisible);
      if (isVisible) visibleCount += 1;
    });

    galleryCount.textContent = `${visibleCount} / ${photoCards.length}`;
    visibleButtons = [...photoButtons].filter((item) => !item.closest(".photo-card").classList.contains("is-hidden"));
  });
});

function updateLightbox() {
  const button = visibleButtons[currentLightboxIndex];
  if (!button) return;
  lightboxImage.src = button.dataset.full;
  lightboxImage.alt = button.querySelector("img").alt;
  lightboxTitle.textContent = button.dataset.title;
  lightboxLocation.textContent = button.dataset.location;
  lightboxCounter.textContent = `${String(currentLightboxIndex + 1).padStart(2, "0")} / ${String(visibleButtons.length).padStart(2, "0")}`;
}

function openLightbox(button) {
  visibleButtons = [...photoButtons].filter((item) => !item.closest(".photo-card").classList.contains("is-hidden"));
  currentLightboxIndex = Math.max(visibleButtons.indexOf(button), 0);
  updateLightbox();
  lightbox.showModal();
  document.body.classList.add("lightbox-open");
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.close();
  document.body.classList.remove("lightbox-open");
}

function showRelativeImage(offset) {
  if (!visibleButtons.length) return;
  currentLightboxIndex = (currentLightboxIndex + offset + visibleButtons.length) % visibleButtons.length;
  updateLightbox();
}

photoButtons.forEach((button) => button.addEventListener("click", () => openLightbox(button)));
lightboxClose.addEventListener("click", closeLightbox);
lightboxPrev.addEventListener("click", () => showRelativeImage(-1));
lightboxNext.addEventListener("click", () => showRelativeImage(1));

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

lightbox.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") showRelativeImage(-1);
  if (event.key === "ArrowRight") showRelativeImage(1);
});

lightbox.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].clientX;
}, { passive: true });

lightbox.addEventListener("touchend", (event) => {
  const delta = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(delta) > 48) showRelativeImage(delta > 0 ? -1 : 1);
}, { passive: true });

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-visible");
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: "0px 0px -7% 0px" });

document.querySelectorAll("[data-reveal]").forEach((element) => {
  if (reduceMotion) {
    element.classList.add("is-visible");
  } else {
    revealObserver.observe(element);
  }
});

window.addEventListener("scroll", updatePageProgress, { passive: true });
updatePageProgress();
document.querySelector("#current-year").textContent = new Date().getFullYear();