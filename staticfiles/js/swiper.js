document.addEventListener('DOMContentLoaded', function () {
  var swipers = document.querySelectorAll('.swiper');
  swipers.forEach(function (swiperEl) {
    var category = swiperEl.dataset.category;
    var nextButton = document.querySelector("#swiper-button-next-" + category);
    var prevButton = document.querySelector("#swiper-button-prev-" + category);
    var pagination = document.querySelector("#swiper-pagination-" + category);
    console.log("Swiper: " + swiperEl);
    console.log("Next: " + nextButton);
    console.log("Prev: " + prevButton);
    console.log("Pagination: " + pagination);


    new Swiper(swiperEl, {
      pagination: {
        el: pagination,
        clickable: true,
        type: "arrow"
      },
      navigation: {
        nextEl: nextButton,
        prevEl: prevButton,
      },
      breakpoints: {
        1800: {
          slidesPerView: 6,
          slidesPerGroup: 6,
          spaceBetween: 20,
        },
        1600: {
          slidesPerView: 4,
          slidesPerGroup: 4,
          spaceBetween: 40,
        },
        1000: {
          slidesPerView: 3,
          slidesPerGroup: 3,
          spaceBetween: 30,
        },
        768: {
          slidesPerView: 2,
          slidesPerGroup: 2,
          spaceBetween: 20,
        },
        200: {
          slidesPerView: 1,
          slidesPerGroup: 1,
          spaceBetween: 10,
        },
      }
    });
  });
});