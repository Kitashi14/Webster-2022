import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../../Components/Shared/Container";

const CreateAccountPage = () => {
  const navigate = useNavigate();

  const firstNameInputRef = useRef();
  const lastNameInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();
  const ageInputRef = useRef();
  const addressInputRef = useRef();
  const phonenumInputRef = useRef();
  const locationXInputRef = useRef();
  const locationYInputRef = useRef();

  const submitButtonHandler = async (event) => {
    event.preventDefault();

    const age = ageInputRef.current.value;

    const password = passwordInputRef.current.value;
    const confirmPassword = confirmPasswordInputRef.current.value;
    const firstName = firstNameInputRef.current.value;
    const lastName = lastNameInputRef.current.value;
    const address = addressInputRef.current.value;
    const phonenum = phonenumInputRef.current.value;

    if (age < 5 || age > 140) alert("Enter a valid age");
    else if (password.length < 8)
      alert("Password must be of at least 8 characters");
    else if (password !== confirmPassword)
      alert("Confirmed password doesn't matches");
    else if (firstName.length === 0 || firstName.length > 50)
      alert("Enter a valid first name");
    else if (lastName.length > 50) alert("Enter a valid last name");
    else if (address.length < 5) alert("Enter a valid address");
    else if (phonenum.length !== 10) alert("Phone no. should be of 10 digits");
    else {
      const locationX = locationXInputRef.current.value;
      const locationY = locationYInputRef.current.value;

      const data = {
        firstName: firstName,
        lastName: lastName,
        password: password,
        phonenum: phonenum,
        address: address,
        age: age,
        locationX: locationX,
        locationY: locationY,
      };
      try {
        console.log("got user data");
        const userData = JSON.stringify(data);

        const response = await fetch(
          `${process.env.REACT_APP_SERVER_ROOT_URI}/api/user/createAccount`,
          {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: userData,
            credentials: "include",
          }
        );

        const responseData = await response.json();
        console.log("response status:", response.status);

        if (response.status === 200) {
          console.log(responseData.message);
          alert("Account created. Please login.");
          navigate("/login");
          return;
        } else if (response.status === 422) {
          console.log(responseData.error);
          alert(responseData.error);
        } else {
          console.log(responseData.error);
          alert("Looks like there is some issue. Please verify again.");
          navigate("/verifyEmail");
        }
      } catch (err) {
        console.log(err);
        alert("Failed to create account");
        navigate("/verifyEmail");

        return;
      }
    }
  };

  return (
    <Container>
      <form>
        <div>
          <input ref={firstNameInputRef} type="text" required />
          <label>First Name</label>
        </div>

        <div>
          <input ref={lastNameInputRef} type="text" />
          <label>Last Name</label>
        </div>

        <div>
          <input ref={ageInputRef} type="number" required />
          <label>Age</label>
        </div>

        <div>
          <input ref={addressInputRef} type="text" required />
          <label>Address</label>
        </div>
        <div>
          <input ref={phonenumInputRef} type="text" required />
          <label>Phone No.</label>
        </div>

        <input ref={locationXInputRef} type="text" required />
        <input ref={locationYInputRef} type="text" required />

        <div>
          <input ref={passwordInputRef} type="password" required />
          <label>Password</label>
        </div>

        <div>
          <input ref={confirmPasswordInputRef} type="password" required />
          <label>Confirm Password</label>
        </div>

        <button onClick={submitButtonHandler}>Create</button>
      </form>
    </Container>
  );
};

export default CreateAccountPage;
