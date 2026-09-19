const SWIPE_THRESHOLD = 50;

const slider = document.querySelector(".slider");
const sliderViewport = document.querySelector(".slider__viewport");
const slides = document.querySelectorAll(".slider__slide");
const sliderList = document.querySelector(".slider__list");
const sliderControls = document.querySelector(".slider__controls");
const controls = document.querySelectorAll(".slider__control");
let activeSlide = Number(
  document.querySelector(".slider__slide--active").dataset.slide,
);
const totalSlides = slides.length;
let touchStartX = 0;

const handleNextBtnClick = () => {
  if (activeSlide < totalSlides - 1) {
    activeSlide++;
  } else {
    activeSlide = 0;
  }
  updateSliderPosition();
};
const handlePrevBtnClick = () => {
  if (activeSlide > 0) {
    activeSlide--;
  } else {
    activeSlide = totalSlides - 1;
  }
  updateSliderPosition();
};
const updateSliderPosition = () => {
  sliderList.style.transform = `translateX(-${activeSlide * 100}%)`;
  controls.forEach((control) =>
    control.classList.toggle(
      "slider__control--active",
      Number(control.dataset.slide) === activeSlide,
    ),
  );
};

slider.addEventListener("click", (event) => {
  const nextBtn = event.target.closest(".slider__button--next");
  const prevBtn = event.target.closest(".slider__button--prev");

  if (prevBtn) {
    handlePrevBtnClick();
  }
  if (nextBtn) {
    handleNextBtnClick();
  }
});

sliderControls.addEventListener("click", (event) => {
  const control = event.target.closest(".slider__control");

  if (!control) {
    return;
  }

  activeSlide = Number(control.dataset.slide);
  updateSliderPosition();
});

sliderViewport.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].clientX;
});

sliderViewport.addEventListener("touchend", (event) => {
  const swipeDistance = event.changedTouches[0].clientX - touchStartX;

  if (Math.abs(swipeDistance) < SWIPE_THRESHOLD) {
    return;
  }

  if (swipeDistance < 0) {
    handleNextBtnClick();
  } else {
    handlePrevBtnClick();
  }
});
