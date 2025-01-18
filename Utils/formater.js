const moment = require("moment");

function formatDate(dateString) {
  return moment(dateString).format("DD MMMM YYYY");
}

function formatCurrency(number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
}

module.exports = { formatDate, formatCurrency };
