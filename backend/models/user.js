//extracting mongoose module
const mongoose = require("mongoose");

//Schema for users
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please enter username"],
    unique: true,
    maxlength: 25,
  },
  email: {
    type: String,
    required: [true, "Please enter the email"],
    unique: true,
  },
  firstName: {
    type: String,
    required: [true, "Please enter first name"],
    maxlength: 50,
  },
  lastName: {
    type: String,
    maxlength: 50,
  },
  isGoogle: {
    type: Boolean,
    required: [true, "Please tell is google authentication used"],
  },
  isVerified: {
    type: Boolean,
    required: true,
  },
  password: {
    type: String,
    minlength: 8,
  },
  address: {
    type: String,
    required: [true, "Please enter address"],
    maxlength: 500,
  },
  phonenum: {
    type: Number,
    required: [true, "Please enter phone no."],
    unique: true,
  },
  age: {
    type: Number,
    required: [true, "Please enter age"],
  },
  creationTime: {
    type: Date,
    requiredd: true,
  },
  location: {
    lat: { type: Number },
    lng: { type: Number },
  },
  professions: [],
  favouriteWorkers: [],
});

//exporting User modal
module.exports = mongoose.model("User", userSchema);
