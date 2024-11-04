const form = document.getElementById("registerForm");
const inputs = form.querySelectorAll("input[required]");
const email = document.getElementById("email");
const no_hp = document.getElementById("no_hp");
const emailError = document.getElementById("emailError");
const no_hpError = document.getElementById("no_hpError");
const nameError = document.getElementById("nameError");

function closeAlert() {
  document.getElementById("alertBox").style.display = "none";
}

function inputCheck() {
  // Reset error messages
  emailError.classList.add("hidden");
  no_hpError.classList.add("hidden");
  nameError.classList.add("hidden");

  // Full Name validation
  if (!document.getElementById("fullname").value) {
    nameError.classList.remove("hidden");
  }

  if (email.value || !validateEmail()) {
    // Email validation
    if (!validateEmail()) {
      emailError.classList.remove("hidden");
      emailError.innerText = "Email address is not valid.";
    }
    if (!email.value) {
      emailError.classList.remove("hidden");
      emailError.innerHTML = "Email address  is required";
    }
  }

  if (no_hp.value || !validateno_hp()) {
    // no_hp validation
    if (!validateno_hp()) {
      no_hpError.classList.remove("hidden");
      no_hpError.innerText = "Phone number is not valid.";
    }
    if (!no_hp.value) {
      no_hpError.classList.remove("hidden");
      no_hpError.innerHTML = "Phone number is required";
    }
  }
}

form.addEventListener("submit", (e) => {
  let isValid = true;

  inputs.forEach((input) => {
    if (!input.checkValidity()) {
      isValid = false;
      input.classList.add("border-red-600", "placeholder:text-red-600");
    } else {
      input.classList.remove("border-red-600", "placeholder:text-red-600");
    }
  });

  inputCheck();

  if (!isValid) e.preventDefault();
});

function validateEmail() {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email.value);
}

function validateno_hp() {
  const no_hpPattern = /^[0-9]{10,14}$/;
  return no_hpPattern.test(no_hp.value);
}
