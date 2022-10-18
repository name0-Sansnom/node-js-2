const mongoose = require("mongoose");

const userForm = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    Dob: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      // Minlenght: 8,
      // Maxlenght: 16,
    },
    gender: {
      type: String,
    },
    check: {
      type: String,
    },
    country: {
      type: String,
    },
  },
  { timestamps: true }
);

const model = mongoose.model("users", userForm);

module.exports = model;
