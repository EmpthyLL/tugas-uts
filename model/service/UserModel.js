const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const Model = require("./Model");

const SECRET_KEY = "T0l0NGj4g4Rahasia";

class UserModel extends Model {
  constructor() {
    super("users");
    this.sessions = {}; // Simple in-memory session store
  }

  isPhoneUnique(no_hp) {
    return !this.data.some((user) => user.no_hp === no_hp);
  }

  isEmailUnique(email) {
    return !this.data.some((user) => user.email === email);
  }

  async register({ fullname, no_hp, email }) {
    // Check if phone number or email is already in use
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
      verify: false,
      verify_date: null,
      profile_pic: null,
      balance: 0,
      cart: [],
      history: [],
    };
    this.data.push(newUser);
    this.saveData();

    // Automatically log in the user by creating a session token
    const token = this.createSessionToken(newUser.uuid);
    return { user: newUser, token };
  }

  login({ no_hp }) {
    const user = this.users.find((user) => user.no_hp === no_hp);
    if (!user) throw new Error("User not found.");

    // Generate a session token for the user
    const token = this.createSessionToken(user.uuid);
    return token;
  }

  createSessionToken(userId) {
    const token = jwt.sign({ userId }, SECRET_KEY, { expiresIn: "1h" });
    this.sessions[userId] = token; // Store token in session store
    return token;
  }

  verifySessionToken(token) {
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      const sessionToken = this.sessions[decoded.userId];
      if (sessionToken !== token) throw new Error("Invalid session.");

      return decoded;
    } catch (err) {
      throw new Error("Session expired or invalid. Please log in again.");
    }
  }

  logout(userId) {
    delete this.sessions[userId]; // Remove session token
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
