const express = require("express");
const router = express.Router();
const user = require("../controllers/userController");
const password = require("../controllers/forgetPassword");
// const uploadFile = require("../middleware/multerConfig");
const {
  AddingUserValidation,
  changeUserPasswordValidator,
  LoginValidator,
} = require("../utils/validationRules");
const uploadFile = require("../middleware/multerConfig");
const { validationResult } = require("express-validator");
const authorized=require('../controllers/authController')
const uploadUserProfileImage = uploadFile("profileImage");

router
  .route("/register")
  .post(uploadUserProfileImage, AddingUserValidation, user.createUser);
router.route("/login").post( authorized.auth,LoginValidator,user.logIn);
router
  .route("/changePassword/:id")
  .put(changeUserPasswordValidator, password.changePassword);
module.exports = router;
