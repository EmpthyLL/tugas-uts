const UserModel = require("../model/service/UserModel");

function isMember(uuid) {
  try {
    const model = new UserModel();

    model.checkMembership(uuid);
  } catch (error) {
    console.error("Failed to get authenticated user:", error.message);
  }
}

module.exports = isMember;
