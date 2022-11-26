import React, { useContext, useRef } from "react";
import {  useNavigate } from "react-router-dom";
import AuthContext from "../context/auth-context";

import { profession } from "../Helper/Profession";

const Form = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const titleInputRef = useRef();
  const descriptionInputRef = useRef();
  const professionInputRef = useRef();
  const addressInputRef = useRef();
  const phonenumInputRef = useRef();
  const locationXInputRef = useRef();
  const locationYInputRef = useRef();

  const submitButtonHandler = async (event) => {
    event.preventDefault();

    const title = titleInputRef.current.value;
    const description = descriptionInputRef.current.value;
    const address = addressInputRef.current.value;
    const phonenum = phonenumInputRef.current.value;
    const profession = professionInputRef.current.value;

    if (address.length < 5) alert("Enter a valid address");
    else if (address.length > 500) alert("Address too long");
    else if (phonenum.length !== 10) alert("Phone no. should be of 10 digits");
    else if (title.length === 0) alert("Enter a title");
    else if (description.length > 1000) alert("Description too long");
    else if (profession === "select") alert("Select a profession");
    else {
      const locationX = locationXInputRef.current.value;
      const locationY = locationYInputRef.current.value;
      const creationTime = new Date(Date.now());

      const data = {
        title,
        description,
        profession,
        address,
        phonenum,
        locationX,
        locationY,
        creationTime,
      };
      console.log(data);
      try {
        console.log("got complain data");
        const complainData = JSON.stringify(data);

        const response = await fetch(
          `${process.env.REACT_APP_SERVER_ROOT_URI}/api/complain/add`,
          {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: complainData,
            credentials: "include",
          }
        );

        const responseData = await response.json();
        console.log("response status:", response.status);

        if (response.status === 200) {
          console.log(responseData.message);
          alert("Complain added");
          // navigate(`/complain/${responseData.data.complainId}`);
          navigate('/');
          return;
        } else if (response.status === 422) {
          console.log(responseData.error);
          alert(responseData.error);
        } else {
          console.log(responseData.error);
          alert("Looks like there is some issue.");
        }
      } catch (err) {
        console.log(err);
        alert("Failed to register complain");
        return;
      }
    }
  };

  let optionItems = profession.map((item) => (
    <option value={item.name} key={item.name}>
      {item.name}
    </option>
  ));

  return (
    <div className="container mx-auto">
      <div className="flex justify-center px-6 my-6 ">
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

          {/* <!-- complain  --> */}
          <div className="px-8 mb-4 text-center">
            <h2 className="pt-4 mb-2 text-2xl leading-tight">Complain Form</h2>
            {/* <!-- 							<p className="mb-4 text-sm text-gray-700">
           Enter your email address below and we'll send you a
            link to reset your password!
          </p> --> */}
          </div>
          <form className="px-8 pt-6 pb-8 mb-4 bg-white rounded">
            {/* <!-- Enter Title --> */}
            <div className="mb-4">
              <label
                className="block mb-2 text-sm font-bold text-gray-700"
                htmlFor="email"
              >
                Title
              </label>
              <input
                type="text"
                required
                ref={titleInputRef}
                className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline focus:border-blue-400"
                id="title"
                placeholder="Title of complain..."
              />
            </div>

            {/* <!-- Enter Description --> */}
            <div className="mb-4">
              <label
                className="block mb-2 text-sm font-bold text-gray-700"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                type="text"
                row="10"
                ref={descriptionInputRef}
                className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline focus:border-blue-400"
                id="description"
                placeholder="Write your description..."
              />
            </div>

            {/* <div className="grid grid-cols-2 grid-flow-row md:grid-flow-col d-flex md:flex-col-1 w-full justify-between mb-4"> */}
            {/* <!-- Enter profession --> */}

            <div className="mb-4">
              <label
                className="block mb-2 text-sm font-bold text-gray-700"
                htmlFor="profession"
              >
                Profession
              </label>
              <select
                className="block md:w-1/2 w-full form-controls place-content-center  text-center border-2 border-black rounded-md p-1 focus:border-blue-400 focus:outline-none"
                name="Professions"
                id="Professions"
                ref={professionInputRef}
                defaultValue="select"
              >
                <option value="select"> --Select Profession--</option>
                {optionItems}
              </select>
              {/* <button
              type="dropbox" required
              className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              id="profession"
              
            /> */}
            </div>

            {/* <!-- Enter Phone no --> */}
            <div className="mb-4 large-input block text-sm font-bold text-gray-700">
              <label
                className="block mb-2 text-sm font-bold text-gray-700"
                htmlFor="phoneno"
              >
                Phone No.
              </label>
              <input
                className="w-full px-3 py-2 text-sm  text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline focus:border-blue-400 "
                required
                type="number"
                ref={phonenumInputRef}
                id="phoneno"
                placeholder="Enter your phone no..."
                defaultValue={auth.user.phonenum}
              />
            </div>
            <input ref={locationXInputRef} className="invisible" type="text" required />
            <input className="invisible" ref={locationYInputRef} type="text" required />

            {/* <!--Forget Password --> */}
            {/* <div className="mb-6">
        <Link
          className="ml-1  p-2 inline-block text-sm text-blue-500 align-baseline hover:text-blue-800 px-2 py-2 font-semibold  bg-white shadow-sm"
          to="/forgetPassword"
          // onClick={forgetPassword}
        >
          Forget Password?
        </Link>

      </div> */}

            {/* <!-- Enter Description --> */}
            <div className="mb-4">
              <label
                className="block mb-2 text-sm font-bold text-gray-700"
                htmlFor="address"
              >
                Address
              </label>
              <textarea
                type="text"
                row="10"
                ref={addressInputRef}
                className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline focus:border-blue-400"
                id="description"
                placeholder="Your Address..."
                defaultValue={auth.user.address}
              />
            </div>

            {/* <!-- Create button --> */}
            <div className="mb-2 text-center">
              <button
                onClick={submitButtonHandler}
                className="w-full px-4 py-2 font-bold text-white bg-red-500 rounded-full hover:bg-red-700 focus:outline focus:shadow-outline "
                type="button"
              >
                Register Complain
              </button>
            </div>
            {/* <hr className="mb-6 border-t" />
      <div className="text-center mb-2">
        Sign in with<a
          className="inline-block text-sm text-blue-500 align-middle hover:text-blue-800"
          href="./register.html"
        >
          <img src="https://qotoqot.com/sad-animations/img/100/sigh/sigh.png" className="h-6 rounded-full border mx-2 w-6 d-flex" alt='' />
        </a>
      </div>
      <div className="text-center">
        Create Account<a
          className="ml-1  p-2 inline-block text-sm text-blue-500 align-baseline hover:text-blue-800 px-2 py-2 font-semibold  bg-white  shadow-sm"
          href="./index.html"
        >
          Sign Up
        </a>
      </div> */}
          </form>
        </div>
      </div>
    </div>

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

export default Form;
