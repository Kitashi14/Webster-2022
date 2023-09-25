// import {mongoose} from "mongoose";
const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    from : {
        type: String,
        require: true,
    },
    to : {
        type: String,
        require : true
    },
    message : {
        type : String,
        require : true
    },
    time : {
        type : Date,
        require : true
    },
    status : {
        type : String,
        require : true
    }
});

module.exports= mongoose.model("Chat", chatSchema);