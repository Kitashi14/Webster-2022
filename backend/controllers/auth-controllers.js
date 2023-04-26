//querystring used for formatting in url-encoded form
const querystring = require("querystring");

//axios for sending api requests
const axios = require("axios");

//nodemailer for sending otp
const nodemailer = require("nodemailer");

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_NODEMAILER,
    pass: process.env.PASSWORD_NODEMAILER,
  },
  port: 465,
  host: "smtp.gmail.com",
  // proxy: 'http://172.31.102.29:3128/'
});

//for creating-checking jwt token
const jwt = require("jsonwebtoken");

//for hashing password
const bcrypt = require("bcryptjs");

//importing function and Token modal
const { getUserInfo } = require("./user-controllers");
const Token = require("../models/token");

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

  try {
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
          
          throw Error("Failed to axios auth tokens");
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
        throw Error("Failed to axios user data");
      });

      try {
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
          return;
        }
    
        //if exist then redirect to home page with login
        else {
          console.log("\nUser exists");
          const userData = {
            userEmail: existingUser.email,
            userName: existingUser.username
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
          return;
        }
      } catch (error) {
        console.log("\n", error.message);
        console.log("\nsending error");
        const response = { error: "Failed to create email token data" };
        res.status(500).json(response);
        return;
      }
  } catch (err) {
    console.log(err.message);
    console.log("\nsending error");
    res.status(500).json({error: "Google Authentication error"});
    return;
  }
  

  
};

//create otp-token for adding user and updating user-password
const createOtp = async (req, res, next) => {
  console.log("\nreceived email for otp");
  const email = req.body.email;
  const isCreatingAccount = req.body.createAccount;

  //received email for otp
  console.log(req.body);

  //for creating account
  if (isCreatingAccount) {
    console.log("\nfor creating account");
    try {
      console.log("\n", "checking if the user exist");
      //check if a user exist with this google email
      const existingUser = await getUserInfo(email);

      console.log("\n", "existingUser : ", existingUser);

      //if doesn't exist then redirect to create account page
      if (!existingUser) {
        console.log("\n", "user is new");
        const userData = {
          userEmail: email,
          isVerified: false,
          isGoogleVerified: false,
          isCreatingAccount: isCreatingAccount,
        };

        //creating jwt token
        console.log("\ncreating email token");
        const token = jwt.sign(userData, process.env.JWT_SECRET);

        console.log(token);
        //sending cookies to client side
        console.log("\ncreating and sending email-token");
        res.cookie(process.env.EMAIL_COOKIE_NAME, token, {
          expires: new Date(Date.now() + 60 * 60 * 1000), //milliseconds
          httpOnly: true,
          secure: false,
        });
        console.log("\nsent email-token for otp verification");

        try {
          console.log("\nadding new otp-token in token-list");
          let otp;

          try {
            otp = `${Math.floor(999 + Math.random() * 9000)}`;
            console.log("\ncreated otp");

            //encrypting otp using bcryptjs
            const saltRounds = 10;
            const hashedOTP = await bcrypt.hash(otp, saltRounds);
            console.log("\nhashedOtp", hashedOTP);

            //checking for previous existing otp for the same email
            const preToken = await Token.deleteMany({ email: email });

            if (preToken) {
              console.log("\notp-token for this email already exist");
              console.log(preToken);
              console.log("\ndeleting existing otp-tokens");
            }
            //creating new token
            console.log("\ncreating new otp-token for this email");
            const newToken = new Token({
              email: email,
              otp: hashedOTP,
              createdAt: Date.now(),
              expiresAt: Date.now() + 60 * 60 * 1000,
            });

            //adding new token in database
            await newToken.save();
            console.log("\nToken saved in database");
            console.log(newToken);
          } catch (err) {
            console.log(err.message);
            res.status(500).json({ error: err.message });
            return;
          }

          console.log(
            "\ncreating mail for email-verification with nodemailer\n"
          );
          // send mail with defined transport object
          transporter.sendMail(
            {
              from: process.env.EMAIL_NODEMAILER, // sender address
              to: email, // list of receivers
              subject: "Verification for Complain Box", // Subject line
              html: `<p>Enter <b>${otp}</b> to verify your email to creating your account.</p><p>This code <b>expires in 1 hour.</b></p>`, // html body
            },
            (err) => {
              if (err) {
                console.log(err);
                console.log(err.message);
                res
                  .status(501)
                  .json({ error: "Can't send otp for creating account" });
                return;
              } else {
                console.log("\nemail has been sent");
                console.log(`\nsent otp to ${email}`);

                res.status(200).json({ message: "Sent otp successfully" });
              }
            }
          );
        } catch (err) {
          console.log(err.message);
          res
            .status(501)
            .json({ error: "Can't send otp for creating account" });
        }
      }

      //if exist then send bad request response
      else {
        res.status(400).json({ error: "email already in use" });
      }
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ error: "Can't send otp for creating account" });
    }
  }
  //for forget-password request
  else {
    console.log("\nfor resetting password");
    try {
      console.log("\n", "checking if the user exist");
      //check if a user exist with this google email
      const existingUser = await getUserInfo(email);

      console.log("\n", "existingUser : ", existingUser);

      //if doesn't exist then redirect to create account page
      if (!existingUser) {
        res.status(400).json({ error: "No user exist with this email" });
        return;
      } else {
        const userData = {
          userEmail: email,
          isVerified: false,
          isGoogleVerified: false,
          isCreatingAccount: isCreatingAccount,
        };

        //creating jwt token
        console.log("\ncreating email token");
        const token = jwt.sign(userData, process.env.JWT_SECRET);

        console.log(token);
        //sending cookies to client side
        console.log("\ncreating and sending email-token");
        res.cookie(process.env.EMAIL_COOKIE_NAME, token, {
          expires: new Date(Date.now() + 60 * 60 * 1000), //milliseconds
          httpOnly: true,
          secure: false,
        });
        console.log("\nsent email-token for otp verification");

        try {
          console.log("\nadding new otp-token in token-list");
          let otp;

          try {
            otp = `${Math.floor(1000 + Math.random() * 9000)}`;
            console.log("\ncreated otp");

            //encrypting otp using bcryptjs
            const saltRounds = 10;
            const hashedOTP = await bcrypt.hash(otp, saltRounds);
            console.log("\nhashedOtp", hashedOTP);

            //checking for previous existing otp for the same email
            const preToken = await Token.deleteMany({ email: email });

            if (preToken) {
              console.log("\notp-token for this email already exist");
              console.log(preToken);
              console.log("\ndeleting existing otp-tokens");
            }
            //creating new token
            console.log("\ncreating new otp-token for this email");
            const newToken = new Token({
              email: email,
              otp: hashedOTP,
              createdAt: Date.now(),
              expiresAt: Date.now() + 60 * 60 * 1000,
            });

            //adding new token in database
            await newToken.save();
            console.log("\nToken saved in database");
            console.log(newToken);
          } catch (err) {
            console.log(err.message);
            res.status(500).json({ error: err.message });
            return;
          }

          console.log(
            "\ncreating mail for email-verification with nodemailer\n"
          );
          // send mail with defined transport object
          transporter.sendMail(
            {
              from: process.env.EMAIL_NODEMAILER, // sender address
              to: email, // list of receivers
              subject: "Verification for Complain Box", // Subject line
              html: `<p>Enter <b>${otp}</b> to verify your email for password reset.</p><p>This code <b>expires in 1 hour.</b></p>`, // html body
            },
            (err) => {
              if (err) {
                console.log(err);
                console.log(err.message);
                res
                  .status(501)
                  .json({ error: "Can't send otp for email verification" });
                return;
              } else {
                console.log("\nemail has been sent");
                console.log(`\nsent otp to ${email}`);

                res.status(200).json({ message: "Sent otp successfully" });
              }
            }
          );
        } catch (err) {
          console.log(err.message);
          res
            .status(501)
            .json({ error: "Can't send otp for email verification" });
        }
      }
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ error: "Can't send otp for email verification" });
    }
  }
};

