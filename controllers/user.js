const User = require("../schemas/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Token = require("../schemas/Token");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};
// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.status(200).json({
      userEmail: user.email,
      username: user.username,
      userId: user._id,
      token,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// signup user

const signupUser = async (req, res) => {
  const { email, password, username } = req.body;
  try {
    const user = await User.signup(email, password, username);
    const token = createToken(user._id);
    res.status(200).json({
      userEmail: user.email,
      username: user.username,
      userId: user._id,
      token,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (user) {
      res.status(200).json({ msg: "user deleted successfully" });
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePassword = async (req, res) => {
  const { userId, currentpassword, newpassword } = req.body;

  try {
    // Find the user by their ID
    const user = await User.findById(userId);

    // Verify if the current password matches the stored password
    const isPasswordMatch = await user.comparePassword(currentpassword);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newpassword, salt);

    // Set the new hashed password
    user.password = hashedPassword;

    // Save the updated user
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get one user

const getOneUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// forgot password

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: "User does not exist" });
  }

  // delete any existing token in DB

  let token = await Token.findOneAndDelete({ userId: user._id });

  // create reset token
  let resetToken = crypto.randomBytes(32).toString("hex") + user._id;

  // hash reset token and save to database
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // save token to database
  await new Token({
    userId: user._id,
    token: hashedToken,
    createdAt: Date.now(),
    expireAt: Date.now() + 10 * 60 * 1000, // expires in 10 minutes
  }).save();

  // construct reset url
  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

  // reset message
  const message = `
    <h2>hello ${user.username}</h2>
    <p>You have requested a password reset.</p>
    <p>Please go to this link to reset your password:</p>
    <a href="${resetUrl}" clicktracking="off">${resetUrl}</a>
    <p>Your reset link is only valid for 10 minutes.</p>
    <p>Regards,</p>
    <p>Stocktracker team</p>
  `;

  const subject = "Password reset request";
  const send_to = user.email;
  const sent_from = process.env.EMAIL_USER;

  try {
    // send email
    await sendEmail(subject, message, send_to, sent_from);
    res.status(200).json({ message: "Password reset link sent to email" });
    console.log(subject, message, send_to, sent_from);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// reset password
const resetPassword = async (req, res) => {
  const { password } = req.body;
  const { resetToken } = req.params;

  // hash reset token and then compare with token in DB

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // find token in DB

  const userToken = await Token.findOne({
    token: hashedToken,
    expireAt: { $gt: Date.now() },
  });
  if (!userToken) {
    return res
      .status(400)
      .json({ error: "Invalid token or token has expired" });
  }
  //find the user
  const user = await User.findOne({ _id: userToken.userId });

  // hash new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  user.password = hashedPassword;
  await user.save();
  res.status(200).json({ message: "Password reset successful" });
};

module.exports = {
  loginUser,
  signupUser,
  updatePassword,
  deleteUser,
  getOneUser,
  forgotPassword,
  resetPassword,
};
