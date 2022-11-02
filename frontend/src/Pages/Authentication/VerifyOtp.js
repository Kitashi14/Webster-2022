import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../../Components/Shared/Container";

const VerifyOTP = () => {
  const navigate = useNavigate();

  const otpInputRef = useRef();
  const submitButtonHandler = (event) => {
    event.preventDefault();

    const otp = otpInputRef.current.value;

    if (otp.length !== 6) alert("Enter a valid OTP");
    else {
      console.log(otp);

      navigate("/createAccount");
    }
  };

  return (
    <Container>
      <div>
        <input ref={otpInputRef} type="text" required />
        <label>Enter OTP</label>
      </div>
      <button onClick={submitButtonHandler}>Submit</button>
    </Container>
  );
};

export default VerifyOTP;
