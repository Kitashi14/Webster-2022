/** @format */

import { useContext } from "react";
import AuthContext from "../../context/auth-context";

const SearchedMsgCard = (props) => {
  const user = props.searchedMsg.userName;
  const messageObj = props.searchedMsg.message;
  const authUser = useContext(AuthContext).userName;
  const date = new Date(messageObj.time);
  const lastDay = (date) => {
    const currDate = new Date();
    if (
      date.getFullYear() === currDate.getFullYear() &&
      date.getMonth() === currDate.getMonth()
    ) {
      if (date.getDate() === currDate.getDate()) return "Today";
      else if (date.getDate() + 1 === currDate.getDate()) return "Yesterday";
      else
        return `${
          date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
        }/${
          date.getMonth() < 10 ? `0${date.getMonth()}` : date.getMonth()
        }/${date.getFullYear()}`;
    } else {
      return `${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}/${
        date.getMonth() < 10 ? `0${date.getMonth()}` : date.getMonth()
      }/${date.getFullYear()}`;
    }
  };

  const getTime = (date) => {
    var hour = date.getHours();
    const part = hour > 12 ? "pm" : "am";
    hour = hour > 12 ? hour - 12 : hour;
    const min = date.getMinutes();
    return `${hour < 10 ? `0${hour}` : hour}:${
      min < 10 ? `0${min}` : min
    } ${part}`;
  };
  const openUser = (e) => {
    e.preventDefault();
    props.openChatBox(user,messageObj._id);
  };
  return (
    <button
      onClick={openUser}
      className={`h-24 w-full  bg-red-${
        props.selectedMsg && (messageObj._id === props.selectedMsg)
          ? "400"
          : "600"
      } flex flex-row ${props.selectedMsg && (messageObj._id === props.selectedMsg)
        ? ""
        : "hover:bg-red-500"} `}
    >
      <div className=" w-4/5 h-full flex flex-col pl-4 py-1 items-start justify-center space-y-1">
        <span className="text-white text-2xl font-normal font-[Laila]">
          {user}
        </span>
        <span className="text-white text-start  w-4/5 text-m  pl-2  truncate">
          {`${messageObj.to === authUser ? user : "You"}: ${
            messageObj.message
          }`}
        </span>
      </div>
      <div className="w-1/5 h-full justify-center flex flex-col  pr-4 py-0 space-y-0 items-end">
        <span className="text-red-100 text-sm">
          {lastDay(date)}
        </span>
        <span className="text-red-100 text-sm">
          {getTime(date)}
        </span>
      </div>
    </button>
  );
};

export default SearchedMsgCard;
