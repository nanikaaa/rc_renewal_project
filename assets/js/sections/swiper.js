document.addEventListener("includes:loaded", () => {
  const swiperElement = document.querySelector(".swiper");

  if (!swiperElement) {
    console.warn("Swiper element not found.");
    return;
  }

  const swiper = new Swiper(".swiper", {
    

    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },

    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },

    scrollbar: {
      el: ".swiper-scrollbar",
    },
  });
});