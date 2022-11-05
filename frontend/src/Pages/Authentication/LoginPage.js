import React from "react";
import { Link } from "react-router-dom";
import Container from "../../Components/Shared/Container";

const LoginPage = () => {
  console.log("login page");

  const loginGoogleButtonHandler = async () => {
    try {
      console.log("fetching google auth link");
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_ROOT_URI}/api/auth/googleAuthlink`
      );

      const responseData = await response.json();

      const googleAuthUrl = responseData.url;

      window.location.replace(googleAuthUrl);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <Container>
        <div class=" relative ">
          <input
            type="email"
            id="email"
            class=" flex-1 w-1/2 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            placeholder="Your email"
            required
          />
          <label>Email</label>
        </div>
        <br />
        <div>
          <input type="password" required />
          <label>Password</label>
        </div>

        <div>
          <Link to="/verifyEmail">Create Account</Link>
        </div>
        <div>
          <button onClick={loginGoogleButtonHandler}>Login with Google</button>
        </div>
      </Container>
    </>
  );
};

export default LoginPage;
