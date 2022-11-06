import React from "react";

const Page404 = () => {
  return (
    <>
      <main className="bg-white  overflow-hidden h-screen relative">
        <div className="container mx-auto h-screen pt-32 md:pt-0 px-6 z-10 flex items-center justify-between">
          <div className="container mx-auto px-6 flex flex-col-reverse lg:flex-row justify-between items-center relative">
            <div className="w-full mb-16 md:mb-8 text-center lg:text-left">
              <h1 className="font-light font-sans text-center lg:text-left text-5xl lg:text-8xl mt-12 md:mt-0 text-gray-700">
                Sorry, this page isn&#x27;t available
              </h1>
              <button className="px-2 py-2 w-36 mt-16 font-light transition ease-in duration-200 hover:bg-tc border-2 text-lg border-gray-700 bg-tc-300 hover:text-sc focus:outline-white">
                Go back home
              </button>
            </div>
            <div className="block w-full mx-auto md:mt-0 relative max-w-md lg:max-w-2xl">
              <img
                src="https://www.tailwind-kit.com/images/illustrations/1.svg"
                alt="404"
              />
            </div>
          </div>
        </div>
      </main>
      ;
    </>
  );
};

export default Page404;
