/* ==========================================================
   contact.js — contact form validation and sending
   Checks that:
   - no field is empty
   - the email format is valid
   - the phone number contains only digits
   Then sends the message with EmailJS:
   - one email to me with the visitor's message
   - one automatic reply to the visitor
   ========================================================== */

// EmailJS details (from my EmailJS account)
const SERVICE_ID = "service_xfdim1q";
const TEMPLATE_TO_ME = "template_fdem343";
const TEMPLATE_AUTO_REPLY = "template_dosdeyp";
emailjs.init({ publicKey: "znvEH6ZCC5syyVBLo" });

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
  successBox.classList.remove("show", "failed");

  if (!validateForm()) {
    return; // stop here if any field is wrong
  }

  // The names here match {{name}}, {{email}}, {{phone}} and {{message}} in my EmailJS templates
  const formData = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    phone: phoneInput.value.trim(),
    message: messageInput.value.trim()
  };
  const firstName = formData.name.split(" ")[0];

  // Show that the message is being sent, and stop double clicks
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";

  // 1. Send the visitor's message to me
  emailjs.send(SERVICE_ID, TEMPLATE_TO_ME, formData)
    .then(function () {
      // 2. Send the automatic reply to the visitor
      emailjs.send(SERVICE_ID, TEMPLATE_AUTO_REPLY, formData);

      successBox.textContent = "Thank you, " + firstName + "! Your message has been received. Check your email for my reply.";
      successBox.classList.add("show");
      contactForm.reset();

      // Change the button text to "Received ✓", then back after 3 seconds
      submitBtn.textContent = "Received ✓";
      setTimeout(function () {
        submitBtn.textContent = "Send message";
      }, 3000);
    })
    .catch(function () {
      // Sending failed, for example no internet connection
      successBox.textContent = "Sorry, your message could not be sent. Please try again or email me directly.";
      successBox.classList.add("show", "failed");
      submitBtn.textContent = "Send message";
    })
    .finally(function () {
      submitBtn.disabled = false;
      successBox.scrollIntoView({ behavior: "smooth", block: "center" }); // bring the message into view
    });
});

// Remove a field's error as soon as the user starts typing
[nameInput, emailInput, phoneInput, messageInput].forEach(function (input) {
  input.addEventListener("input", function () {
    clearError(input);
  });
});