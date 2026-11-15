/* ==========================================================
   main.js — shared code used on every page
   1. Theme toggle (light / dark)
   2. Mobile navigation menu
   3. Header shadow on scroll
   4. Time-based greeting (home page)
   5. Scroll reveal animation
   6. Footer year
   7. Photo carousel (inner pages)
   ========================================================== */

// Tell the CSS that JavaScript is running (used by the reveal animation)
document.documentElement.classList.add("js");

/* ---------- 1. Theme toggle ---------- */
const themeBtn = document.getElementById("theme-btn");

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  // Show a sun in dark mode and a moon in light mode
  themeBtn.textContent = theme === "dark" ? "☀" : "☾";
}

// Load the saved theme, or use dark mode by default
const savedTheme = localStorage.getItem("theme") || "dark";
applyTheme(savedTheme);

themeBtn.addEventListener("click", function () {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(newTheme);
  localStorage.setItem("theme", newTheme); // remember the choice
});

/* ---------- 2. Mobile navigation menu ---------- */
const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");

menuBtn.addEventListener("click", function () {
  const isOpen = navLinks.classList.toggle("open");
  menuBtn.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", isOpen);
});

// Close the menu after a link is clicked
navLinks.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", function () {
    navLinks.classList.remove("open");
    menuBtn.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  });
});

/* ---------- 3. Header shadow on scroll ---------- */
const header = document.getElementById("site-header");

window.addEventListener("scroll", function () {
  if (window.scrollY > 10) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

/* ---------- 4. Time-based greeting ---------- */
const greeting = document.getElementById("greeting");

// Only runs on the home page, where the greeting element exists
if (greeting) {
  const hour = new Date().getHours();
  let message;

  if (hour < 12) {
    message = "Good morning";
  } else if (hour < 17) {
    message = "Good afternoon";
  } else {
    message = "Good evening";
  }

  greeting.textContent = message + ", welcome to my portfolio 👋";
}

/* ---------- 5. Scroll reveal animation ---------- */
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  // Add the "visible" class when an element scrolls into view
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // animate only once
      }
    });
  }, { threshold: 0.15 });

  revealItems.forEach(function (item) {
    observer.observe(item);
  });
} else {
  // Older browsers: show everything immediately
  revealItems.forEach(function (item) {
    item.classList.add("visible");
  });
}

/* ---------- 6. Footer year ---------- */
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

/* ---------- 7. Photo carousel ---------- */
// Find all photos inside the carousel (the home page has none)
const slides = document.querySelectorAll(".carousel img");
let currentSlide = 0; // the first photo starts as "active" in the HTML

if (slides.length > 1) {
  // Every 5000 milliseconds (5 seconds), show the next photo
  setInterval(function () {
    slides[currentSlide].classList.remove("active");     // hide the current photo
    currentSlide = (currentSlide + 1) % slides.length;    // move to the next one, back to 0 after the last
    slides[currentSlide].classList.add("active");        // show the new photo
  }, 5000);
}