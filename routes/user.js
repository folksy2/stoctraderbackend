const express = require("express");
const {
  loginUser,
  signupUser,
  updatePassword,
  deleteUser,
  getOneUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/user");

const app = express.Router();

app.post("/login", loginUser);
app.post("/signup", signupUser);

const requireAuth = require("../middlewares/requireAuth");
// app.use(requireAuth);

app.get("/userInfo/:id", getOneUser);
app.put("/updatepassword", updatePassword);
app.delete("/:id", deleteUser);
app.post("/forgotpassword", forgotPassword);
app.put("/resetpassword/:resetToken", resetPassword);

module.exports = app;
