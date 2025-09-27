import React from "react";
import { Link } from "react-router-dom";

const AcceptedWorker = (props) => {
  return (
    <>
      <div className="flex items-center gap-6">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <img
            src={props.item.img}
            className="w-16 h-16 rounded-full object-cover border-2 border-slate-200"
            alt="Worker profile"
          />
        </div>

        {/* Worker Details */}
        <div className="flex-1 min-w-0">
          <Link to={`/acceptedWorkers/${props.item._id}`}>
            <h3 className="text-lg font-semibold text-slate-900 hover:text-blue-600 transition-colors duration-200 truncate">
              {props.item.name}
            </h3>
          </Link>
          
          <div className="flex flex-wrap gap-4 text-sm text-slate-600 mt-1">
            <span className="flex items-center">
              ⭐ <span className="ml-1">Rating: {props.item.rating}</span>
            </span>
            <span className="flex items-center">
              🏆 <span className="ml-1">Score: {props.item.score}</span>
            </span>
            <span className="flex items-center">
              👤 <span className="ml-1">Age: {props.item.age}</span>
            </span>
          </div>
          
          <p className="text-sm text-slate-500 mt-2">
            By{" "}
            <Link
              to={`/user/${props.item.username}`}
              className="font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
            >
              {props.item.username}
            </Link>
          </p>
        </div>

        {/* Action Button */}
        <div className="flex-shrink-0">
          <Link to={`/acceptedWorkers/${props.item.username}`}>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Assign
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default AcceptedWorker;