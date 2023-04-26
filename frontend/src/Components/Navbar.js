import { Link } from "react-router-dom";
import React, { useContext } from "react";
import AuthContext from "../context/auth-context";

const Navbar = (props) => {
  const auth = useContext(AuthContext);
  const submitLogout = () => {
    console.log("logout function called");
    auth.logout();
  };

  return (
    <>
      <nav className=" bg-tc px-2 sm:px-4 py-2.5  dark:bg-pc">
        <div className="container flex flex-wrap justify-between items-center mx-auto">
          <a href="/" className="flex items-center">
            {/* <img src="" className="mr-3 h-6 sm:h-9" alt="Logo"> */}
            <span className="text-sc self-center text-xl font-semibold whitespace-nowrap dark:text-sc">
              Complain Box
            </span>
          </a>
          <button
            data-collapse-toggle="navbar-default"
            type="button"
            className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-default"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="flex flex-col p-4 mt-4  rounded-lg border  md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0  ">
              <li>
                <Link
                  to="/"
                  className="block py-2 pr-4 pl-3 text-white  rounded md:bg-transparent md:text-sc  hover:text-gray-500  md:p-0 dark:text-white"
                  aria-current="page"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="block py-2 pr-4 pl-3 text-sc  hover:text-gray-500  md:border-0  md:p-0 dark:text-gray-400 "
                >
                  About
                </Link>
              </li>
              <li>
                {props.login ? (
                  <>
                    <Link to={`/user/${auth.userName}`}>
                      <div className="block py-2 pr-4 pl-3 text-sc  hover:text-gray-500  md:border-0  md:p-0 dark:text-gray-400">
                        Profile
                      </div>
                    </Link>
                  </>
                ) : (
                  <></>
                )}
              </li>
              <li>
                {!props.login ? (
                  <>
                    <Link to="./login">
                      <div className="block py-2 pr-4 pl-3 text-sc  hover:text-gray-500  md:border-0  md:p-0 dark:text-gray-400">
                        Log In
                      </div>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link onClick={submitLogout}>
                      <div className="block py-2 pr-4 pl-3 text-sc  hover:text-gray-100  md:border-0  md:p-0 dark:text-gray-400">
                        Log Out
                      </div>
                    </Link>
                  </>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
