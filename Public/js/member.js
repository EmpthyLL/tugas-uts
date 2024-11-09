// Get the buttons and the price display
const monthlyButton = document.getElementById("monthly-button");
const annualButton = document.getElementById("annual-button");
const priceDisplay = document.getElementById("price-display");
const selectDisplay = document.getElementById("select-display");
const priceValue = document.getElementById("price-value");
const joinMember = document.getElementById("join-member");

monthlyButton.addEventListener("click", function () {
  priceDisplay.innerHTML = 25000;
  selectDisplay.innerHTML = "month";
  joinMember.action = "/become-member/monthly";
  priceValue.value = 25000;
});
annualButton.addEventListener("click", function () {
  priceDisplay.innerHTML = 270000;
  selectDisplay.innerHTML = "year";
  joinMember.action = "/become-member/yearly";
  priceValue.value = 270000;
});
