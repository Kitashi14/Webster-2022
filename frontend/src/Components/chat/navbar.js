/** @format */

import { useContext, useRef } from "react";
import { toast } from "react-toastify";
import AuthContext from "../../context/auth-context";
import { useNavigate } from "react-router-dom";
const Navbar = (props) => {
  const auth = useContext(AuthContext);
  const searchInputRef = useRef();
  const navigate = useNavigate();

  const searchUsers = (e) => {
    e.preventDefault();
    const inputText = searchInputRef.current.value;
    props.searchFunc(inputText);
  };
  return (
    <>
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 shadow-lg rounded-tr-2xl">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-white font-semibold text-lg">Messages</h2>
                <p className="text-primary-100 text-sm">{auth.userName}</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-primary-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-primary-200 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-200"
              placeholder="Search conversations..."
              onChange={searchUsers}
              onFocus={() => {
                navigate("/chat");
              }}
              ref={searchInputRef}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
