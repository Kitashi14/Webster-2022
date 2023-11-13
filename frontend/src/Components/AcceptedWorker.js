import React from "react";
import { Link } from "react-router-dom";

const AcceptedWorker = (props) => {
  return (
    <>
      <section>
        <section className="text-gray-600 body-font">
          {/* <div className="mx-8 mt-4 mb-8 "> */}
          <div className="p-5 bg-white flex items-center mx-2 my-2 border-b border-gray-200 rounded-lg sm:flex-row flex-col">
            <div className="sm:w-32 sm:h-32 h-20 w-20 rounded-full sm:mr-10 flex items-center gap-x-6 justify-center">
              <img
                src={props.item.img}
                className="rounded-full h-3/4 w-3/4"
                alt=""
              />
            </div>
            <div className="flex-grow sm:text-left text-center sm:mt-0">
              <Link to={`/acceptedWorkers/${props.item._id}`}>
                <span className="text-black text-2xl title-font font-bold mb-0 hover:text-red-500">
                  Name : {props.item.name}
                </span>
              </Link>
              <p className="leading-relaxed mt-0 p-0 text-base">
                Rating: {props.item.rating}
              </p>

              <p className="leading-relaxed mt-0 p-0 text-base">
                Score: {props.item.score}
              </p>

              <p className="leading-relaxed mt-5 p-0 text-base">
                Age: {props.item.age}
              </p>
              <p className="leading-relaxed mt-0 p-0 text-base">
                By -{" "}
                <span>
                  <Link
                    className="hover:text-red-500"
                    to={`/user/${props.item.username}`}
                  >
                    {props.item.username}
                  </Link>
                </span>
              </p>
            </div>
            <div className="flex flex-col">
              <Link
                to={`/acceptedWorkers/${props.item.username}`}
                className="text-green-500 bg-gray-200 text-center"
              >
                <button className="bg-blue-500 text-white">Assign</button>
              </Link>
            </div>
          </div>
        </section>
      </section>
    </>
  );
};

export default AcceptedWorker;
