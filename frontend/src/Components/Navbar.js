/** @format */

import { Link } from "react-router-dom";
import React, { useContext } from "react";
import AuthContext from "../context/auth-context";
import ChatContext from "../context/chatContext";

const Navbar = (props) => {
  const auth = useContext(AuthContext);
  const submitLogout = () => {
    console.log("logout function called");
    auth.logout();
  };

  const unreadUsersCount = useContext(ChatContext).chatBox.unreadUsers.size;
  console.log(unreadUsersCount);

  return (
    <>
      <nav className="bg-white shadow-lg border-b border-slate-200 px-4 sm:px-6 py-3 sticky top-0 z-50 backdrop-blur-md bg-white/95">
        <div className="container flex flex-wrap justify-between items-center mx-auto max-w-7xl">
          <a
            href="/"
            className="flex items-center space-x-3 hover:scale-105 transition-transform duration-200"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-slate-800 self-center text-xl font-bold whitespace-nowrap tracking-tight">
              Webster
            </span>
          </a>
          <button
            data-collapse-toggle="navbar-default"
            type="button"
            className="inline-flex items-center p-2 ml-3 text-sm text-slate-500 rounded-lg md:hidden hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-colors duration-200"
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
            <ul className="flex flex-col p-4 mt-4 bg-white rounded-lg border border-slate-200 md:flex-row md:space-x-1 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-transparent">
              <li>
                <Link
                  to="/"
                  className="block py-2 px-4 text-slate-700 rounded-md hover:text-primary-600 hover:bg-slate-50 transition-colors duration-200 font-medium"
                  aria-current="page"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="block py-2 px-4 text-slate-700 rounded-md hover:text-primary-600 hover:bg-slate-50 transition-colors duration-200 font-medium"
                >
                  About
                </Link>
              </li>

              {props.login ? (
                <>
                  <li>
                    <Link to={`/user/${auth.userName}`}>
                      <div className="block py-2 px-4 text-slate-700 rounded-md hover:text-primary-600 hover:bg-slate-50 transition-colors duration-200 font-medium">
                        Profile
                      </div>
                    </Link>
                  </li>
                </>
              ) : (
                <></>
              )}

              {props.login ? (
                <>
                  <li>
                    <Link to={`/chat`}>
                      <div className="block py-2 px-4 text-slate-700 rounded-md hover:text-primary-600 hover:bg-slate-50 transition-colors duration-200 font-medium relative">
                        <span>Chat</span>
                        {unreadUsersCount > 0 ? (
                          <>
                            <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1 animate-pulse">
                              {unreadUsersCount}
                            </span>
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    </Link>
                  </li>
                </>
              ) : (
                <></>
              )}
              <li>
                {!props.login ? (
                  <>
                    <Link to="./login">
                      <div className="block py-2 px-4 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors duration-200 font-medium">
                        Log In
                      </div>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link onClick={submitLogout}>
                      <div className="block py-2 px-4 text-slate-700 rounded-md hover:text-red-600 hover:bg-red-50 transition-colors duration-200 font-medium">
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
