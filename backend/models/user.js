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
    require: [true, "Please enter address"],
  },
  phonenum: {
    type: Number,
    require: [true, "Please enter phone no."],
    unique: true,
  },
  age: {
    type: Number,
    require: [true, "Please enter age"],
  },
  creationTime: {
    type: Date,
    required: true,
  },
  location: {
    lat: { type: Number },
    lng: { type: Number },
  },
  professions: [
    new mongoose.Schema(
    {
        wokerId:{
            type: String,
            required: true
        },
        wokerProfession:{
            type: String,
            required: true
        },
        workerRating:{
            type: String,
            required: true
        },
        wokerScore: {
            type: String,
            required: true
        }
    })
  ]
});


//exporting User modal
module.exports = mongoose.model("User", userSchema);
