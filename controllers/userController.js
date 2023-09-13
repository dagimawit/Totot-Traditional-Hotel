const Joi = require("joi");
const jwt = require("jsonwebtoken");

const {
  usersModel,
  validateusers,
  generateAuthToken,
} = require("../models/userSchema");
const mongoose = require("mongoose");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");

function authenticate(user) {
  const userSchema = Joi.object({
    email: Joi.string().min(5).max(50).required().email(),
    password: Joi.string().min(8).max(1024).required(),
  });
  return userSchema.validate(user);
}

//a user to see its account
const currentUser = asyncHandler(async (req, res) => {
  const user = await usersModel.findById(req.user._id).select("-password");
  res.send(user);
});

//to register users'
const registerUser = asyncHandler(async (req, res) => {
  const { error } = validateusers(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const adminExists = await usersModel.exists({ isAdmin: true });

  const isAdmin = adminExists ? false : true;

  let user = await usersModel.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered...");


  user = new usersModel(_.pick(req.body, ["name", "email", "password"]));
  user.isAdmin = isAdmin;

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();
  res
    // .header("x-auth-token", token)
    .set("Authorization", "Bearer " + token)
    .send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: token,
    });
  // .send(_.pick(user, ["_id", "name", "email", "isAdmin" ,"token"]));
});

const loginUser = asyncHandler(async (req, res) => {
  const { error } = authenticate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //to check wether it is already registered or not
  let user = await usersModel.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password...");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send("Invalid email or password...");

  const token = user.generateAuthToken();
  res.send(token);
});

const logoutuser = asyncHandler(async (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    res.status(200).json({ message: "User logged out successfully" });
  });
});
// const logoutuser = asyncHandler(async (req, res) => {
//   req.session.destroy(function () {
//     res.redirect("/login");
//   });
// });
module.exports = {
  authenticate,
  currentUser,
  registerUser,
  loginUser,
  logoutuser,
  generateAuthToken,
};
