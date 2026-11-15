/* ==========================================================
   contact.js — contact form validation
   Checks that:
   - no field is empty
   - the email format is valid
   - the phone number contains only digits
   ========================================================== */

const contactForm = document.getElementById("contact-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const messageInput = document.getElementById("message");
const successBox = document.getElementById("form-success");
const submitBtn = contactForm.querySelector("button[type='submit']");

/* ---------- Helper functions ---------- */
function showError(input, message) {
  const errorElement = document.getElementById(input.id + "-error");
  errorElement.textContent = message;
  input.classList.add("invalid");
}

function clearError(input) {
  const errorElement = document.getElementById(input.id + "-error");
  errorElement.textContent = "";
  input.classList.remove("invalid");
}

// Email must look like: something@something.something
function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

// Phone must contain digits 0–9 only
function isDigitsOnly(phone) {
  const digitPattern = /^[0-9]+$/;
  return digitPattern.test(phone);
}

/* ---------- Main validation ---------- */
function validateForm() {
  let isValid = true;

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();
  const message = messageInput.value.trim();

  // Name
  if (name === "") {
    showError(nameInput, "Please enter your name.");
    isValid = false;
  } else {
    clearError(nameInput);
  }

  // Email
  if (email === "") {
    showError(emailInput, "Please enter your email address.");
    isValid = false;
  } else if (!isValidEmail(email)) {
    showError(emailInput, "Please enter a valid email, e.g. name@example.com.");
    isValid = false;
  } else {
    clearError(emailInput);
  }

  // Phone
  if (phone === "") {
    showError(phoneInput, "Please enter your phone number.");
    isValid = false;
  } else if (!isDigitsOnly(phone)) {
    showError(phoneInput, "Phone number must contain digits only.");
    isValid = false;
  } else {
    clearError(phoneInput);
  }

  // Message
  if (message === "") {
    showError(messageInput, "Please enter a message.");
    isValid = false;
  } else {
    clearError(messageInput);
  }

  return isValid;
}

/* ---------- Events ---------- */
contactForm.addEventListener("submit", function (event) {
  event.preventDefault(); // stop the page from reloading
  successBox.classList.remove("show");

  if (validateForm()) {
    const firstName = nameInput.value.trim().split(" ")[0];
    successBox.textContent = "Thank you, " + firstName + "! Your message has been received.";
    successBox.classList.add("show");
    successBox.scrollIntoView({ behavior: "smooth", block: "center" }); // bring the message into view
    contactForm.reset();

    // Change the button text to "Received ✓", then back after 3 seconds
    submitBtn.textContent = "Received ✓";
    setTimeout(function () {
      submitBtn.textContent = "Send message";
    }, 3000);
  }
});

// Remove a field's error as soon as the user starts typing
[nameInput, emailInput, phoneInput, messageInput].forEach(function (input) {
  input.addEventListener("input", function () {
    clearError(input);
  });
});