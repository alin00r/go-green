const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const user = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const multer = require("multer");
const bcrypt = require("bcrypt");
const ApiError = require("../utils/ApiError");

exports.changePassword = asyncHandler(async (req, res, next) => {
  const change = await user.findByIdAndUpdate(
    req.params.id,
    { currentPassword: bcrypt.hash(req.body.currentPassword, 8) },
    { new: true }
  );
  if (!change) {
    return next(new ApiError(`there is no user with id ${req.params.id}`));
  }
  res.status(200).send({ msg: "updated successfully",change:change.password });
});
