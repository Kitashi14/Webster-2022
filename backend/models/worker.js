//extracting mongoose module
const mongoose = require("mongoose");

//Schema for workers
const workerSchema = new mongoose.Schema({

  workerUsername: {
    type: String,
    required: [true, "Please enter workers username"],
    maxlength: 25,
  },
  workerFirstName: {
    type: String,
    required: true,
  },
  workerLastName: {
    type: String
  },
  workerEmail: {
    type: String,
    required: true
  },
  workerPhonenum: {
    type: Number,
    required:true
  },
  workerAge: {
    type: Number,
    required: true
  },
  profession: {
    type: String,
    required: true,
    maxlength: 25
  },
  workerAddress: {
    type: String,
    require: [true, "Please enter address"],
    maxlength: 500
  },
  location: {
    lat: { type: Number },
    lng: { type: Number },
  },
  creationTime: {
    type: Date,
    required: true,
  },
  rating: {
    type: Number,
    required: true
  },
  TCR:{
    type: Number,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  acceptedWorks : []
});


//exporting worker modal
module.exports = mongoose.model("Worker", workerSchema);
