/** @format */

import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MapForm from "../../Components/mapForm";
import { toast } from "react-toastify";
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

  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);

  const setCoordinates = (lat, long) => {
    setLat(lat);
    setLong(long);
  };

  const submitCooridnates = (lat, long) => {
    var correct = false;
    if (!lat || !long) {
      toast.error("Both fields are required to be filled.");
    } else if (lat < -90 || lat > 90) {
      toast.error("Latitude value out of range.");
    } else if (long < -180 || long > 180) {
      toast.error("Longitude value out of range.");
    } else {
      correct = true;
      console.log(lat, long);
    }
    if (correct) {
      return {
        lat,
        long,
      };
    } else return false;
  };

  const submitButtonHandler = async (event) => {
    event.preventDefault();

    const age = ageInputRef.current.value;

    const password = passwordInputRef.current.value;
    const confirmPassword = confirmPasswordInputRef.current.value;
    const firstName = firstNameInputRef.current.value;
    const lastName = lastNameInputRef.current.value;
    const address = addressInputRef.current.value;
    const phonenum = phonenumInputRef.current.value;

    if (firstName.length === 0 || firstName.length > 50)
      alert("Enter a valid first name");
    else if (lastName.length > 50) alert("Enter a valid last name");
    else if (age < 5 || age > 140) alert("Enter a valid age");
    else if (address.length < 5) alert("Enter a valid address");
    else if (address.length > 500) alert("Address too long");
    else if (phonenum.length !== 10) alert("Phone no. should be of 10 digits");
    else if (password.length < 8)
      alert("Password must be of at least 8 characters");
    else if (password !== confirmPassword)
      alert("Confirmed password doesn't matches");
    else {
      const coordinates = submitCooridnates(lat, long);
      if (!coordinates) return;
      const locationX = coordinates.lat;
      const locationY = coordinates.long;

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-6 text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Create Account
              </h2>
              <p className="text-primary-100">
                Join Webster to connect with skilled workers
              </p>
            </div>
            <form className="p-8 space-y-6">
              {/* Personal Information Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-medium text-slate-700 mb-2"
                      htmlFor="firstname"
                    >
                      First Name *
                    </label>
                    <input
                      ref={firstNameInputRef}
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                      id="firstname"
                      placeholder="Enter your first name"
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium text-slate-700 mb-2"
                      htmlFor="lastname"
                    >
                      Last Name
                    </label>
                    <input
                      ref={lastNameInputRef}
                      type="text"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                      id="lastname"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-medium text-slate-700 mb-2"
                      htmlFor="age"
                    >
                      Age *
                    </label>
                    <input
                      ref={ageInputRef}
                      type="number"
                      required
                      min="5"
                      max="140"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                      id="age"
                      placeholder="Enter your age"
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium text-slate-700 mb-2"
                      htmlFor="phoneNo"
                    >
                      Phone Number *
                    </label>
                    <input
                      ref={phonenumInputRef}
                      type="tel"
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                      id="phoneNo"
                      placeholder="Enter 10-digit phone number"
                    />
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Address Information
                </h3>

                <div>
                  <label
                    className="block text-sm font-medium text-slate-700 mb-2"
                    htmlFor="address"
                  >
                    Address *
                  </label>
                  <textarea
                    ref={addressInputRef}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 resize-none"
                    required
                    rows="3"
                    id="address"
                    placeholder="Enter your complete address"
                  />
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Location on Map *
                  </label>
                  <MapForm
                    setCoordinates={setCoordinates}
                    initialValues={{ lat: null, lng: null }}
                  />
                </div>
              </div>

              {/* Security Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Account Security
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-medium text-slate-700 mb-2"
                      htmlFor="password"
                    >
                      Password *
                    </label>
                    <input
                      ref={passwordInputRef}
                      type="password"
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                      id="password"
                      placeholder="Enter password (min. 8 characters)"
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium text-slate-700 mb-2"
                      htmlFor="confirmPassword"
                    >
                      Confirm Password *
                    </label>
                    <input
                      ref={confirmPasswordInputRef}
                      type="password"
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                      id="confirmPassword"
                      placeholder="Confirm your password"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  onClick={submitButtonHandler}
                  className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  type="button"
                >
                  Create Account
                </button>

                <div className="text-center mt-6">
                  <span className="text-slate-600">
                    Already have an account?{" "}
                  </span>
                  <Link
                    className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
                    to="/login"
                  >
                    Sign in
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateAccountPage;
