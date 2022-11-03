const querystring = require('querystring');
const axios = require("axios");
const jwt = require("jsonwebtoken");

const redirectURI = process.env.GOOGLE_AUTH_REDIRECT_URI;

const googleAuthPage = async (req,res,next) =>{
    console.log("google auth page request hit");
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

      return res.redirect(getGoogleAuthURL());

}

const redirectGoogleEmail = async (req,res,next) =>{

    console.log("redirect api hit");
    function getTokens({
        code,
        clientId,
        clientSecret,
        redirectUri,
      }) {
        /*
         * Uses the code to get tokens
         * that can be used to axios the user's profile
         */
        const url = "https://oauth2.googleapis.com/token";
        const values = {
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        };
      
        return axios
          .post(url,querystring.stringify(values), {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          })
          .then((res) =>{
            return res.data;
          })
          .catch((error) => {
            console.error(`Failed to axios auth tokens`);
            throw new Error(error.message);
          });
    }

    const code = req.query.code;

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
      return res.data;
    })
    .catch((error) => {
      console.error(`Failed to axios user`);
      throw new Error(error.message);
    });

    const userData = {
        userEmail: googleUser.email,
        isVerified : googleUser.verified_email,
        isGoogleVerified : true
    }

    const token = jwt.sign(userData, process.env.JWT_SECRET);

  res.cookie("email token", token, {
    maxAge: 900000,
    httpOnly: true,
    secure: false,
  });

    res.redirect(`${process.env.UI_ROOT_URI}/createAccount`);


}

const loginVerifyEmailGoogle = async (req,res, next) =>{

};

exports.googleAuthPage = googleAuthPage;
exports.redirectGoogleEmail = redirectGoogleEmail;
exports.loginVerifyEmailGoogle = loginVerifyEmailGoogle;

