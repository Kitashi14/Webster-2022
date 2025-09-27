import React from "react";
import { Link } from "react-router-dom";

const ComplainBox = (props) => {
  const locatDate = new Date(props.item.creationTime);
  const day = locatDate.getDate();
  const year = locatDate.getFullYear();
  const months = [
    "Jan.",
    "Feb.",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug.",
    "Sept.",
    "Oct.",
    "Nov.",
    "Dec.",
  ];
  const month = months[locatDate.getMonth()];

  const date = day + " " + month + " " + year;

  const getStatusColor = (status) => {
    switch (status) {
      case "Not Assigned":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Assigned":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Resolved":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <>
      <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-200 hover:border-slate-300 transition-all duration-300 overflow-hidden">
        <div className="p-6">
          {/* Header with icon and status */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center flex-shrink-0 group-hover:from-primary-100 group-hover:to-primary-200 transition-colors duration-300">
                <img
                  src={props.item.img}
                  className="w-10 h-10 rounded-lg object-cover"
                  alt={props.item.profession}
                />
              </div>
              <div>
                <Link to={`/complain/${props.item._id}`}>
                  <h3 className="text-lg font-semibold text-slate-900 hover:text-primary-600 transition-colors duration-200 line-clamp-2 group-hover:text-primary-600">
                    {props.item.title}
                  </h3>
                </Link>
                <p className="text-sm text-slate-500 font-medium">
                  {props.item.profession}
                </p>
              </div>
            </div>

            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                props.item.status
              )}`}
            >
              {props.item.status}
            </span>
          </div>

          {/* Meta information */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center text-sm text-slate-600">
              <svg
                className="w-4 h-4 mr-2 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v1a1 1 0 01-1 1H3a1 1 0 01-1-1V9a2 2 0 012-2h3z"
                />
              </svg>
              <span className="font-medium">Date:</span>
              <span className="ml-1">{date}</span>
            </div>

            <div className="flex items-center text-sm text-slate-600">
              <svg
                className="w-4 h-4 mr-2 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="font-medium">By:</span>
              <Link
                className="ml-1 text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
                to={`/user/${props.item.creatorUsername}`}
              >
                {props.item.creatorUsername}
              </Link>
            </div>
          </div>

          {/* Action button */}
          <div className="flex justify-end">
            <Link
              to={`/complain/${props.item._id}`}
              className="inline-flex items-center px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors duration-200 group/button"
            >
              View Details
              <svg
                className="w-4 h-4 ml-2 group-hover/button:translate-x-1 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ComplainBox;
