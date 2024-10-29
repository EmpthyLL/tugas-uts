const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const Model = require("./Model");
const { verify } = require("crypto");

const SECRET_KEY = "T0l0NGj4g4Rahasia";

class UserModel extends Model {
  constructor() {
    super("users");
  }

  isEmailUnique(email) {
    return !this.users.some((user) => user.email === email);
  }
  async register({ fullname, no_hp, email }) {
    const newUser = {
      uuid: uuidv4(),
      fullname,
      no_hp,
      email,
      verify: false,
      verify_date: null,
      profile_pic: null,
      balance: 0,
      cart: [],
      history: [],
    };

    this.data.push(newUser);
    this.saveData();
    return newUser;
  }

  async login({ email, password }) {
    const user = this.users.find((user) => user.email === email);
    if (!user) throw new Error("Invalid email or password.");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid email or password.");

    const token = jwt.sign({ userId: user.uuid }, SECRET_KEY, {
      expiresIn: "1h",
    });
    this.storeToken(token);
    return token;
  }

  storeToken(token) {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
  }

  logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  }

  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      return decoded;
    } catch (err) {
      this.logout(); // Logout if token is expired or invalid
      throw new Error("Session expired. Please log in again.");
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
