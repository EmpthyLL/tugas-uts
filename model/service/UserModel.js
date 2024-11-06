const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const Model = require("./Model");

const SECRET_KEY = "T0l0NGj4g4Rahasia";

class UserModel extends Model {
  constructor() {
    super("users");
  }

  generateToken(user, hour) {
    return jwt.sign({ userId: user.uuid }, SECRET_KEY, {
      expiresIn: `${hour}h`,
    });
  }

  getUserByUuid(uuid) {
    return this.data.find((user) => user.uuid === uuid);
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
      gender: null,
      birth_date: null,
      profile_pic: null,
      balance: 0,
      member: false,
      member_since: null,
      cart: [],
      history: [],
      notification: [],
    };
    this.data.push(newUser);
    this.saveData();

    const token = this.generateToken(newUser, 1);

    return token;
  }

  async login(no_hp) {
    const user = this.findUserByPhone(no_hp);
    if (!user) throw new Error("User not found.");

    const token = this.generateToken(user, 1);

    return token;
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

  editBasicInfo(userId, { fullname, gender, birth_date }) {
    const user = this.getUserByUuid(userId);
    if (!user) throw new Error("User not found.");

    user.fullname = fullname || user.fullname;
    user.gender = gender || user.gender;
    user.birth_date = birth_date || user.birth_date;

    this.saveData();
  }

  editEmail(userId, newEmail) {
    const user = this.getUserByUuid(userId);
    if (!user) throw new Error("User not found.");

    user.email = newEmail;
    this.saveData();
  }

  editPhone(userId, newPhone) {
    const user = this.getUserByUuid(userId);
    if (!user) throw new Error("User not found.");

    user.no_hp = newPhone;
    this.saveData();
  }
}

module.exports = UserModel;
