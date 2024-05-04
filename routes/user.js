const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");
//rendering the form
router.get("/signup", userController.renderSignUpForm);

//adding the user
router.post("/signup", wrapAsync(userController.signUp));

//rendering login form
router.get("/login", userController.renderLoginForm);

//login user
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login
);

//logout user
router.get("/logout", userController.logOut);

module.exports = router;