//verifying received otp
const verifyOpt = async (req, res, next) => {
  console.log("\nreceived otp for verification");
  const receivedOtp = req.body.otp;
  console.log("\nreceivedOtp", receivedOtp);

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

  //decoding email token
  try {
    console.log("\ndecoding email-token");
    const decoded_email_token = jwt.verify(email_token, process.env.JWT_SECRET);

    console.log("\ndecoded", decoded_email_token);

    //fetching token from token-list with received email
    try {
      console.log("\nfinding otp-token for received email");
      existingToken = await Token.findOne({
        email: decoded_email_token.userEmail,
      });
    } catch (err) {
      console.log(err.message);
      res
        .status(500)
        .json({ error: "Email verification failed, please try again later" });
      return;
    }

    //when no token found
    if (!existingToken) {
      console.log("\nno otp found for this email in database");
      res.status(400).json({ error: "please send an otp request first" });
      return;
    }

    //token found for received
    console.log("\ntoken", existingToken);

    //checking expiry
    if (existingToken.expiresAt < Date.now()) {
      console.log("\nreceived expired otp");
      res.status(400).json({ error: "Opt is expired already" });
      return;
    }

    console.log("\ntoken is not expired");

    //matching otp from saved hashPassword
    async function checkHashedOtp() {
      const isMatching = await new Promise((resolve, reject) => {
        bcrypt.compare(
          receivedOtp,
          existingToken.otp,
          function (error, isMatch) {
            if (error) reject(error);
            resolve(isMatch);
          }
        );
      });

      return isMatching;
    }

    console.log("\ncomparing received otp with hashedOtp");
    const isOtpMatching = await checkHashedOtp();

    console.log("\nisOtpMatching", isOtpMatching);

    //when otp didn't matched
    if (!isOtpMatching) {
      console.log("\notp didn't matched");
      res
        .status(400)
        .json({ error: "Invalid otp, could not verify your email" });
      return;
    }

    //when otp matched
    console.log("deleting the otp-token");
    await Token.deleteMany({ email: decoded_email_token.userEmail });

    //creating jwt token
    const userData = {
      userEmail: decoded_email_token.userEmail,
      isVerified: true,
      isGoogleVerified: decoded_email_token.isGoogleVerified,
      isCreatingAccount: decoded_email_token.isCreatingAccount,
    };
    const token = jwt.sign(userData, process.env.JWT_SECRET);

    //sending cookies to client side
    console.log("\ncreating new modified email token");
    console.log("\nsending modified email-token");
    res.cookie(process.env.EMAIL_COOKIE_NAME, token, {
      expires: new Date(Date.now() + 60 * 60 * 1000), //milliseconds
      httpOnly: true,
      secure: false,
    });

    res.status(200).json({
      message: "otp matched",
      isCreatingAccount: decoded_email_token.isCreatingAccount,
    });
    return;
  } catch (error) {
    console.log("\nFailed to authenticate");
    console.log("\n", error.message);
    const response = { error: "Failed to authenticate" };

    res.status(500).json(response);
  }
};

