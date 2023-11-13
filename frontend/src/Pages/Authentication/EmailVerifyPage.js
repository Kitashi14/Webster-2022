import { useRef } from "react";
import { useNavigate } from "react-router-dom";
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
      <div className="flex justify-center mt-12">
        <div className="bg-white p-5 mb-2 rounded-lg border">
          <div className="mb-4">
            <h1 className="px-8 text-3xl text-center font-bold text-red-500 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
              Sign Up Email Verification
            </h1>
          </div>

          <form className="px-10 pt-6 pb-8 bg-white rounded mb-2 d-flex flex-column">
            <h2 className="pt-4 mb-2 text-sm">Enter your email</h2>
            <div className="mb-4">
              <label
                className="block text-sm font-bold text-gray-700"
                htmlFor="password"
              ></label>
              <input
                className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Enter your email..."
                ref={emailInputRef}
                required
              />
            </div>

            <div className="mb-2 mt-8 text-center">
              <button
                className="w-32 px-4 py-2 font-bold text-white bg-red-500 rounded-full hover:bg-red-700 focus:outline-none focus:shadow-outline"
                type="button"
                onClick={submitButtonHandler}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EmailVerifyPage;
