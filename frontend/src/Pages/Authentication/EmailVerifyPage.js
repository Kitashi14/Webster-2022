import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
// import Container from "../../Components/Shared/Container";
import { ValidateEmail } from "../../Helper/EmailHelper";

const EmailVerifyPage = () => {
  console.log("Email Verification Page");

  const navigate = useNavigate();

  var enteredEmail;
  var isButtonOn = true;

  const submitButtonHandler = async (event) => {
    event.preventDefault();
    const email = emailInputRef.current.value;

    if (!ValidateEmail(email)) alert("Enter a Valid Email!");
    else {
      if (enteredEmail === email && !isButtonOn) {
        alert("Requesting for otp. Please wait!");
        return;
      }

      enteredEmail = email;
      isButtonOn = false;

      try {
        const data = {
          email: email,
          createAccount: true,
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

  const emailInputRef = useRef();
  // const [submitButtonHandler, setSubmitButtonHandler] =
  //   useState(submitFunction);

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
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Verify your email
              </h2>
              <p className="text-slate-600">
                We'll send you a verification code to get started
              </p>
            </div>

            <form className="space-y-6">
              <div>
                <label
                  className="block text-sm font-medium text-slate-700 mb-2"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                  <input
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    ref={emailInputRef}
                    required
                  />
                </div>
              </div>

              <button
                className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                type="button"
                onClick={submitButtonHandler}
              >
                Send Verification Code
              </button>

              <div className="text-center mt-6">
                <span className="text-slate-600">
                  Already have an account?{" "}
                </span>
                <Link
                  className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
                  to="/login"
                >
                  Sign in
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmailVerifyPage;
