function home(req, res) {
  res.render("index", {
    layout: "components/layout",
    nama: "Howard",
    title: "Home Page",
  });
}

module.exports = { home };
