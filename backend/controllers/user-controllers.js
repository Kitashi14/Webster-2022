//extracting the user modal
const User = require("../models/user");

//for creating-checking jwt token
const jwt = require("jsonwebtoken");

//for hashing password
const bcrypt = require("bcryptjs");

//for formatting date and time
const date = require("date-and-time");

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
  const {
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

  //creating newUser object
  const newUser = new User({
    username: "@" + firstName + phonenum,
    email,
    firstName,
    lastName,
    isGoogle,
    isVerified,
    password: hashedPassword,
    address,
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
    if (decoded_email_token.isCreatingAccout) {
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

exports.getUserInfo = getUserWithEmail;
exports.createAccount = addUser;
exports.resetPassword = resetPassword;
