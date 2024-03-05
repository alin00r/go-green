const mongoose = require("mongoose");
const db = require("../dataBase/dataBase");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [, true, "Name is required"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email must be unique"],
    },
    profileImage: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      match: [
        /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).+$/,
        "Password must have at least one uppercase letter and one special character",
      ],
    },
    // confirmPassword: {
    //   type: String,
    //   required: [true, "ConfirmPassword is required"],
    //   match: [
    //     /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).+$/,
    //     "Password must have at least one uppercase letter and one special character",
    //   ],
    // },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: [true, "Phone number must be unique"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    active:{
      type : Boolean ,
      default: true
    }
  },
  { timeStamps: true }
);

const user = mongoose.model("User", userSchema);

module.exports = user;
