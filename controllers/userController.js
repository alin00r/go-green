const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const user = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const multer = require("multer");
const bcrypt = require("bcrypt");
const ApiError = require("../utils/ApiError");
const jwt = require("jsonwebtoken");
const apiError = require("../utils/ApiError");
require("dotenv").config();

const createToken = (payload) =>
  jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: "90m",
  });

exports.createUser = asyncHandler(async (req, res, next) => {
  // 1. Extract request body data
  const { name, email, phone, role } = req.body;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  // 2. Validate password confirmation
  if (password !== confirmPassword) {
    return next(new apiError("Invalid password confirmation.", 400));
  }

  // 3. Hash the password
  const saltRounds = 8; // Adjust as needed
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // 4. Check if image exists in request
  if (!req.file) {
    return res.status(400).send("Please upload a profile image");
  }

  // 5. Get the uploaded image path
  const profileImage = req.file.path;

  // 6. Create a new user object
  const newUser = new user({
    name,
    email,
    password: hashedPassword,
    confirmPassword,
    phone,
    profileImage,
    role,
  });

  // 7. Check for existing user
  try {
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      throw new ApiError("This user already exists", 409);
    }
  } catch (error) {
    return next(error); // Forward the error to central error handler
  }

  // 8. Save the user and send response
  try {
    const savedUser = await newUser.save();
    const payload = createToken(savedUser.email);
    console.log("token", payload);
    res.status(201).send({
      message: "Registration successful",
      newUser: {
        name: savedUser.name,
        pic: `${process.env.ORIGINAL_URL}${profileImage}`, // Assuming ORIGINAL_URL is a base URL
        Token: payload,
      },
    });
  } catch (error) {
    return next(error); // Forward the error to central error handler
  }
});

exports.logIn = asyncHandler(async (req, res, next) => {
  // const { email, password } = req.body;
  const loggedIn = await user.findOne({ email: req.body.email });
  if (!loggedIn) {
    return next(new apiError("User logIn failed", 400));
  }
  const checkPassword =await bcrypt.compare(req.body.password, loggedIn.password);
  if (!checkPassword) {
    return next(new apiError("User logIn failed", 400));
  } else {
    const payload = createToken(loggedIn.email);
    // console.error(payload)
    return res.status(200).send({
      message: "Logged In Successfully!",
      token: payload,
    });
  }
});
