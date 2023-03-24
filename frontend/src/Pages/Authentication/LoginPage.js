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
      <Container>
        
		<div className="container mx-auto">
			<div className="flex justify-center px-6 my-12 ">
				
					{/* <!-- Col --> */}
					<div className="w-1/2 bg-white p-5 rounded-lg border ">
            <div className="px-8 mb-4 text-center">
							<img src="https://qotoqot.com/sad-animations/img/100/insomnia/insomnia.png"  alt=' ' className="inline-block rounded-full border" />
{/* <!-- 						<p className="mb-4 text-sm text-gray-700">
							 Enter your email address below and we'll send you a
								link to reset your password!
							</p>  --> */}
						</div>
            
            {/* <!-- Login btn --> */}
						<div className="px-8 mb-4 text-center">
							<h2 className="pt-4 mb-2 text-2xl">Log In</h2>
{/* <!-- 							<p className="mb-4 text-sm text-gray-700">
							 Enter your email address below and we'll send you a
								link to reset your password!
							</p> --> */}
						</div>
						<form className="px-8 pt-6 pb-8 mb-4 bg-white rounded">
              
              {/* <!-- Enter Email btn --> */}
							<div className="mb-4">
								<label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="email">
									Email
								</label>
								<input
									className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
									id="email"
									type="email"
                  ref={emailInputRef}
									placeholder="Enter Email Address..."
								/>
							</div>
        
              {/* <!--Enter Password --> */}
              	<div className="mb-6">
								<label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="password">
									Password
								</label>
								<input
									className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
									id="password"
                  
                  ref={passwordInputRef}
									type="password"
									placeholder="Enter password..."
								/>
                 <button
									className="ml-1  p-2 inline-block text-sm text-blue-500 align-baseline hover:text-blue-800 px-2 py-2 font-semibold  bg-white shadow-sm"
									
                  onClick={sumbmitForgetPass}
								>
									 Forget Password?
								</button>
							
							</div>
              
              {/* <!-- Log iN button --> */}
							<div className="mb-6 text-center">
								<button
									className="w-full px-4 py-2 font-bold text-white bg-red-500 rounded-full hover:bg-red-700 focus:outline-none focus:shadow-outline"
									type="button"
                  onClick={sumbitLoginButtonHandler}
								>
									Log IN
								</button>
							</div>
							<hr className="mb-6 border-t" />
							<div className="text-center mb-2">
								Sign in with
                <button
									className="inline-block text-sm text-blue-500 align-middle hover:text-blue-800"
                  onClick={loginGoogleButtonHandler}
								>
									 <img  src="https://qotoqot.com/sad-animations/img/100/sigh/sigh.png" className="h-6 rounded-full border mx-2 w-6 d-flex" alt=''/>
								</button>
							</div>
							<div className="text-center">
								Create Account<Link
									className="ml-1  p-2 inline-block text-sm text-blue-500 align-baseline hover:text-blue-800 px-2 py-2 font-semibold bg-white   shadow-sm"
									to="/verifyEmail"
								>
									 Sign Up
								</Link>
							</div>
						</form>
					</div>
				
			</div>
		</div>
      </Container>
    </>
  );
};

export default LoginPage;
