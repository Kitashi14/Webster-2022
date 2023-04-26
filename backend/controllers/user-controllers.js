/** @format */

//extracting the user modal
const User = require("../models/user");
const Complain = require("../models/complain");
const Worker = require("../models/worker");

//for creating-checking jwt token
const jwt = require("jsonwebtoken");

//for hashing password
const bcrypt = require("bcryptjs");

//for formatting date and time
const date = require("date-and-time");
const { removeSpaces } = require("./helper");

//find data using email
const getUserWithEmail = async (email) => {
  //finding user with email;
  let existingUser;
  try {
    console.log("\n", "finding in database");
    existingUser = await User.findOne({ email: email });
    return existingUser;
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};

//post createAccount request function
const addUser = async (req, res, next) => {
  console.log("\nadd user api hit");
  //destructuring and storing requested data
  let {
    firstName,
    lastName,
    password,
    phonenum,
    address,
    age,
    locationX,
    locationY,
  } = req.body;
  let email;
  let isGoogle;
  let isVerified;

  const email_token = req.cookies[process.env.EMAIL_COOKIE_NAME];

  //decoding email token recieved as cookie
  try {
    console.log("\ndecoding email token");
    const decoded_email_token = jwt.verify(email_token, process.env.JWT_SECRET);
    console.log("\ndecoded", decoded_email_token);
    email = decoded_email_token.userEmail;
    isGoogle = decoded_email_token.isGoogleVerified;
    isVerified = decoded_email_token.isVerified;
  } catch (error) {
    console.log("\nFailed to decode email token");
    console.log("\n", error.message);
    const response = { error: "Failed to create account" };
    res.status(500).json(response);
  }

  //checking email verification
  if (!isVerified) {
    console.log("\nemail not verified");
    res
      .status(422)
      .json({ error: "Email not verified. Please verify your email." });
    return;
  }

  //finding existing user with same email;
  console.log("\nchecking for existing user");
  let existingUserEmail;
  try {
    existingUserEmail = await User.findOne({ email: email });
    //checking existing userEmail
    if (existingUserEmail) {
      console.log("A user with this email already exists");
      console.log(existingUserEmail);
      res.status(422).json({ error: "A user with this email already exists" });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
    return;
  }

  //finding existing user with same Phonenum;
  let existingPhonenum;
  try {
    existingPhonenum = await User.findOne({ phonenum: phonenum });
    //checking existing Phonenum
    if (existingPhonenum) {
      console.log("A user with this phone no. already exists");
      console.log(existingPhonenum);
      res
        .status(422)
        .json({ error: "A user with this phone no. already exists" });
      return;
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
    return;
  }

  //creating hash of the password
  async function hashPassword() {
    const saltRounds = 10;

    const hashedPassword = await new Promise((resolve, reject) => {
      bcrypt.hash(password, saltRounds, function (err, hash) {
        if (err) reject(err);
        resolve(hash);
      });
    });

    return hashedPassword;
  }
  let hashedPassword;
  try {
    hashedPassword = await hashPassword();
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
    return;
  }

  //noting current time
  const now = new Date(Date.now());
  creationTime = date.format(now, "YYYY/MM/DD HH:mm:ss");
  console.log(creationTime);

  //checking for correction in data

  //for first-name
  console.log("\nfirstName :", firstName);
  //removing spaces at start and end
  let updatedFirstName = removeSpaces(firstName);

  firstName = updatedFirstName;
  console.log("\nfirstName :", firstName);

  //changing spaces in between to underscore
  updatedFirstName = updatedFirstName.replace(/ /g, "_");
  console.log("\nupdatedUserFirstName :", updatedFirstName);

  //for last-name
  console.log("\nlastName :", lastName);
  //removing spaces at start and end
  let updatedLastName = removeSpaces(lastName);
  console.log("\nupdatedLastName :", updatedLastName);

  //for address
  console.log("\naddress :", address);
  //removing spaces at start and end
  let updatedAddress = removeSpaces(address);
  console.log("\nupdatedLastName :", updatedAddress);

  //creating newUser object
  const newUser = new User({
    username: "@" + updatedFirstName + phonenum,
    email,
    firstName,
    lastName: updatedLastName,
    isGoogle,
    isVerified,
    password: hashedPassword,
    address: updatedAddress,
    phonenum,
    age,
    creationTime,
    location: {
      lat: locationX,
      lng: locationY,
    },
    professions: [],
  });

  //add newUser to database
  try {
    await newUser.save();
    console.log("User added");
    console.log(newUser);
    res.clearCookie(process.env.EMAIL_COOKIE_NAME);
    res.status(200).json({ message: "Account created successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};

//resetting user password
const resetPassword = async (req, res, next) => {
  console.log("\nreset password api hit");
  const newPassword = req.body.password;
  let email_token;

  //finding email token
  try {
    console.log("\nstoring email token");
    email_token = req.cookies[process.env.EMAIL_COOKIE_NAME];

    if (!email_token) throw Error("\nSession expired");
  } catch (error) {
    console.log(error.message);
    const response = { error: "email-token expired" };

    res.status(400).json(response);
    return;
  }

  try {
    //decoding email-token
    console.log("\ndecoding email-token");
    const decoded_email_token = jwt.verify(email_token, process.env.JWT_SECRET);

    console.log("\ndecoded", decoded_email_token);

    //checking email-token request type
    if (decoded_email_token.isCreatingAccount) {
      console.log("\ncreate account token found\ncan't reset password");

      res
        .status(400)
        .json({ error: "Token sent to create account, can't reset password" });
      return;
    }

    //checking if the token is verified or not
    else if (!decoded_email_token.isVerified) {
      console.log("\nemail is not verified");
      res.status(400).json({ error: "Email not verified" });
      return;
    } else {
      //encrypting password using bcryptjs
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      console.log("\nhashedOtp", hashedPassword);

      try {
        console.log("\nupdating user data");
        const user = await User.updateOne(
          {
            email: decoded_email_token.userEmail,
          },
          {
            $set: {
              password: hashedPassword,
            },
          }
        );

        console.log("\npassword updated");
        console.log(user);

        //delete email token
        res.clearCookie(process.env.EMAIL_COOKIE_NAME);
        console.log("\ndeleted email token");

        res.status(200).json({ message: "user-password updated" });
      } catch (err) {
        console.log("\nfailed to reset password");
        console.log(err.message);
        res.status(500).json({ error: err.message });
        return;
      }
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
    return;
  }
};

//get user profile = user details with complain and professions
const getUserDetail = async (req, res, next) => {
  console.log("\nget user details api hit");

  const userName = req.params.uid;
  console.log("\nuser", userName);

  let login_token;
  let isVerifiedUser = false;

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

  //fetch user-details from database
  try {
    const userDetails = await User.findOne({ username: userName });

    if (!userDetails) {
      console.log("\nuser not found with this username");
      res.status(400).json({ error: "user not found" });
    }

    const userRegComplains = await Complain.find({ creatorUsername: userName });

    const userResolvedcomplains = await Complain.find({
      workerUsername: userName,
      status: "resolved",
    });

    const userAssComplains = await Complain.find({
      workerUsername: userName,
      status: "assigned",
    });

    const profileDetails = {
      userDetails,
      regComplains: userRegComplains,
      resComplains: userResolvedcomplains,
      assComplains: userAssComplains,
      isVerifiedUser,
    };
    console.log("\ngot user details from database");
    console.log("\nprofile: ", profileDetails);
    //sending details
    console.log("\nsent user details");
    res.status(200).json({ data: profileDetails });
  } catch (err) {
    console.log("\ncan't fetch from database");
    console.log(err.message);
    res.status(500).json({ error: "can't able to fetch user details" });
  }
};

//add favorite worker
const addfavoriteworker = async (req, res) => {
  console.log("\nadd favourite api hit\n");
  try {
    const favoriteworkerid = req.params.id;
    const userName = req.params.username;
    // let result = await User.findOneAndUpdate(
    //   {
    //     username: userName,
    //   },
    //   {
    //     $push: {
    //       favouriteWorkers: {
    //         id: favoriteworkerid,
    //       },
    //     },
    //   }
    // );
    let result = await User.findOne({ username: userName });
    result.favouriteWorkers.addToSet(favoriteworkerid);
    await result.save();
    console.log(result);
    if (!result) {
      res.status(401).json({ error: "failed to add favorite worker" });
    } else {
      res.status(401).json({ data: result });
    }
  } catch (err) {
    console.log("error while adding as favoite user");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};
//update user in user_list
const updateUser = async (req, res) => {
  try {
    const username = req.body.username;
    const email = req.body.email;
    const firstname = req.body.firstName;
    const lastname = req.body.lastName;
    const address = req.body.address;
    const phonenum = req.body.phonenum;
    const age = req.body.age;
    const location = req.body.location;
    const user = await User.findOneAndUpdate(
      { username: username },
      {
        $set: {
          email: email,
          firstName: firstname,
          lastName: lastname,
          address: address,
          phonenum: phonenum,
          age: age,
          location: location,
        },
      }
    );
    console.log(user);

    const worker = await Worker.UpdateMany(
      { workerUsername: username },
      {
        $set: {
          workerEmail: email,
          workerFirstName: firstname,
          workerLastName: lastname,
          address: address,
          workerPhonenum: phonenum,
          workerAge: age,
          location: location,
        },
      }
    );

    console.log(worker);
    res.status(200).json({ data: user, message: "User details updated" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};
//delete favorite worker
const deletefavoriteworker = async (req, res) => {
  console.log("\nremove favourite worker api hit\n");
  try {
    const favoriteworkerid = req.params.id;
    const userName = req.params.username;
    // let result = await User.findOneAndUpdate(
    //   {
    //     username: userName,
    //   },
    //   {
    //     $pull: {
    //       favouriteWorkers: {
    //         id: favoriteworkerid,
    //       },
    //     },
    //   }
    // );
    const result = await User.findOne({ username: userName });
    result.favouriteWorkers.pull(favoriteworkerid);
    await result.save();
    console.log(result);
    if (!result) {
      res.status(401).json({ error: "failed to delete favourite worker" });
    } else {
      res.status(401).json({ data: result });
    }
  } catch (err) {
    console.log("error while deleting favourite user");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getUserInfo = getUserWithEmail;
exports.createAccount = addUser;
exports.resetPassword = resetPassword;
exports.getUserDetail = getUserDetail;
exports.addfavoriteworker = addfavoriteworker;
exports.deletefavoriteworker = deletefavoriteworker;
exports.updateUser = updateUser;
