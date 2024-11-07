const moment = require("moment");

function formatDate(dateString) {
  return moment(dateString).format("DD MMMM YYYY");
}

module.exports = formatDate;
