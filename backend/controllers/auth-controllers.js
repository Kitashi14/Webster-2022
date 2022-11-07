//querystring used for formatting in url-encoded form
const querystring = require("querystring");

//axios for sending api requests
const axios = require("axios");

//for creating jwt token
const jwt = require("jsonwebtoken");

//for hashing password
const bcrypt = require("bcryptjs");

//importing function
const { getUserInfo } = require("./user-controllers");

const redirectURI = process.env.GOOGLE_AUTH_REDIRECT_URI;

//for getting url of google authentication page
const googleAuthPage = async (req, res, next) => {
  console.log("\n", "google auth page request hit");

  //return google auth link
  function getGoogleAuthURL() {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
      redirect_uri: `${process.env.SERVER_ROOT_URI}/${redirectURI}`,
      client_id: process.env.GOOGLE_CLIENT_ID,
      access_type: "offline",
      response_type: "code",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ].join(" "),
    };

    return `${rootUrl}?${querystring.stringify(options)}`;
  }
  console.log("\n", "sending googleAuthPage link");
  return res.status(200).json({ url: getGoogleAuthURL() });
};

//fetching google user data (for login and creating account)
const redirectGoogleEmail = async (req, res, next) => {
  console.log("\n", "redirect api hit");
  console.log("\n", "got the user code of the google user");

  //code of user got after redirecting google auth page
  const code = req.query.code;

  //fetching access token and id token of user form google server with user code
  function getTokens({ code, clientId, clientSecret, redirectUri }) {
    const url = "https://oauth2.googleapis.com/token";
    const values = {
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    };

    return axios
      .post(url, querystring.stringify(values), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((res) => {
        console.log("\n", "got the access-token of the google user");
        return res.data;
      })
      .catch((error) => {
        console.error(`\nFailed to axios auth tokens`);
        console.log("\n", error.message);
        const response = { error: "Google Authentication error" };
        res.status(500).json(response);
      });
  }
  const { id_token, access_token } = await getTokens({
    code,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: `${process.env.SERVER_ROOT_URI}/${redirectURI}`,
  });

  // Fetch the user's profile with the access token and bearer
  const googleUser = await axios
    .get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    )
    .then((res) => {
      console.log("\n", "got the user data from google auth");
      return res.data;
    })
    .catch((error) => {
      console.error(`\nFailed to axios user`);
      console.log("\n", error.message);
      const response = { error: "Failed to find user data" };
      res.status(500).json(response);
    });

  console.log("\n", "checking if the user exist");
  //check if a user exist with this google email
  const existingUser = await getUserInfo(googleUser.email);

  console.log("\n", "existingUser : ", existingUser);

  //if doesn't exist then redirect to create account page
  if (!existingUser) {
    console.log("\n", "user is new");
    const userData = {
      userEmail: googleUser.email,
      isVerified: googleUser.verified_email,
      isGoogleVerified: true,
    };

    //creating jwt token
    const token = jwt.sign(userData, process.env.JWT_SECRET);

    //sending cookies to client side
    console.log("\ncreating email token");
    res.cookie(process.env.EMAIL_COOKIE_NAME, token, {
      expires: new Date(Date.now() + 60 * 60 * 1000), //milliseconds
      httpOnly: true,
      secure: false,
    });
    console.log("\n", "redirecting to create account page with email token");
    res.redirect(`${process.env.UI_ROOT_URI}/createAccount`);
  }

  //if exist then redirect to home page with login
  else {
    console.log("\nUser exists");
    const userData = {
      userEmail: existingUser.email,
      userName: existingUser.username,
      password: existingUser.password,
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      isGoogleVerified: existingUser.isGoogle,
      phonenum: existingUser.phonenum,
      professions: existingUser.professions,
    };

    //creating jwt token
    const token = jwt.sign(userData, process.env.JWT_SECRET);

    //sending cookies to client side
    console.log("\nCreating login token");
    res.cookie(process.env.LOGIN_COOKIE_NAME, token, {
      maxAge: 10 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
    });
    console.log("\nredirecting to home page with login token");
    res.redirect(`${process.env.UI_ROOT_URI}`);
  }
};

const createOtp = async (req, res, next) => {};

const verifyOpt = async (req, res, next) => {};

const changePassword = async (req, res, next) => {};

//verify login token whenever recieved
const verifyLoginToken = async (req, res, next) => {
  let login_token;

  //access login token
  try {
    console.log("\nstoring access token");
    login_token = req.cookies[process.env.LOGIN_COOKIE_NAME];

    if (!login_token) throw Error("Session expired");
  } catch (error) {
    console.log("\nFailed to access login token");
    console.log("\n", error.message);
    const response = { error: "login token expired" };

    res.status(400).json(response);
  }

  //decoding login token received as cookie
  try {
    console.log("\ndecoding login token");
    const decoded_login_token = jwt.verify(login_token, process.env.JWT_SECRET);

    console.log("\ndecoded", decoded_login_token);

    //sendign response with userData
    const userData = {
      userEmail: decoded_login_token.userEmail,
      userName: decoded_login_token.userName,
      firstName: decoded_login_token.firstName,
      lastName: decoded_login_token.lastName,
      isGoogleVerified: decoded_login_token.isGoogleVerified,
      phonenum: decoded_login_token.phonenum,
      professions: decoded_login_token.professions,
    };
    console.log("\nsending userData");

    res.status(200).json({ userData: userData });
  } catch (error) {
    console.log("\nFailed to decode login token");
    console.log("\n", error.message);
    const response = { error: "Failed to authenticate" };

    res.status(500).json(response);
  }
};

//logout function
const authLogout = async (req, res, next) => {
  //remove login token
  console.log("\nremoving login token");
  try {
    res.clearCookie(process.env.LOGIN_COOKIE_NAME);
    console.log("\nremoved login token");
    res.status(200).json({message: "logged out"});
  } catch (err) {
    console.log(err.message);
    res.status(500).json({error: err.message});
  }
};

exports.googleAuthPage = googleAuthPage;
exports.redirectGoogleEmail = redirectGoogleEmail;
exports.verifyOpt = verifyOpt;
exports.authLogin = verifyLoginToken;
exports.authLogout = authLogout;
