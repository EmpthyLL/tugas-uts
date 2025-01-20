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
  priceDisplay.innerHTML = formatCurrency(25000);
  selectDisplay.innerHTML = "month";
  price = 25000;
  type = "month";
});
annualButton.addEventListener("click", function () {
  priceDisplay.innerHTML = formatCurrency(275000);
  selectDisplay.innerHTML = "year";
  price = 275000;
  type = "year";
});
payButton.addEventListener("click", async function () {
  const dopay = confirm("Lakukan Pembayaran");
  if (dopay) {
    try {
      const res = await axios.post(`/api/purchase/become-member/${type}`, {
        price,
      });
      if (res.status === 200) {
        window.location.href = `/?member=${res.data.message}`;
      }
    } catch (error) {
      if (error.status === 400) {
        window.location.href = `/top-up?balance=${error.response.data.message}`;
      }
      if (error.status === 401) {
        window.location.href = `/`;
      }
      if (res.status === 403) {
        window.location.href = "/sign-in";
      }
    }
  }
});

function formatCurrency(number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
}
