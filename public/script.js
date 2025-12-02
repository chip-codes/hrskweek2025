const hamburgerIcon = document.querySelector('.hamburger-icon');
const menuLinks = document.querySelector('.menu-links');

const slideImages = Array.from(document.querySelectorAll('.slides img'));
const next = document.querySelector('.next');
const prev = document.querySelector('.prev');
const container = document.querySelector('.slide-container');
const dotsContainer = document.querySelector('.dotsContainer');

let counter = 0;
let autoSlideInterval;

const totalDots = 6; // always 6 dots

// Hamburger toggle
hamburgerIcon.addEventListener('click', () => {
    hamburgerIcon.classList.toggle('open');
    menuLinks.classList.toggle('open');
});

// ---------- CREATE DOTS ----------
dotsContainer.innerHTML = "";
let dots = [];

for (let i = 0; i < totalDots; i++) {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    if (i === 0) dot.classList.add("active");
    dotsContainer.appendChild(dot);
    dots.push(dot);
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
 

// ---------- DISPLAY SINGLE IMAGE ----------
function showImage() {
    slideImages.forEach(img => img.classList.remove("active"));

    // show current image
    slideImages[counter].classList.add("active");

    // update dots (cycle 0-5)
    dots.forEach(dot => dot.classList.remove("active"));
    dots[counter % totalDots].classList.add("active");
}

// ---------- NEXT/PREV ----------
function slideNext() {
    counter = (counter + 1) % slideImages.length;
    showImage();
}

function slidePrev() {
    counter = (counter - 1 + slideImages.length) % slideImages.length;
    showImage();
}

// ---------- AUTO SLIDE ----------
function startAutoSliding() {
    autoSlideInterval = setInterval(slideNext, 3000); // 1s per image
}

function stopAutoSliding() {
    clearInterval(autoSlideInterval);
}

// ---------- EVENT LISTENERS ----------
next.addEventListener('click', slideNext);
prev.addEventListener('click', slidePrev);
container.addEventListener('mouseover', stopAutoSliding);
container.addEventListener('mouseout', startAutoSliding);

// ---------- INITIAL DISPLAY ----------
showImage();
startAutoSliding();

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