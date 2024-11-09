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
      member_until: null,
      cart: { item: [], cart_total: 0 },
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

  editBasicInfo(userId, { profile_pic, fullname, gender, birth_date }) {
    const user = this.getUserByUuid(userId);
    console.log(userId);
    if (!user) throw new Error("User not found.");
    user.profile_pic = profile_pic || user.profile_pic;
    user.fullname = fullname || user.fullname;
    user.gender = gender;
    user.birth_date = birth_date;

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
  checkMembership(userId) {
    const user = this.getUserByUuid(userId);
    if (!user) throw new Error("User not found.");

    const now = new Date();
    const isMemberValid =
      user.member && (!user.member_until || new Date(user.member_until) > now);

    if (user.member !== isMemberValid) {
      user.member = isMemberValid;
      this.saveData();
    }
    return user.member;
  } // New Method to Top Up User Balance
  async topUp(userId, amount) {
    const user = this.getUserByUuid(userId);
    if (!user) throw new Error("User not found.");

    if (amount <= 0) throw new Error("Amount must be greater than zero.");

    user.balance += Number(amount);
    this.saveData();
    return user.balance;
  }

  // New Method to Join Membership
  async joinMember(
    userId,
    membershipPrice,
    durationType = "monthly",
    durationValue = 1
  ) {
    const user = this.getUserByUuid(userId);
    if (!user) throw new Error("User not found.");

    // Deduct the membership price
    user.balance -= membershipPrice;

    // Update membership status
    user.member = true;
    user.member_since = new Date().toISOString();

    // Calculate member_until based on duration type
    const currentDate = new Date();
    if (durationType === "monthly") {
      user.member_until = new Date(
        currentDate.setMonth(currentDate.getMonth() + durationValue)
      ).toISOString();
    } else if (durationType === "yearly") {
      user.member_until = new Date(
        currentDate.setFullYear(currentDate.getFullYear() + durationValue)
      ).toISOString();
    }

    this.saveData();

    return {
      message: "Successfully joined the membership!",
      memberUntil: user.member_until,
      remainingBalance: user.balance,
    };
  }
}

module.exports = UserModel;
