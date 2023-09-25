/** @format */

import { useContext } from "react";
import ChatContext from "../../context/chatContext";
import AuthContext from "../../context/auth-context";

const ChatUserCard = (props) => {
  const user = props.user;
  const userName = useContext(AuthContext).userName;
  const chat = useContext(ChatContext);
  const date = new Date(user.latestMessage);
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
    }${part}`;
  };
  const openUser = (e) => {
    e.preventDefault();
    props.openChatBox(user.userName);
  };
  return (
    <button
      onClick={openUser}
      value={user.userName}
      className={`h-24 w-full  bg-red-${
        props.selectedUser && (props.selectedUser.userName === user.userName)
          ? "400"
          : "600"
      } flex flex-row ${props.selectedUser && (props.selectedUser.userName === user.userName)
        ? ""
        : "hover:bg-red-500"} `}
    >
      <div className=" w-4/5 h-full flex flex-col pl-4 py-1 items-start justify-center space-y-1">
        <span className="text-white text-2xl font-normal font-[Laila]">
          {user.userName}
          <span className="ml-5 text-sm text-yellow-400  font-medium italic">
            {(chat.userTyping[user.userName] > 0) ? "is typing...." : ""}
          </span>
        </span>
        <span className="text-white w-4/5 text-start  text-m  pl-2  truncate">
          {user.messages.length
            ? `${
                user.messages[user.messages.length - 1].to === userName
                  ? user.userName + "   "
                  : "You "
              }:   ${user.messages[user.messages.length - 1].message}`
            : "lores ipsum"}
        </span>
      </div>
      <div className="w-1/5 h-full  flex flex-col  pr-4 py-0 space-y-0 justify-center items-end">
        <span className="text-red-100 ">
          {user.latestMessage ? lastDay(date) : ""}
        </span>
        <span className="text-red-100 text-sm">
          {user.latestMessage ? getTime(date) : ""}
        </span>
        {user.unseenCount ? (
          <span className="bg-white text-red-600 text-xs font-bold rounded-full px-2 py-1">
            {user.unseenCount}
          </span>
        ) : (
          <></>
        )}
      </div>
    </button>
  );
};

export default ChatUserCard;
