//extracting models
const Complain = require("../models/complain");
const Worker = require("../models/worker");
const User = require("../models/user");
const helper = require("../controllers/helper");

//for creating-checking jwt token
const jwt = require("jsonwebtoken");
const { removeSpaces } = require("./helper");

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
  let {
    title,
    description,
    profession,
    address,
    phonenum,
    locationX,
    locationY,
    creationTime,
  } = req.body;

  console.log(req.body);

  //check for correction in data
  let count = helper.professions.filter(
    (professions) => professions.name === profession
  );

  if (!count.length) {
    res.status(400).json({ error: "enter a valid profession" });
    return;
  }

  //remove spaces at start and end in title, discription & address
  console.log("\ntitle :", title);
  console.log("\ndescription :", description);
  console.log("\naddress :", address);
  title = removeSpaces(title);
  description = removeSpaces(description);
  address = removeSpaces(address);
  console.log("\ntitle :", title);
  console.log("\ndescription :", description);
  console.log("\naddress :", address);

  //creating new complain document
  console.log("\ncreating new complain");
  const newComplain = new Complain({
    creatorUsername: decoded_login_token.userName,
    title,
    description,
    profession,
    address,
    phonenum,
    location: {
      lat: locationX,
      lng: locationY,
    },
    creationTime,
    workerId: "N/A",
    workerUsername: "N/A",
    acceptedWorkers: [],
    status: "not_assigned",
    rating: 0,
    comment: "",
    resolvedDate: null,
    approvedDate: null,
  });

  //checking if a complain with same title and creator exists
  try {
    const existingComplain = await Complain.findOne({
      creatorUsername: decoded_login_token.userName,
      title,
    });

    if (existingComplain) {
      console.log(
        "\ncomplain with same title and creator exists\n",
        existingComplain
      );
      console.log("\nsending error message");
      res.status(422).json({
        error: "You already have a complain with same title. Can't register.",
      });
      return;
    }
  } catch (err) {
    console.log("\ncan't fetch from database");
    console.log(err.message);
    res.status(500).json({ error: err.message });
    return;
  }

  //adding complain
  try {
    await newComplain.save();
    console.log("\ncomplain added in database");
    console.log(newComplain);
    const response = {
      message: "Complain added successfully",
      data: { complainId: newComplain._id },
    };
    console.log("\nsending response", response);
    res.status(200).json(response);
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

  const userName = removeSpaces(req.params.uid);
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
          console.log("\nnot a valid filter");
          res.status(400).json({ error: "Select a valid filter" });
        }
      } else {
        if (!distance) {
          //based on profession
          filteredComplains = await Complain.find({ profession: profession });
        } else {
          //based on distance-profession
        }
      }
    } else {
      if (!profession) {
        if (!distance) {
          //based on status
          filteredComplains = await Complain.find({ status: status });
        } else {
          //based on distance-status
        }
      } else {
        if (!distance) {
          //based on profession-status
          filteredComplains = await Complain.find({
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

//get complain details
const getComplainDetails = async (req, res, next) => {
  console.log("\nget complain details api hit");

  const complainId = req.params.cid;
  console.log("\ncomplain id", complainId);

  let login_token;
  let isVerifiedUser = false;

  //fetching complain details from database
  let complainDetails;
  try {
    console.log("\nfetching complain from database");
    complainDetails = await Complain.findOne({ _id: complainId });

    console.log("\nfetched complain from database");
    console.log(complainDetails);

    if (!complainDetails) {
      console.log("\nno complain exists with this complain id");
      res.status(400).json({ error: "Complain doesn't exists" });
      return;
    }
  } catch (err) {
    console.log("\ncan't fetch complain from database");
    console.log(err.message);
    res.status(500).json({ error: err.message });
    return;
  }

  const userName = complainDetails.creatorUsername;

  let decoded_login_token;
  //verifying login token
  try {
    //accessing login token
    console.log("\nstoring access token");
    login_token = req.cookies[process.env.LOGIN_COOKIE_NAME];

    if (!login_token) {
      throw Error("\nsession expired");
    }

    //decoding login token
    try {
      console.log("\ndecoding login token");
      decoded_login_token = jwt.verify(login_token, process.env.JWT_SECRET);
      console.log("\ndecoded", decoded_login_token);
      if (decoded_login_token.userName === userName) {
        isVerifiedUser = true;
      }
    } catch (err) {
      console.log("\ncan't able to decode login token");
      console.log(err.message);
    }
  } catch (error) {
    console.log(error.message);
  }
  console.log("\nisUserVerified", isVerifiedUser);

  //sending response
  res.status(200).json({ data: { complain: complainDetails, isVerifiedUser } });
  return;
};

//delete complain
const deleteComplain = async (req, res, next) => {
  console.log("\ndelete complain api hit");

  const complainId = req.params.cid;

  //verifying login token
  let login_token;

  //access login token
  try {
    console.log("\nstoring access token");
    login_token = req.cookies[process.env.LOGIN_COOKIE_NAME];

    if (!login_token) throw Error("\nSession expired");
  } catch (error) {
    console.log(error.message);
    const response = { error: "Please login to delete complain" };

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

  //deleting complain from database
  try {
    console.log("\ndeleting complain from database");

    const deletedComplain = await Complain.deleteOne({ _id: complainId });

    console.log("\ndeleted complain from database");
    console.log("\ndeleted complain", deletedComplain);
    if (!deletedComplain.deletedCount) {
      console.log("\nno complain exists with this complain id");
      res.status(400).json({ error: "Complain doesn't exists" });
      return;
    }
    res.status(200).json({ message: "deleted complain successfully" });
    return;
  } catch (err) {
    console.log("\ncan't delete complain from database");
    console.log(err.message);
    res.status(500).json({ error: err.message });
    return;
  }
};

//update complain
const updateComplain = async (req, res, next) => {
  console.log("\nupdate complain api hit");

  //verifying login token
  let login_token;

  //access login token
  try {
    console.log("\nstoring access token");
    login_token = req.cookies[process.env.LOGIN_COOKIE_NAME];

    if (!login_token) throw Error("\nSession expired");
  } catch (error) {
    console.log(error.message);
    const response = { error: "Please login to delete complain" };

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
    complainId,
    title,
    description,
    profession,
    address,
    phonenum,
    locationX,
    locationY,
  } = req.body;

  console.log(req.body);

  //updating complain in database
  try {
    const updatedComplain = await Complain.updateOne(
      { _id: complainId },
      {
        $set: {
          title,
          description,
          profession,
          address,
          phonenum,
          location: {
            lat: locationX,
            lng: locationY,
          },
        },
      }
    );

    if (!updatedComplain) {
      console.log("\nno complain exists with this complain id");
      res.status(400).json({ error: "Complain not found" });
    }

    console.log("\ncomplain updated");
    console.log("\ncomplain", updatedComplain);

    console.log("\nsent updated complain");
    res.status(200).json({ data: updatedComplain });
  } catch (err) {
    console.log("\ncan't update complain in database");
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};
const acceptComplain = async (req, res) => {
  try {
    const workerid = req.params.workerId;
    const complainid = req.params.complainId;
    let res1 = await Complain.findById(complainid);
    res1.acceptedWorkers.addToSet(workerid);
    let res2 = await Worker.findById(workerid);
    res2.acceptedWorks.addToSet(complainid);
    console.log(res1);
    console.log(res2);
    res.status(200).json({ message: "complain accepted" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};
const workerRejectComplain = async (req, res) => {
  try {
    const workerid = req.params.workerId;
    const complainid = req.params.complainId;
    let res1 = await Complain.findById(complainid);
    res1.acceptedWorkers.pull(workerid);
    let res2 = await Worker.findById(workerid);
    res2.acceptedWorks.pull(complainid);
    console.log(res1);
    console.log(res2);
    res.status(200).json({ message: "complain accepted" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};
const closeComplain = async (req, res) => {
  try {
    const id = req.body.id;
    const rating = req.body.rating;
    const comment = req.body.comment;
    const resolvedDate = req.body.resolvedDate;
    let res1 = await Complain.findByIdAndUpdate(id, {
      status: "resolved",
      rating: rating,
      comment: comment,
      resolvedDate: resolvedDate,
    });
    const workerUsername = res1.workerUsername;
    let res2 = await Woker.findOne({ workerUsername: workerUsername });
    res2.TCR = res2.TCR + 1;
    res2.score = res2.score + rating;
    res2.rating = res2.score / res2.TCR;
    await res2.save();
    res.status(200).json({ data: res1, message: "complain closed" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};
const approveComplain = async (req, res) => {
  try {
    id = req.params.id;
    userName = req.params.userName;
    let result = await Complain.findByIdAndUpdate(id, {
      status: "assigned",
      workerUsername: userName,
    });
    console.log(result);
    if (!result) {
      res.status(400).json({ error: "Complain Not Found" });
      return;
    }
    console.log(result);
    res
      .status(200)
      .json({ data: result, message: "Complain has been assigned" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};
const rejectComplain = async (req, res) => {
  try {
    id = req.params.id;
    let result = await Complain.findByIdAndUpdate(id, {
      status: "not_assigned",
      workerUsername: "N/A",
    });
    console.log(result);
    if (!result) {
      res.status(400).json({ error: "Complain Not Found" });
      return;
    }
    console.log(result);
    res
      .status(200)
      .json({ data: result, message: "Complain has been rejected" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};
exports.latestComplain = latestComplain;
exports.addComplain = addComplain;
exports.userComplain = userComplain;
exports.filterComplain = filterComplain;
exports.deleteComplain = deleteComplain;
exports.getComplainDetails = getComplainDetails;
exports.updateComplain = updateComplain;
exports.workerRejectComplain = workerRejectComplain;
exports.acceptComplain = acceptComplain;
exports.closeComplain = closeComplain;
exports.approveComplain = approveComplain;
exports.rejectComplain = rejectComplain;
