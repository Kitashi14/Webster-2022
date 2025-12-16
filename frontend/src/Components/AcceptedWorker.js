import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { socket } from "../socket/sc";
import AuthContext from "../context/auth-context";

const AcceptedWorker = (props) => {
  const auth = useContext(AuthContext);
  const handleAssign = async () => {
    if (!props.complainId) {
      alert("Missing complain id");
      return;
    }
    try {
      const resp = await fetch(
        `${process.env.REACT_APP_SERVER_ROOT_URI}/api/complain/assign/${props.complainId}/${props.item._id}`,
        { method: "POST", credentials: "include" }
      );
      const data = await resp.json();
      if (resp.status === 200) {
        alert(data.message || "Worker assigned");
          try {
          const from = auth.userName || (auth.user && auth.user.userName) || auth.userName;
          const to = props.item.username;
          const title = (props.complainDetails && props.complainDetails.title) || "a task";
          const complainLink = `${process.env.REACT_APP_UI_ROOT_URI || window.location.origin}/complain/${props.complainId}`;
          let locationLink = "";
          if (props.complainDetails && props.complainDetails.location && props.complainDetails.location.lat && props.complainDetails.location.lng) {
            locationLink = `https://www.google.com/maps/search/?api=1&query=${props.complainDetails.location.lat},${props.complainDetails.location.lng}`;
          }
          const message = `You have been assigned the task "${title}" by ${from}. View: ${complainLink}${locationLink ? ' Location: ' + locationLink : ''}`;
          const messageObj = { from, to, message, time: new Date(), status: 'delivered' };
          socket.emit('send message', messageObj);
        } catch (emitErr) {
          console.log('failed to emit assign message', emitErr);
        }

        if (props.onAssigned) props.onAssigned();
      } else {
        alert(data.error || "Failed to assign worker");
      }
    } catch (err) {
      console.log(err);
      alert("Failed to assign worker");
    }
  };

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
          <Link to={`/user/${props.item.username}`}>
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
          <button
            onClick={handleAssign}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Assign
          </button>
        </div>
      </div>
    </>
  );
};

export default AcceptedWorker;