import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../../Components/Shared/Container";
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

      if(enteredEmail === email && !isButtonOn){
        alert("Requesting for otp");
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

  const emailInputRef = useRef();
  // const [submitButtonHandler, setSubmitButtonHandler] =
  //   useState(submitFunction);

  return (
    <Container>
      {/* <form method="post"> */}
      <div>
        <input type="email" id="email" ref={emailInputRef} required />
        <label>Email</label>
      </div>
      <button onClick={submitButtonHandler}>Enter</button>
      {/* </form> */}
    </Container>
  );
};

export default EmailVerifyPage;
