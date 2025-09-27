import React, { useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
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
    else if (password.length === 0) alert("Enter password");
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
        alert("Requesting for otp to verify email. Please wait!");
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

        console.log(response.status);
        const responseData = await response.json();
        isButtonOn = true;

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Welcome back
              </h2>
              <p className="text-slate-600">
                Sign in to your account to continue
              </p>
            </div>

            <form className="space-y-6">
              {/* Email Field */}
              <div>
                <label
                  className="block text-sm font-medium text-slate-700 mb-2"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <input
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                  id="email"
                  type="email"
                  ref={emailInputRef}
                  placeholder="Enter your email address"
                />
              </div>

              {/* Password Field */}
              <div>
                <label
                  className="block text-sm font-medium text-slate-700 mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                  id="password"
                  ref={passwordInputRef}
                  type="password"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
                  onClick={sumbmitForgetPass}
                >
                  Forgot your password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="button"
                className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                onClick={sumbitLoginButtonHandler}
              >
                Sign In
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-500">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google Login */}
              <button
                type="button"
                className="w-full flex items-center justify-center px-4 py-3 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                onClick={loginGoogleButtonHandler}
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2048px-Google_%22G%22_Logo.svg.png"
                  className="w-5 h-5 mr-3"
                  alt="Google"
                />
                <span className="text-slate-700 font-medium">
                  Sign in with Google
                </span>
              </button>

              {/* Sign Up Link */}
              <div className="text-center mt-6">
                <span className="text-slate-600">Don't have an account? </span>
                <Link
                  className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
                  to="/verifyEmail"
                >
                  Sign up
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
