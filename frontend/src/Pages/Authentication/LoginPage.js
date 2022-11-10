import React, { useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "../../Components/Shared/Container";
import AuthContext from "../../context/auth-context";
import { ValidateEmail } from "../../Helper/EmailHelper";

const LoginPage = () => {
  console.log("login page");
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const sumbitLoginButtonHandler = async () => {
    const email = emailInputRef.current.value;
    const password = passwordInputRef.current.value;

    if (!ValidateEmail(email)) alert("Enter a Valid Email!");
    else if (password.length ===0)
      alert("Enter password");
    else {
      try {
        const userData = {
          email,
          password,
        };

        const response = await fetch(
          `${process.env.REACT_APP_SERVER_ROOT_URI}/api/auth/login`,
          {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify(userData),
            credentials: "include",
          }
        );

        console.log(response.status);

        const responseData = await response.json();

        if (response.status === 200) {
          console.log(responseData.message);
          auth.login(responseData.userData);
          navigate("/");
          return;
        } else if (response.status === 400) {
          console.log(responseData.error);
          alert(responseData.error);
        } else {
          throw Error("Couldn't able to login");
        }
      } catch (err) {
        console.log(err);
        alert("Failed to login");
      }
    }
  };

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
      alert("Looks like there is some issue. Can't login with Google :(");
    }
  };

  var enteredEmail;
  var isButtonOn = true;

  const sumbmitForgetPass = async (event) => {
    event.preventDefault();
    const email = emailInputRef.current.value;

    if (!ValidateEmail(email)) alert("Enter a Valid Email!");
    else {
      if (enteredEmail === email && !isButtonOn) {
        alert("Requesting for otp to verify email");
        return;
      }

      enteredEmail = email;
      isButtonOn = false;

      try {
        const data = {
          email: email,
          createAccount: false,
        };
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_ROOT_URI}/api/auth/getOtp`,
          {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify(data),
            credentials: "include",
          }
        );
        isButtonOn = true;

        console.log(response.status);
        const responseData = await response.json();

        if (response.status === 200) {
          console.log(responseData.message);
          alert("OTP sent to your email");
          navigate("/verifyOtp");
        } else if (response.status === 400) {
          console.log(responseData.error);
          alert(responseData.error);
        } else {
          throw Error("couldn't able to send otp");
        }
      } catch (err) {
        console.log(err);
        alert("Failed to send otp");
      }
    }
  };
  return (
    <>
      <Container>
        <div className=" relative ">
          <input
            type="email"
            id="email"
            ref={emailInputRef}
            className=" flex-1 w-1/2 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            placeholder="Your email"
            required
          />
          <label>Email</label>
        </div>
        <br />
        <div>
          <input type="password" ref={passwordInputRef} required />
          <label>Password</label>
        </div>
        <button onClick={sumbmitForgetPass}>forgot password</button><br/>

        <button onClick={sumbitLoginButtonHandler}>Login</button>

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
