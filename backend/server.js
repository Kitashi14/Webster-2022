/** @format */

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
const userRouters = require("./routers/user-routers");
const complainRouters = require("./routers/complain-routers");
const workerRouters = require("./routers/worker-routers");

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
    origin: process.env.UI_ROOT_URI,
    //Sets Access-Control-Allow-Credentials to true to recieve cookies
    credentials: true,
  })
);

//for allowing cors request from any server
// app.use(cors());

//connecting to mongobd database server
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const dbName = process.env.DBNAME;
mongoose
  .connect(
    `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.rhccnpx.mongodb.net/${dbName}?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("Connected to database\n");
  }).catch((err)=>{
    console.log(err.message);
  });
// mongoose
//   .connect(`mongodb://localhost:${process.env.LOCAL_DATABASE_PORT}/${dbName}`)
//   .then(() => {
//     console.log("Connected to database\n");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

//setting api
app.use("/api/auth", authRouters);
app.use("/api/user", userRouters);
app.use("/api/complain", complainRouters);
app.use("/api/worker", workerRouters);

//setting the server port
const port = process.env.PORT;
app.listen(port, () => console.log(`Server listening on port ${port}...`));
