async function handleLogout() {
  try {
    const res = await axios.post("api/auth/logout");
    if (res.status === 200) {
      window.location.reload();
    }
  } catch (error) {
    if (error.status === 403) {
      window.location.href = "/sign-in";
    }
  }
}
