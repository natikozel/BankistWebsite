'use strict';

///////////////////////////////////////
// Modal window

// Elements

const header = document.querySelector('.header');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section = document.querySelectorAll('.section');
//const section1 = document.querySelector('#section--1')
//const section2 = document.querySelector('#section--2')
//const section3 = document.querySelector('#section--3')
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const message = document.createElement('h1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const navs = document.querySelectorAll('.nav__link');
const navBar = document.querySelector('.nav');
const images = document.querySelectorAll('.features__img');
const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const rightSlider = document.querySelector('.slider__btn--right');
const leftSlider = document.querySelector('.slider__btn--left');
const dotContainer = document.querySelector('.dots');

message.classList.add('cookie--message');
message.innerHTML = `We use cookies for improved functionality and analytics. 
<button class = 'btn btn--close-cookie'>Got it!</button>`;
header.append(message);


// Functions

const openModal = function(e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function() {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden'))
    closeModal();
});

document.querySelector('.btn--close-cookie').addEventListener('click', function() {
  message.parentElement.removeChild(message);
});

message.style.fontSize = '15px';
message.style.height = parseFloat(getComputedStyle(message).height) + 30 + 'px';

btnScrollTo.addEventListener('click', function(e) {
  section[0].scrollIntoView({ behavior: 'smooth' });

});


// Matching Strategy
document.querySelector('.nav__links').addEventListener('click', function(e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link') && e.target.getAttribute('href') !== '#')
    document.querySelector(e.target.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
});

tabsContainer.addEventListener('click', function(e) {
  const target = e.target.closest('.operations__tab');
  if (target) {
    const targetContent = document.querySelector(`.operations__content--${target.dataset.tab}`);
    tabs.forEach(x => x.classList.remove('operations__tab--active'));
    tabsContent.forEach(x => x.classList.remove('operations__content--active'));
    target.classList.toggle('operations__tab--active');
    targetContent.classList.toggle('operations__content--active');
  }
});

const handleHover = function(e) {
  const target = e.target;
  if (!target.classList.contains('nav__link')) return;
  const logo = target.closest('.nav').querySelector('img');
  navs.forEach(x => {
    if (x !== target) x.style.opacity = this;
  });
  logo.style.opacity = this;
};

navBar.addEventListener('mouseover', handleHover.bind(0.5));
navBar.addEventListener('mouseout', handleHover.bind(1));

const obsFunc = function() {
  const headerObserver = new IntersectionObserver(function(entries) {
    const [entry] = entries;
    if (!entry.isIntersecting)
      navBar.classList.add('sticky');
    else
      navBar.classList.remove('sticky');
  }, {
    root: null,
    threshold: 0,
    rootMargin: `-${navBar.getBoundingClientRect().height}px`
  });


  const sectionObserver = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (entry.intersectionRatio > 0) {
        entry.target.classList.remove('section--hidden');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.15
  });


  const imageObserver = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (entry.intersectionRatio > 0) {
        entry.target.src = entry.target.dataset.src;
        entry.target.addEventListener('load', () => entry.target.classList.remove('lazy-img'));
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0,
    rootMargin: '200px'
  });

  headerObserver.observe(header);
  section.forEach(x => {
    sectionObserver.observe(x);
    x.classList.add('section--hidden');
  });
  images.forEach(img => imageObserver.observe(img));
};

const sliderFunc = function() {
  let curSlide = 0;

  const makeSlides = () => slides.forEach((slide, i) => slide.style.transform = `translateX(${i * 100}%)`);

  const createDots = function() {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML('beforeend',
        `<button class ='dots__dot' data-slide='${i}'></button>`);
    });
  };

  const activateDot = function(dotNum) {
    document.querySelectorAll('.dots__dot').forEach((dot, i) => {
      if (dotNum === i)
        document.querySelectorAll('.dots__dot')[dotNum].classList.add('dots__dot--active');
      else
        dot.classList.remove('dots__dot--active');
    });
  };


  function init() {
    makeSlides();
    createDots();
    activateDot(curSlide);
  }

  init();

  const moveSlide = curSlide => {
    activateDot(+curSlide);
    slides.forEach((slide, i) => {
      slide.style.transform = `translateX(${(i - curSlide) * 100}%)`;
    });

  };
  const slide = function(e) {
    if (e.target === rightSlider || e.key === 'ArrowRight') {
      if (curSlide === slides.length - 1)
        curSlide = 0;
      else
        curSlide++;
    } else if (e.target === leftSlider || e.key === 'ArrowLeft') {
      if (curSlide === 0)
        curSlide = slides.length - 1;
      else
        curSlide--;
    } else
      return;
    moveSlide(curSlide);
  };

  slider.addEventListener('click', slide);
  document.addEventListener('keydown', slide);
  dotContainer.addEventListener('click', function(e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      moveSlide(slide);
    }
  });
};

obsFunc();
sliderFunc();
