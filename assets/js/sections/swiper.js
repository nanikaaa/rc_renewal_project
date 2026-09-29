document.addEventListener("includes:loaded", () => {

    const swiperElement = document.querySelector(".swiper");

    if (!swiperElement) return;

    const swiper = new Swiper(swiperElement, {

        loop: true,

        slidesPerView: 3,
        spaceBetween: 20,

        autoplay: {
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
        },

        speed: 7000,

        pagination: {
            el: swiperElement.querySelector(".swiper-pagination"),
            clickable: true,
        },

        navigation: {
            nextEl: swiperElement.querySelector(".swiper-button-next"),
            prevEl: swiperElement.querySelector(".swiper-button-prev"),
        },

        scrollbar: {
            el: swiperElement.querySelector(".swiper-scrollbar"),
        },

    });

});