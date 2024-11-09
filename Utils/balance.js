function cekBalance(user, price, req, res) {
  if (user.balance < price) {
    req.flash(
      "balance",
      "Sadly, your balance is not enough to execute payment!"
    );
    res.redirect("/top-up");
    return false;
  }
  return true;
}

module.exports = cekBalance;
