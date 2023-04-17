import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
// import Container from "../../Components/Shared/Container";

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
    else if (address.length > 500) alert("Address too long");
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
        }
      } catch (err) {
        console.log(err);
        alert("Failed to create account");

        return;
      }
    }
  };

  return (
    <>
      <div className="container mx-auto">
        <div className="flex justify-center px-6 my-12 ">
          {/* <!-- Col --> */}
          <div className="w-1/2 bg-white p-5 rounded-lg border ">
            <div className="px-8 mb-4 text-center">
              <img
                src="https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars.png"
                className="h-10 w-10 inline-block rounded-full border"
                alt=""
              />
              {/* <!-- 						<p className="mb-4 text-sm text-gray-700">
							 Enter your email address below and we'll send you a
								link to reset your password!
							</p>  --> */}
            </div>

            {/* <!-- Login  --> */}
            <div className="px-8 mb-4 text-center">
              <h2 className="pt-4 mb-2 text-2xl">Create Account</h2>
              {/* <!-- 							<p className="mb-4 text-sm text-gray-700">
							 Enter your email address below and we'll send you a
								link to reset your password!
							</p> --> */}
            </div>
            <form className="px-8 pt-6 pb-8 mb-4 bg-white rounded">
              {/* <!-- Enter Name --> */}
              <div className="mb-4">
                <label
                  className="block mb-2 text-sm font-bold text-gray-700"
                  htmlFor="email"
                >
                  First Name
                </label>
                <input
                  ref={firstNameInputRef}
                  type="text"
                  required
                  className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  id="firstname"
                  placeholder="Enter your first name..."
                />
              </div>

              {/* <!-- Enter Last Name btn --> */}
              <div className="mb-4">
                <label
                  className="block mb-2 text-sm font-bold text-gray-700"
                  htmlFor="email"
                >
                  Last Name
                </label>
                <input
                  ref={lastNameInputRef}
                  type="text"
                  className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  id="lastname"
                  placeholder="Enter your last name..."
                />
              </div>

              {/* <!-- Enter Age btn --> */}
              <div className="mb-4">
                <label
                  className="block mb-2 text-sm font-bold text-gray-700"
                  htmlFor="age"
                >
                  Age
                </label>
                <input
                  ref={ageInputRef}
                  type="number"
                  required
                  className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  id="age"
                  placeholder="Enter your age..."
                />
              </div>

              {/* <!-- Enter Address --> */}
              <div className="mb-4 large-input block text-sm font-bold text-gray-700">
                Address
                <textarea
                  ref={addressInputRef}
                  className="w-full px-3 py-2 text-sm  text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  required
                  rows="4"
                  id="address"
                  placeholder="Enter your address..."
                />
              </div>

              <input ref={locationXInputRef} type="text" required />
              <input ref={locationYInputRef} type="text" required />

              {/* <!-- Enter PhoneNo --> */}
              <div className="mb-4">
                <label
                  className="block mb-2 text-sm font-bold text-gray-700"
                  htmlFor="phoneNo"
                >
                  Phone No.
                </label>
                <input
                  ref={phonenumInputRef}
                  type="number"
                  required
                  className="w-full px-3 py-2 text-sm text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  id="phoneNo"
                  placeholder="Enter Phone no..."
                />
              </div>

              {/* <!-- Enter Password --> */}
              <div className="mb-4">
                <label
                  className="block mb-2 text-sm font-bold text-gray-700"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  ref={passwordInputRef}
                  type="password"
                  required
                  className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  id="password"
                  placeholder="Enter password..."
                />
              </div>

              {/* <!-- Confirm Password --> */}
              <div className="mb-4">
                <label
                  className="block mb-2 text-sm font-bold text-gray-700"
                  htmlFor="phoneNo"
                >
                  Confirm Password
                </label>
                <input
                  ref={confirmPasswordInputRef}
                  type="password"
                  required
                  className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  id="confirmPassword"
                  placeholder="Confirm Password..."
                />
              </div>

              {/* <!-- Create button --> */}
              <div className="mb-6 text-center">
                <button
                  onClick={submitButtonHandler}
                  className="w-full px-4 py-2 font-bold text-white bg-red-500 rounded-full hover:bg-red-700 focus:outline-none focus:shadow-outline"
                  type="button"
                >
                  Create Account
                </button>
              </div>
              
            </form>
          </div>
        </div>
      </div>
    </>

    // <Container>
    //       <form>
    //         <div>
    //           <input ref={firstNameInputRef} type="text" required />
    //           <label>First Name</label>
    //         </div>

    //         <div>
    //           <input ref={lastNameInputRef} type="text" />
    //           <label>Last Name</label>
    //         </div>

    //         <div>
    //           <input ref={ageInputRef} type="number" required />
    //           <label>Age</label>
    //         </div>

    //         <div>
    //           <input ref={addressInputRef} type="text" required />
    //           <label>Address</label>
    //         </div>
    //         <div>
    //           <input ref={phonenumInputRef} type="text" required />
    //           <label>Phone No.</label>
    //         </div>

    //         <input ref={locationXInputRef} type="text" required />
    //         <input ref={locationYInputRef} type="text" required />

    //         <div>
    //           <input ref={passwordInputRef} type="password" required />
    //           <label>Password</label>
    //         </div>

    //         <div>
    //           <input ref={confirmPasswordInputRef} type="password" required />
    //           <label>Confirm Password</label>
    //         </div>

    //         <button onClick={submitButtonHandler}>Create</button>
    //       </form>
    //     </Container>
  );
};

export default CreateAccountPage;
