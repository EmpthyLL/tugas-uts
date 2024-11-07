const UserModel = require("../model/service/UserModel");
const getAuthUser = require("./user");

function isMember(req) {
  try {
    const user = getAuthUser(req);
    const model = new UserModel();

    model.checkMembership(user.uuid);
  } catch (error) {
    console.error("Failed to get authenticated user:", error.message);
  }
}

module.exports = isMember;
