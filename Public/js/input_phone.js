function closeAlert() {
  document.getElementById("alertBox").style.display = "none";
}

const form = document.getElementById("registerForm");
const no_hp = document.getElementById("no_hp");
const no_hpError = document.getElementById("no_hpError");

form.addEventListener("submit", (e) => {
  let isValid = true;

  if (no_hp.value) {
    if (!validateno_hp()) {
      isValid = false;
      no_hp.classList.add("border-red-600", "placeholder:text-red-600");
      no_hpError.classList.remove("hidden");
      no_hpError.innerText = "Phone number is invalid.";
    } else {
      no_hp.classList.remove("border-red-600", "placeholder:text-red-600");
      no_hpError.classList.add("hidden");
    }
  } else {
    isValid = false;
    no_hp.classList.add("border-red-600", "placeholder:text-red-600");
    no_hpError.classList.remove("hidden");
    no_hpError.innerText = "Phone number is required.";
  }

  if (!isValid) e.preventDefault();
});

function validateno_hp() {
  // Remove the quotes around the regex and correct the pattern
  const no_hpPattern = /^0\d{9,13}$/; // Correct regex pattern
  return no_hpPattern.test(no_hp.value);
}
