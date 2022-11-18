//extracting mongoose module
const mongoose = require("mongoose");

//Schema for complains
const complainSchema = new mongoose.Schema({

  creatorUsername: {
    type: String,
    required: [true, "Please enter creator username"],
    maxlength: 25,
  },
  title: {
    type: String,
    required: true,
    maxlength: 100,
  },
  description: {
    type: String,
    maxlength: 1000,
  },
  profession: {
    type: String,
    required: true,
    maxlength: 25
  },
  address: {
    type: String,
    require: [true, "Please enter address"],
    maxlength: 500
  },
  phonenum: {
    type: Number,
    require: [true, "Please enter phone no."],
    unique: true,
  },
  location: {
    lat: { type: Number },
    lng: { type: Number },
  },
  creationTime: {
    type: Date,
    required: true,
  },
  workerId: {
    type: String,
    required: true,
  },
  workerUsername:{
    type: String,
    required: true,
  },
  acceptedWorkers: [
    new mongoose.Schema({
        workerId: {
            type: String,
            required: true
        },
        workerUsername: {
            type: String,
            required: true
        },
        acceptedDate: {
            type: Date,
            required: true
        }
    })
  ],
  status:{
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true
  },
  comment: {
    type: String, 
    maxlength: 1000
  },
  resolvedDate: {
    type: Date,
  },
  approvedDate:{
    type: Date
  }
});


//exporting complain modal
module.exports = mongoose.model("Complain", complainSchema);
