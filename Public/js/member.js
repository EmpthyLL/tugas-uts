// Get the buttons and the price display
const monthlyButton = document.getElementById("monthly-button");
const annualButton = document.getElementById("annual-button");
const priceDisplay = document.getElementById("price-display");
const selectDisplay = document.getElementById("select-display");
const priceValue = document.getElementById("price-value");
const payButton = document.getElementById("pay-button");

let price;
let type;

monthlyButton.addEventListener("click", function () {
  priceDisplay.innerHTML = 25000;
  selectDisplay.innerHTML = "month";
  price = 25000;
  type = "month";
});
annualButton.addEventListener("click", function () {
  priceDisplay.innerHTML = 275000;
  selectDisplay.innerHTML = "year";
  price = 275000;
  type = "year";
});
payButton.addEventListener("click", async function () {
  const dopay = confirm("Lakukan Pembayaran");
  if (dopay) {
    const res = await axios.post(`/api/purchase/become-member/${type}`, {
      price,
    });
    if (res.status === 200) {
      if (res.data.balance) {
        window.location.href = `/?member=${res.data.message}`;
      } else {
        window.location.href = `/top-up?balance=${res.data.message}`;
      }
    }
    if (res.status === 403) {
      window.location.href = "/sign-in";
    }
  }
});
