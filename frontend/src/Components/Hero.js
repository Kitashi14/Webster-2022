/** @format */

import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../context/auth-context";
// import { Link } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const registerComplainButtonHandler = (e) => {
    e.preventDefault();
    if (auth.isLoggedIn) navigate("/registerComplain");
    else navigate("/login");
  };

  return (
    <>
      <div className="relative bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-20 sm:py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 bg-grid-16 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] opacity-20"></div>
        <div className="relative w-full max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 mb-8 bg-gradient-to-r from-primary-50 to-emerald-50 border border-primary-200 rounded-full">
            <span className="text-primary-700 font-medium text-sm">
              🚀 Streamlined Complaint Management
            </span>
          </div>

          <h1 className="font-bold text-slate-900 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-tight mb-8 tracking-tight">
            Resolve Issues
            <span className="bg-gradient-to-r from-primary-600 to-emerald-600 bg-clip-text text-transparent">
              {" "}
              Faster
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Connect service seekers with skilled workers seamlessly. Report
            issues, track progress, and get quality solutions delivered to your
            doorstep.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
            <button
              onClick={registerComplainButtonHandler}
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-lg hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 min-w-[200px]"
            >
              <span className="mr-2">Register Complaint</span>
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <button onClick={()=>{ navigate("/about") }}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl shadow-sm hover:bg-slate-50 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200 min-w-[200px]">
                Learn More
            </button>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Quick Resolution
              </h3>
              <p className="text-slate-600">
                Get your issues resolved faster with our efficient matching
                system
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Trusted Workers
              </h3>
              <p className="text-slate-600">
                Connect with verified and skilled professionals in your area
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
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
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Real-time Chat
              </h3>
              <p className="text-slate-600">
                Communicate directly with workers for better coordination
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
