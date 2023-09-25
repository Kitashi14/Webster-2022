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
      <div className="h-1/6 drop-shadow-lg ">
        <div
          className={`py-2 w-full h-full bg-red-600 text-white text-xl rounded-tr-2xl  flex flex-col ${
            auth.userName ? " items-start  pl-0 " : " items-center "
          }justify-center`}
        >
          <span className="my-2 font-bold ml-4">{`User : ${auth.userName}`}</span>
          <div className=" w-full">
            <div class="relative w-full ">
              <div class="absolute  inset-y-0 flex items-center pl-14 pointer-events-none">
                <svg
                  class="w-4 h-4 text-red-300"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <div className="w-full flex flex-row justify-center">
                <input
                  type="text"
                  class="w-5/6 p-4 pl-10 text-sm text-white rounded-lg font-semibold placeholder:text-red-200  bg-red-500 focus:outline-none"
                  placeholder="Search here..."
                  onChange={searchUsers}
                  onFocus={()=>{
                    navigate("/chat");
                  }}
                  ref={searchInputRef}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
