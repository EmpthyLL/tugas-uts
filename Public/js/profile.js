const profilePicInput = document.getElementById("profile_pic");
const profilePicture = document.getElementById("profilePicture");

profilePicInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      profilePicture.src = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    profilePicture.src = "/img/profile.webp";
  }
});

const editBiodata = document.getElementById("editBiodata");
const biodataButton = document.getElementById("biodataButton");
const profile_pic = document.getElementById("profile_pic");
const fullname = document.getElementById("fullname");
const gender = document.getElementById("gender");
const birth_date = document.getElementById("birth_date");

const originalName = fullname.getAttribute("data-original");
const originalGender = gender.getAttribute("data-original");
const originalBirthDate = birth_date.getAttribute("data-original");

let profilePicChanged = false;

function toggleBiodataButton() {
  const isNameEmpty = !fullname.value.trim();
  const isUnchanged =
    fullname.value === originalName &&
    gender.value === originalGender &&
    birth_date.value === originalBirthDate &&
    !profilePicChanged;
  biodataButton.disabled = isNameEmpty || isUnchanged;
}

[fullname, gender, birth_date].forEach((field) => {
  field.addEventListener("input", toggleBiodataButton);
});

profile_pic.addEventListener("input", () => {
  profilePicChanged = true;
  toggleBiodataButton();
});
toggleBiodataButton();

const editEmail = document.getElementById("editEmail");
const emailButton = document.getElementById("emailButton");
const email = document.getElementById("email");
const emailError = document.getElementById("emailError");
const emailSection = document.getElementById("emailSection");
const emailIcon = document.getElementById("emailIcon");
const originalEmail = email.getAttribute("data-original");

function toggleEmailButton() {
  const isEmailEmpty = !email.value.trim();
  const isUnchanged = email.value === originalEmail;
  emailButton.disabled = isEmailEmpty || isUnchanged;
}

email.addEventListener("input", toggleEmailButton);

toggleEmailButton();
function emailSubmit(e) {
  let isValid = validateEmail();
  if (!isValid) {
    email.classList.add("border-red-600", "placeholder:text-red-600");
    emailSection.classList.add("border-red-600");
    emailIcon.classList.add("text-red-600");
    emailError.classList.remove("hidden");
    e.preventDefault();
  } else {
    email.classList.remove("border-red-600", "placeholder:text-red-600");
    emailSection.classList.remove("border-red-600");
    emailIcon.classList.remove("text-red-600");
    emailError.classList.add("hidden");
  }
}
editEmail.addEventListener("submit", function (e) {
  emailSubmit(e);
});

const editPhone = document.getElementById("editPhone");
const phoneButton = document.getElementById("phoneButton");
const no_hp = document.getElementById("no_hp");
const no_hpError = document.getElementById("no_hpError");
const no_hpSection = document.getElementById("no_hpSection");
const no_hpIcon = document.getElementById("no_hpIcon");
const originalNo_hp = no_hp.getAttribute("data-original");

function togglePhoneButton() {
  const isPhoneEmpty = !no_hp.value.trim();
  const isUnchanged = no_hp.value === originalNo_hp;
  phoneButton.disabled = isPhoneEmpty || isUnchanged;
}
no_hp.addEventListener("input", togglePhoneButton);

togglePhoneButton();

function phoneSubmit(e) {
  let isValid = validatePhoneNumber();
  if (!isValid) {
    no_hp.classList.add("border-red-600", "placeholder:text-red-600");
    no_hpSection.classList.add("border-red-600");
    no_hpIcon.classList.add("text-red-600");
    no_hpError.classList.remove("hidden");
    e.preventDefault();
  } else {
    no_hp.classList.remove("border-red-600", "placeholder:text-red-600");
    no_hpSection.classList.remove("border-red-600");
    no_hpIcon.classList.remove("text-red-600");
    no_hpError.classList.add("hidden");
  }
}
editPhone.addEventListener("submit", function (e) {
  phoneSubmit(e);
});

function resetBiodata() {
  fullname.value = originalName;
  gender.value = originalGender;
  birth_date.value = originalBirthDate;
  toggleBiodataButton();
}
function resetEmail() {
  email.classList.remove("border-red-600", "placeholder:text-red-600");
  emailSection.classList.remove("border-red-600");
  emailIcon.classList.remove("text-red-600");
  emailError.classList.add("hidden");
  email.value = originalEmail;
  toggleEmailButton();
}
function resetPhone() {
  no_hp.classList.remove("border-red-600", "placeholder:text-red-600");
  no_hpSection.classList.remove("border-red-600");
  no_hpIcon.classList.remove("text-red-600");
  no_hpError.classList.add("hidden");
  no_hp.value = originalNo_hp;
  togglePhoneButton();
}

function validateEmail() {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email.value);
}

function validatePhoneNumber() {
  const phonePattern = /^0\d{9,13}$/;
  return phonePattern.test(no_hp.value);
}
