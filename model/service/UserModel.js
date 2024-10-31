const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const Model = require("./Model");

const SECRET_KEY = "T0l0NGj4g4Rahasia";

class UserModel extends Model {
  constructor() {
    super("users");
  }

  getUserById(userId) {
    return this.data.find((user) => user.uuid === userId);
  }

  findUserByPhone(no_hp) {
    return this.data.find((user) => user.no_hp === no_hp);
  }

  isPhoneUnique(no_hp) {
    return !this.data.some((user) => user.no_hp === no_hp);
  }

  isEmailUnique(email) {
    return !this.data.some((user) => user.email === email);
  }

  async register({ fullname, no_hp, email }) {
    if (!this.isPhoneUnique(no_hp)) {
      throw new Error("Phone number is already registered.");
    }
    if (!this.isEmailUnique(email)) {
      throw new Error("Email is already registered.");
    }

    const newUser = {
      uuid: uuidv4(),
      fullname,
      no_hp,
      email,
      profile_pic: null,
      balance: 0,
      cart: [],
      history: [],
    };
    this.data.push(newUser);
    this.saveData();

    // Automatically log in the user by creating a session token
    const token = jwt.sign({ userId: newUser.uuid }, SECRET_KEY, {
      expiresIn: "1h",
    });
    return { user: newUser, token };
  }

  login(req, no_hp) {
    const user = this.data.find((user) => user.no_hp === no_hp);
    if (!user) throw new Error("User not found.");

    const token = jwt.sign({ userId: user.uuid }, SECRET_KEY, {
      expiresIn: "1h",
    });
    req.session.token = token;
    req.session.user = user.uuid;

    return token;
  }

  logout(req) {
    req.session.destroy();
  }

  verifySessionToken(token) {
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      return decoded;
    } catch (err) {
      throw new Error("Session expired or invalid. Please log in again.");
    }
  }

  addToCart(userId, product) {
    const user = this.users.find((user) => user.uuid === userId);
    if (!user) throw new Error("User not found.");

    user.cart.push(product);
    this.saveUsers();
  }

  addToHistory(userId, transaction) {
    const user = this.users.find((user) => user.uuid === userId);
    if (!user) throw new Error("User not found.");

    user.history.push(transaction);
    this.saveUsers();
  }
}

module.exports = UserModel;
