//first fetching environment variable
require("dotenv").config();

//extracting different modules
const cors = require("cors");
const cookieParser = require("cookie-parser");

//extracting express module 
const express = require("express");
const app = express();

//extracting routers
const authRouters = require("./routers/auth-routers");

//for reading cookies while getting requests
app.use(cookieParser());

//for parsering json file
const bodyParser = require("body-parser");
app.use(bodyParser.json());

//allowing excess to public folder
app.use(express.static("public"));

//for allowing cors request from client side
app.use(
    cors({
        //Sets Access-Control-Allow-Origin to the UI URI
        origin: true,
        //Sets Access-Control-Allow-Credentials to true to recieve cookies
        credentials: true
    })
)

//for allowing cors request from any server
// app.use(cors());

//connecting to mongobd database server
const mongoose = require("mongoose");
const dbName = process.env.DBNAME;
mongoose.connect(`mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.rhccnpx.mongodb.net/?retryWrites=true&w=majority/${dbName}`);

//setting api
app.use("/api/auth",authRouters);

//setting the server port
const port = process.env.PORT;
app.listen(port, () => console.log(`Server listening on port ${port}...`));

