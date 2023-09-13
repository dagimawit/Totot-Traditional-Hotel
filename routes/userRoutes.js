const express = require("express");
const userRouter = express.Router();
const auth = require("../middleware/auth");
const {
  registerUser,
  loginUser,
  logoutuser,
  currentUser,
} = require('../controllers/userController')


userRouter.post("/register", registerUser);

userRouter.post("/login",auth, loginUser);

userRouter.get("/logout",auth,  logoutuser,)

userRouter.get("/me",auth, currentUser);




module.exports = userRouter;
