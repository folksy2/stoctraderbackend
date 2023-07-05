const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  admin: {
    type: Boolean,
    default: false,
  },
});

// create a static method to signup user
UserSchema.statics.signup = async function (email, password, username) {
  const isFirstUser = (await this.countDocuments()) === 0;
  //check if the user already exists
  const exists = await this.findOne({ email });
  if (exists) {
    throw new Error("Email already exists");
  }
  //make sure user insert email and password
  if (!email || !password || !username) {
    throw new Error("Username, Email and password are required");
  }
  //validate email and password ( npm i validator )
  if (!validator.isEmail(email)) {
    throw new Error("Email is invalid");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "make sure you use at least 8 character,one lowercase,one uppercase,one number and one symbol"
    );
  }
  if (!validator.isAlphanumeric(username)) {
    throw new Error("Username must be alphanumeric");
  }
  //encrypt password ( npm i bcryptjs )
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  // set admin to true for the first user
  const admin = isFirstUser;

  //create new user
  const user = await this.create({ email, password: hash, username, admin });
  return user;
};

//static custom login method
UserSchema.statics.login = async function (email, password) {
  //check that i have both fields
  if (!email || !password) {
    throw new Error("Email and password are required");
  }
  //check if the user exists
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error("Email does not exist");
  }
  //compare the password
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error("Password is incorrect");
  }
  return user;
};

// Method to compare password
UserSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = mongoose.model("User", UserSchema);
