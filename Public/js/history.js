let = 0;
const submit = document.getElementById("submit-rating");
const change = (clicked) => {
  const stars = [
    document.getElementById("star1"),
    document.getElementById("star2"),
    document.getElementById("star3"),
    document.getElementById("star4"),
    document.getElementById("star5"),
  ];

  const clickedIndex = stars.indexOf(clicked);

  stars.forEach((star, index) => {
    if (index <= clickedIndex) {
      star.classList.remove("text-gray-400");
      star.classList.add("text-yellow-500");
    } else {
      star.classList.remove("text-yellow-500");
      star.classList.add("text-gray-400");
    }
  });
  submit.disabled = false;
  currentRating = clickedIndex + 1;
};

async function submitRating(id) {
  try {
    const res = await axios.post(`/api/history/rate/${id}`, {
      rating: currentRating,
    });
    if (res.status === 200) {
      window.location.reload();
    }
  } catch (error) {
    if (error.status === 403) {
      window.location.href = "/sign-in";
    }
  }
}
