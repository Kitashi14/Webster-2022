import { useRef } from "react";
import { useNavigate } from "react-router-dom";
// import Container from "../../Components/Shared/Container";

const VerifyOtp = () => {
  const navigate = useNavigate();

  const otpInputRef = useRef();

  const submitButtonHandler = async (event) => {
    event.preventDefault();

    const otp = otpInputRef.current.value;

    if (otp.length !== 4) alert("Enter a valid OTP");
    else {
      console.log(otp);

      try {
        console.log("got otp");
        const data = JSON.stringify({
          otp,
        });

        const response = await fetch(
          `${process.env.REACT_APP_SERVER_ROOT_URI}/api/auth/verifyOtp`,
          {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: data,
            credentials: "include",
          }
        );

        const responseData = await response.json();
        console.log("response status:", response.status);

        if (response.status === 200) {
          console.log(responseData.message);
          console.log(responseData.isCreatingAccount);
          if (responseData.isCreatingAccount) navigate("/createAccount");
          else navigate("/resetPassword");
          return;
        } else if (response.status === 400) {
          console.log(responseData.error);
          alert(responseData.error);
          return;
        } else {
          console.log(responseData.error);
          alert("Looks like there is some issue. Please verify again.");
          navigate("/verifyEmail");
        }
      } catch (err) {
        console.log(err);
        alert("can't verify OTP");
        return;
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
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Verify OTP
              </h2>
              <p className="text-slate-600">
                Enter the 4-digit code sent to your email
              </p>
            </div>

            <form className="space-y-6">
              <div>
                <label
                  className="block text-sm font-medium text-slate-700 mb-2"
                  htmlFor="otp"
                >
                  Verification Code
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
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    ref={otpInputRef}
                    type="text"
                    required
                    maxLength="4"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 text-center text-lg font-semibold tracking-widest"
                    id="otp"
                    placeholder="_ _ _ _"
                  />
                </div>
              </div>

              <button
                onClick={submitButtonHandler}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                type="button"
              >
                Verify Code
              </button>

              <div className="text-center mt-6">
                <span className="text-slate-600">
                  Didn't receive the code?{" "}
                </span>
                <button
                  type="button"
                  className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
                >
                  Resend
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyOtp;
