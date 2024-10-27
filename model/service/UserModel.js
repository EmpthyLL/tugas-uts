const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const Model = require("./Model");

const SECRET_KEY = "rahasia";

class UserModel extends Model {
  loadUsers() {
    this.dirExist();
    const data = fs.readFileSync(this.source, "utf8");
    return JSON.parse(data);
  }

  saveUsers() {
    fs.writeFileSync(this.source, JSON.stringify(this.users, null, 2));
  }

  isEmailUnique(email) {
    return !this.users.some((user) => user.email === email);
  }

  async register({ fullname, no_hp, email, password }) {
    if (!this.isEmailUnique(email)) throw new Error("Email already in use.");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      uuid: uuidv4(),
      fullname,
      no_hp,
      email,
      password: hashedPassword,
      profile: null,
      balance: 0,
      cart: [],
      history: [],
    };

    this.users.push(newUser);
    this.saveUsers();
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
