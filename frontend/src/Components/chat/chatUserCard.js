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
      className={`w-full p-4 border-b border-slate-200 last:border-b-0 transition-all duration-200 text-left group ${
        props.selectedUser && props.selectedUser.userName === user.userName
          ? "bg-primary-50 border-primary-200"
          : "bg-white hover:bg-slate-50"
      }`}
    >
      <div className="flex items-center space-x-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div
            className={`w-12 h-12 rounded-full font-semibold text-lg flex items-center justify-center shadow-md ${
              props.selectedUser &&
              props.selectedUser.userName === user.userName
                ? "bg-primary-500 text-white"
                : "bg-gradient-to-br from-primary-500 to-primary-600 text-white"
            }`}
          >
            {user.userName[0].toUpperCase()}
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex-1 min-w-0">
              <h4
                className={`font-semibold truncate transition-colors duration-200 ${
                  props.selectedUser &&
                  props.selectedUser.userName === user.userName
                    ? "text-primary-700"
                    : "text-slate-900 group-hover:text-primary-600"
                }`}
              >
                {user.userName}
              </h4>
              {chat.userTyping[user.userName] > 0 && (
                <p className="text-xs text-emerald-600 font-medium italic animate-pulse">
                  is typing...
                </p>
              )}
            </div>

            <div className="flex flex-col items-end space-y-1 ml-2">
              {user.latestMessage && (
                <>
                  <span className="text-xs text-slate-500">
                    {lastDay(date)}
                  </span>
                  <span className="text-xs text-slate-400">
                    {getTime(date)}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600 truncate pr-2">
              {user.messages.length
                ? `${
                    user.messages[user.messages.length - 1].to === userName
                      ? user.userName
                      : "You"
                  }: ${user.messages[user.messages.length - 1].message}`
                : "Start conversation"}
            </p>
            {user.unseenCount > 0 && (
              <span className="bg-primary-500 text-white text-xs font-bold rounded-full px-2 py-1 min-w-[20px] text-center animate-pulse">
                {user.unseenCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
};

export default ChatUserCard;
