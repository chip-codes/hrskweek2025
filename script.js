const hamburgerIcon = document.querySelector('.hamburger-icon');
const menuLinks = document.querySelector('.menu-links');

// access the images
const slideImages = document.querySelectorAll('.slides img');
// access the next and prev btns
const next = document.querySelector('.next');
const prev = document.querySelector('.prev');
// access the indicators
const container = document.querySelector('.slide-container');
const dotsContainer = document.querySelector('.dotsContainer');

let counter = 0;
let autoSlideInterval;

hamburgerIcon.addEventListener('click', () => {
    hamburgerIcon.classList.toggle('open');
    menuLinks.classList.toggle('open');
});

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // smooth scroll
    });
}

let dots = [];
slideImages.forEach((img, index) => {
    let dot = document.createElement('div');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');
    dot.setAttribute('attr', index);
    dot.onclick = () => switchImage(dot);
    dotsContainer.appendChild(dot);
    dots.push(dot);
});

function showSlide(index) {
    slideImages.forEach(img => img.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    slideImages[index].classList.add('active');
    dots[index].classList.add('active');
    counter = index;
}

function slideNext() {
    let nextIndex = (counter + 1) % slideImages.length;
    showSlide(nextIndex);
}

function slidePrev() {
    let prevIndex = (counter - 1 + slideImages.length) % slideImages.length;
    showSlide(prevIndex);
}

// auto sliding
function startAutoSliding() {
    autoSlideInterval = setInterval(slideNext, 3000);
}

function stopAutoSliding() {
    clearInterval(autoSlideInterval);
}

// btn events
next.addEventListener('click', slideNext);
prev.addEventListener('click', slidePrev);
// pause on hover
container.addEventListener('mouseover', stopAutoSliding);
container.addEventListener('mouseout', startAutoSliding);

showSlide(0);
startAutoSliding();

function updateIndicators() {
    dots.forEach(dot => dot.classList.remove('active'));
    dots[counter].classList.add('active');
}

// add click event to the indicator
function switchImage(dot) {
    let imageId = parseInt(dot.getAttribute('attr'));

    if (imageId === counter) return; //already active / index 0

    if (imageId > counter) {
        slideImages[counter].style.animation = 'next1 0.5s ease-in forwards';
        counter = imageId;
        slideImages[counter].style.animation = 'next2 0.5s ease-in forwards';
    } else {
        slideImages[counter].style.animation = 'prev1 0.5s ease-in forwards';
        counter = imageId;
        slideImages[counter].style.animation = 'prev2 0.5s ease-in forwards';
    }

    updateIndicators();
}

// popup for sliding
    document.addEventListener("DOMContentLoaded", () => {
    const popup = document.getElementById("popup");
    const slidingBtn = document.getElementById("sliding-btn");
    const closePopup = document.getElementById("close-popup");

    slidingBtn.addEventListener("click", () => {
        popup.style.display = "flex";
    });

    closePopup.addEventListener("click", () => {
        popup.style.display = "none";
    });

    document.querySelectorAll(".design-options img").forEach(img => {
        img.addEventListener("click", () => {
            const design = img.dataset.design;
            window.location.href = `games/sliding/slide${design}/slide${design}.html`;
        });
    });
});


