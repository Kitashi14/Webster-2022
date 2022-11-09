import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../../Components/Shared/Container";

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
          else navigate("/forgotPassword");
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
    <Container>
      <form>
        <div>
          <input ref={otpInputRef} type="text" required />
          <label>Enter OTP</label>
        </div>
        <button onClick={submitButtonHandler}>Submit</button>
      </form>
    </Container>
  );
};

export default VerifyOTP;
