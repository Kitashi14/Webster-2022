import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../../Components/Shared/Container";
import { ValidateEmail } from "../../Helper/EmailHelper";

const EmailVerifyPage = () => {
  console.log("Email Verification Page");

  const navigate = useNavigate();

  const emailInputRef = useRef();

  const submitButtonHandler = async (event) => {
    event.preventDefault();
    const Email = emailInputRef.current.value;

    if(!ValidateEmail(Email)) alert("Enter a Valid Email!");
    else{
        console.log(Email);
        navigate("/verifyOtp")
    }
  };

  return (
    <Container>
      <form method="post">
        <div>
          <input type="email" ref={emailInputRef} required />
          <label>Email</label>
        </div>
        <button onClick={submitButtonHandler}>Enter</button>
      </form>

      
    </Container>
  );
};

export default EmailVerifyPage;
