const UserModel = require("../model/service/UserModel");

function MemberStatus(uuid) {
  try {
    const model = new UserModel();

    if (token) {
      model.checkMembership(uuid);
      return true;
    }

    return 0;
  } catch (error) {
    console.error("Failed to get authenticated user:", error.message);
  }
}

module.exports = MemberStatus;
