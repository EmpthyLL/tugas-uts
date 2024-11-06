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

function validateEmail() {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email.value);
}

function validatePhoneNumber() {
  const phonePattern = /^0\d{9,13}$/;
  return phonePattern.test(no_hp.value);
}

function inputCheck() {
  emailError.classList.add("hidden");
  no_hpError.classList.add("hidden");
  nameError.classList.add("hidden");

  if (!document.getElementById("fullname").value) {
    nameError.classList.remove("hidden");
  }

  if (!email.value || !validateEmail()) {
    emailError.classList.remove("hidden");
    emailError.innerText = email.value
      ? "Email address is not valid."
      : "Email address is required.";
  }

  if (!no_hp.value || !validatePhoneNumber()) {
    no_hpError.classList.remove("hidden");
    no_hpError.innerText = no_hp.value
      ? "Phone number is not valid."
      : "Phone number is required.";
  }
}

form.addEventListener("submit", (e) => {
  let isValid = true;

  inputs.forEach((input) => {
    if (!input.checkValidity()) {
      isValid = false;
      input.classList.add("border-red-600", "placeholder:text-red-600");
      input.parentElement.classList.add("border-red-600");
      input.previousElementSibling.firstElementChild.classList.add(
        "text-red-600"
      );
    } else {
      input.classList.remove("border-red-600", "placeholder:text-red-600");
      input.parentElement.classList.remove("border-red-600");
      input.previousElementSibling.firstElementChild.classList.remove(
        "text-red-600"
      );
    }
  });

  inputCheck();

  if (!isValid) e.preventDefault();
});