//verify login token whenever recieved
const verifyLoginToken = async (req, res, next) => {
  console.log("\nverify login-token api hit");
  let login_token;

  //access login token
  try {
    console.log("\nstoring access token");
    login_token = req.cookies[process.env.LOGIN_COOKIE_NAME];

    if (!login_token) throw Error("\nLogin token not found");
  } catch (error) {
    console.log(error.message);
    const response = { error: "login token not found" };

    res.status(400).json(response);
    return;
  }

  //decoding login token received as cookie
  try {
    console.log("\ndecoding login token");
    const decoded_login_token = jwt.verify(login_token, process.env.JWT_SECRET);

    console.log("\ndecoded", decoded_login_token);

    const email = decoded_login_token.userEmail;

    console.log("\n", "checking if the user exist");

    //check if a user exist with this email
    let existingUser;

    try {
      existingUser = await getUserInfo(email);
    } catch (err) {
      console.log(err.message);
      res
        .status(500)
        .json({ error: "Loggin in failed, please try again later" });
      return;
    }

    //when no user exist
    if (!existingUser) {
      console.log("\nNo user exists with this email, please sign up");
      res
        .status(400)
        .json({ error: "Authentication error. Please log in again" });
      return;
    }

    //sending response with userData
    const userData = {
      userEmail: decoded_login_token.userEmail,
      userName: decoded_login_token.userName
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

//api for checking the basic login
const verifyUser = async (req, res, next) => {
  console.log("\nverifyUser login api hit");
  const { email, password } = req.body;

  console.log(req.body);

  let existingUser;

  try {
    existingUser = await getUserInfo(email);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Loggin in failed, please try again later" });
    return;
  }

  //when no user exist
  if (!existingUser) {
    console.log("\nNo user exists with this email, please sign up");
    res
      .status(400)
      .json({ error: "No user exists with this email, please sign up" });
    return;
  }

  try {
    //when user exist then check for password
    async function checkHashPassword() {
      const isMatching = await new Promise((resolve, reject) => {
        console.log(password, existingUser.password);
        bcrypt.compare(
          password,
          existingUser.password,
          function (error, isMatch) {
            if (error) reject(error);
            resolve(isMatch);
          }
        );
      });

      return isMatching;
    }

    console.log("\nchecking password");
    const isPassMatching = await checkHashPassword();
    console.log("\nisPassMatching", isPassMatching);

    //when password doesn't matches
    if (!isPassMatching) {
      console.log("\nInvalid credentials, could not log you in.");
      res
        .status(400)
        .json({ error: "Invalid credentials, could not log you in" });
      return;
    }

    //when user matches
    console.log("\nUser found");
    console.log(existingUser);

    const userData = {
      userEmail: existingUser.email,
      userName: existingUser.username,
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
    console.log("\nsent login token");

    res.status(200).json({
      message: "Logged in!",
      userData: userData,
    });
    return;
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
    return;
  }
};

//logout function
const authLogout = async (req, res, next) => {
  //remove login token
  console.log("\nremoving login token");
  try {
    res.clearCookie(process.env.LOGIN_COOKIE_NAME);
    console.log("\nremoved login token");
    res.status(200).json({ message: "logged out" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.googleAuthPage = googleAuthPage;
exports.redirectGoogleEmail = redirectGoogleEmail;
exports.verifyOpt = verifyOpt;
exports.authLogin = verifyLoginToken;
exports.authLogout = authLogout;
exports.createOtp = createOtp;
exports.verifyUser = verifyUser;
