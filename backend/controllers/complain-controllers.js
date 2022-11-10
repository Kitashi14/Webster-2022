//extracting models
const Complain = require("../models/complain");
const Worker = require("../models/worker");
const User = require("../models/user");

//for creating-checking jwt token
const jwt = require("jsonwebtoken");

//fetching latest complains
const latestComplain = async (req, res, next) => {
  console.log("\nlatest complains api hit");

  let latestComplains;

  try {
    console.log("\nfetching latest complains");

    //fetching latest complains from database
    latestComplains = await Complain.find({})
      .sort({ creationTime: -1 })
      .limit(20);
    console.log("\ngot latest complains");
    console.log("\nsent latest complains");
    res.status(200).json({ data: latestComplains });
    return;
  } catch (err) {
    console.log("\nfetching latest complain failed");
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};

//add complain
const addComplain = async (req, res, next) => {
  console.log("\nadd complain api hit");

  //verifying login token
  let login_token;

  //access login token
  try {
    console.log("\nstoring access token");
    login_token = req.cookies[process.env.LOGIN_COOKIE_NAME];

    if (!login_token) throw Error("\nSession expired");
  } catch (error) {
    console.log(error.message);
    const response = { error: "Please login to register complain" };

    res.status(400).json(response);
    return;
  }

  //decoding login token
  let decoded_login_token;
  try {
    console.log("\ndecoding login token");
    decoded_login_token = jwt.verify(login_token, process.env.JWT_SECRET);

    console.log("\ndecoded", decoded_login_token);
  } catch (err) {
    console.log("\ncan't able to decode login token");
    console.log(err.message);
    res.status(500).json({ error: err.message });
    return;
  }

  console.log("\ndestructing request data");
  const {
    title,
    discription,
    profession,
    address,
    phonenum,
    locationX,
    locationY,
    creationTime,
  } = req.body;

  console.log(req.body);

  //creating new complain document
  console.log("\ncreating new complain");
  const newComplain = new Complain({
    creatorUsername: decoded_login_token.userName,
    title,
    discription,
    profession,
    address,
    phonenum,
    location: {
      lat: locationX,
      lng: locationY,
    },
    creationTime,
    workerId: null,
    workerUsername: null,
    acceptedWorkers: [],
    status: "Not Accepted",
    rating: 0,
    comment: "",
    resolvedDate: null,
    approvedDate: null,
  });

  //adding user
  try {
    await newComplain.save();
    console.log("\ncomplain added in database");
    console.log(newComplain);
    res.status(200).json({ message: "Complain added successfully" });
  } catch (err) {
    console.log("\ncan't add complain in database");
    console.log(err.message);
    res.status(500).json({ error: err.message });
    return;
  }
};

//fetch complain of a particular user
const userComplain = async (req, res, next) => {
  console.log("\nfind userComplain api hit");

  const userName = req.params.uid;

  //fetching complains
  try {
    const userComplains = await Complain.find({
      creatorUsername: userName,
    }).sort({ creationTime: -1 });

    console.log(`\nfound all complains registered by user ${userName}`);
    res.status(200).json({ data: userComplains });
  } catch (err) {
    console.log("\ncan't fetch complains with this username");
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};

//filter complains
const filterComplain = async (req, res, next) => {
  console.log("\nfilter complain api hit");

  const { status, profession, distance } = req.body;

  console.log(req.body);

  let filteredComplains;
  //different filter route
  try {
    if (!status) {
      if (!profession) {
        if (!distance) {
          //invalid request
          console.log("\nnot a valid filter");
          res.status(400).json({ error: "Select a valid filter" });
          return;
        } else {
          //based on distance
        }
      } else {
        if (!distance) {
          //based on profession
          filteredComplains = Complain.find({ profession: profession });
        } else {
          //based on distance-profession
        }
      }
    } else {
      if (!profession) {
        if (!distance) {
          //based on status
          filteredComplains = Complain.find({ status: status });
        } else {
          //based on distance-status
        }
      } else {
        if (!distance) {
          //based on profession-status
          filteredComplains = Complain.find({
            status: status,
            profession: profession,
          });
        } else {
          //based on distance-profession-status
        }
      }
    }
    console.log("\ngot complains from database");
    console.log("\nfiltered complains sent");
    res.status(200).json({ data: filteredComplains });
  } catch (err) {
    console.log("\ncan't fetch filtered complain from database");
    console.log(err.message);
    res.status(500).json({ error: err.message });
    return;
  }
};

exports.latestComplain = latestComplain;
exports.addComplain = addComplain;
exports.userComplain = userComplain;
exports.filterComplain = filterComplain;
