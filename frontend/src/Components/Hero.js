import React from "react";
import { Link } from "react-router-dom";
// import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <>
    <div class="px-4 py-16" >
    <div class="relative w-full md:max-w-2xl md:mx-auto text-center">
      <h1
        class="font-bold text-gray-700 text-xl sm:text-2xl md:text-5xl leading-tight mb-6"
      >
        A simple and smart tool that will help grow your business
      </h1>

      <p class=" mb-6 text-gray-600 md:text-xl md:px-18">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit hello.
      </p>

      
      <button
      type="submit" 
      class="w-full rounded-md border border-blue-500 bg-blue-500 py-2 px-6 text-white transition hover:border-blue-600 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-blue-500 disabled:hover:bg-blue-500 sm:max-w-max"><Link to='/registerComplain'>Register Complain</Link></button>

</div>

    </div>
  
  
    </>
  );
};

export default Hero;
