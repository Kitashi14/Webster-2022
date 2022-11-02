const querystring = require('querystring');

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

}

const loginVerifyEmailGoogle = async (req,res, next) =>{

};

exports.googleAuthPage = googleAuthPage;
exports.redirectGoogleEmail = redirectGoogleEmail;
exports.loginVerifyEmailGoogle = loginVerifyEmailGoogle;

