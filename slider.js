function createSlider() {

  const slideData = dummyData.data;
  const container = document.querySelector('#switchback-carousel .swiper-wrapper');
  slideData.forEach((item,index) => {
    let slide = document.createElement('div')
    slide.id = `switchback-slide-${index}`
    slide.classList.add('swiper-slide', 'slide')
    let slideImg = document.createElement('img');
    slideImg.src = `./img/SwitchbackTestImage-${index+1}.jpg`;
    slide.appendChild(slideImg);
    container.appendChild(slide);
  })
  
  const swiper = new Swiper(".swiper-container", {
    direction: "horizontal",
    loop: false,
    grabCursor: true,
    speed: 400,
    mousewheel: {
      invert: false,
    },
    scrollbar: {
      el: ".swiper-scrollbar",
      draggable: true,
    },
    // pagination: {
    //   el: ".swiper-pagination",
    //   clickable: true,
    // },
    slidesPerView: 1,
    spaceBetween: 10,
    breakpoints: {
      900: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      1200: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
    },
  });
}
document.addEventListener("DOMContentLoaded", createSlider);
