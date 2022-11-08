//extracting mongoose module
const mongoose = require("mongoose");


//Schema for Otp
const tokenSchema  = new mongoose.Schema({
    email: String,
    otp: String,
    createAt: Date,
    expiresAt: Date
});

//exporting token modal
module.exports = mongoose.model("Token",tokenSchema);