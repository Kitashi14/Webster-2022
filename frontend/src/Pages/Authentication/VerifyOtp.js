import { useRef } from "react";
import { useNavigate } from "react-router-dom";
// import Container from "../../Components/Shared/Container";

const VerifyOTP = () => {
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
       

<div class="container mx-auto">
  <div class="flex justify-center mb-2 px-6 my-12 ">
    
      {/* <!-- Col --> */}
      <div class="w-1/2 bg-white p-5 mb-2 rounded-lg border ">
        <div class="mb-4">
          <h1 class=" text-center text-xl pt-4 mb-2">Verify OTP</h1>
        </div>
          
        <form class="px-8 pt-6 pb-8 bg-white rounded mb-2 d-flex flex-column">
          <h2 class="pt-4 mb-2 text-sm"><em>Enter 4 digit code sent to your email</em></h2>
          <div class="mb-4">
            <label class="block text-sm font-bold text-gray-700" for="password">

            </label>
            <input
            ref={otpInputRef} type="text" required 
              class="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              id="otp"
              
              placeholder="Enter OTP..."
            />
          </div>

          <div class="mb-2 text-center">
            <button
            onClick={submitButtonHandler}
              class="w-full px-4 py-2 font-bold text-white bg-red-500 rounded-full hover:bg-red-700 focus:outline-none focus:shadow-outline"
              type="button"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    
  </div>
</div>

    </>
  );
};

export default VerifyOTP;
