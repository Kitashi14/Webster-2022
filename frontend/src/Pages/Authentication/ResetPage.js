import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../../Components/Shared/Container";

const ResetPage = () => {
  console.log("reset password page");
  const navigate = useNavigate();

  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();

  const resetButtonHandler = async () => {
    const password = passwordInputRef.current.value;
    const confirmPassword = confirmPasswordInputRef.current.value;

    if (password.length < 8) alert("Password must be of at least 8 characters");
    else if (password !== confirmPassword)
      alert("Confirmed password doesn't matches");
    else {
      const data = {
        password,
      };

      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_ROOT_URI}/api/user/resetPassword`,
          {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify(data),
            credentials: "include",
          }
        );

        const responseData = await response.json();

        console.log("response status:", response.status);

        if (response.status === 200) {
          console.log(responseData.message);
          alert("Password reset done. Please login.");
          navigate("/login");
          return;
        } else if (response.status === 400) {
          console.log(responseData.error);
          alert(responseData.error);
        } else {
          console.log(responseData.error);
          alert("Looks like there is some issue. Please verify again.");
          navigate("/verifyEmail");
        }
      } catch (err) {
        console.log(err);
        alert("Couldn't able to reset password");
      }
    }
  };

  return (
    <>
      <Container>
        <div>
          <input type="password" ref={passwordInputRef} />
          <label>New Password</label>
        </div>
        <br />
        <div>
          <input type="password" ref={confirmPasswordInputRef} />
          <label>Confirm Password</label>
        </div>
        <button onClick={resetButtonHandler}>Reset</button>
      </Container>
    </>
  );
};

export default ResetPage;
