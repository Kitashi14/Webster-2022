/** @format */

import { useContext, useEffect, useRef, useState } from "react";
import ChatContext from "../../context/chatContext";
import AuthContext from "../../context/auth-context";
import { socket } from "../../socket/sc";
import { Link } from "react-router-dom";

const ChatBox = (props) => {
  const chatInputRef = useRef();
  const chat = useContext(ChatContext);
  const auth = useContext(AuthContext);
  const selectedMsgRef = useRef();
  const scrollBlock = useRef();
  const [scrollDownButton, setScrollDownButton] = useState(false);

  const getDay = (date) => {
    date = new Date(date);
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
    date = new Date(date);
    var hour = date.getHours();
    const part = hour > 12 ? "pm" : "am";
    hour = hour > 12 ? hour - 12 : hour;
    const min = date.getMinutes();
    return `${hour < 10 ? `0${hour}` : hour}:${
      min < 10 ? `0${min}` : min
    } ${part}`;
  };

  const scrollHandler = () => {
    if (scrollBlock.current.scrollTop < 0) {
      setScrollDownButton(true);
    } else {
      setScrollDownButton(false);
    }
  };

  const showSelectedMsg = () => {
    selectedMsgRef.current?.scrollIntoView({ block: "start" });
  };

  useEffect(() => {
    if (scrollBlock.current.scrollTop < 0) {
      setScrollDownButton(true);
    } else {
      setScrollDownButton(false);
    }
    showSelectedMsg();
  }, [props.selectedMsg, chat.userTyping]);

  const userName = props.isOld ? props.userInfo.userName : props.userInfo;

  const isUserOnline = chat.chatBox.isUserOnline(userName);

  const statusIcon = (status) => {
    if (status === "delivered") {
      return (
        <svg
          className=" m-auto ml-2 mr-1 fill-white"
          xmlns="http://www.w3.org/2000/svg"
          height="1em"
          viewBox="0 0 448 512"
        >
          <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
        </svg>
      );
    } else if (status === "received") {
      return (
        <svg
          className=" m-auto ml-2 mr-1 fill-white"
          xmlns="http://www.w3.org/2000/svg"
          height="1.2em"
          viewBox="0 0 512 512"
        >
          <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z" />
        </svg>
      );
    } else if (status === "seen") {
      return (
        <svg
          className=" m-auto ml-2 mr-1 fill-white"
          xmlns="http://www.w3.org/2000/svg"
          height="1.2em"
          viewBox="0 0 512 512"
        >
          <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
        </svg>
      );
    } else {
      return (
        <svg
          className=" m-auto ml-2 mr-2 fill-white"
          xmlns="http://www.w3.org/2000/svg"
          height="1em"
          viewBox="0 0 384 512"
        >
          <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
        </svg>
      );
    }
  };

  // const backButtonHandler = () => {
  //   props.closeChatBox();
  // };

  const sendButtonHandler = async () => {
    const chatInput = chatInputRef.current.value.trim();

    if (chatInput) {
      var currObj = chat.chatBox;
      await currObj.send(auth.userName, userName, chatInput);
      chat.setChatBox(currObj);
      chatInputRef.current.value = "";
    }
    return;
  };
  var messages = [];
  if (props.isOld && props.userInfo.messages.length) {
    messages = JSON.parse(JSON.stringify(props.userInfo.messages));
    messages.reverse();
  }

  var currDate;
  if (messages.length) {
    currDate = getDay(messages[0].time);
  }

  const setTyping = () => {
    socket.emit("typing", {
      typer: auth.userName,
      for: userName,
    });
  };

  return (
    <>
      <div className="bg-gray-200 flex flex-col h-full w-2/3">
        <div className="h-1/6 flex drop-shadow-lg flex-row pl-10 items-center  text-4xl text-red-600 font-semibold bg-gray-200 justify-between">
          <span className="ml-5 h-full w-3/4 flex flex-col pr-3">
            <span className="w-full h-2/3 font-[Laila] pt-6 truncate ">
              <Link to={`/user/${userName}`}>{`${userName}`}</Link>
            </span>

            <span className="  h-1/3 text-xl font-normal text-red-400  italic">
              {chat.userTyping[userName] > 0 ? "is typing...." : ""}
            </span>
          </span>

          <div className="w-1/3  flex flex-row justify-end pr-4">
            {isUserOnline ? (
              <>
                <span className="bg-green-500 text-3xl py-2 px-5 rounded-full text-white">
                  Online
                </span>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div
          className="bg-white h-4/6 px-2 flex flex-col-reverse space-y-1 py-1  overflow-y-auto sc-design overflow-x-hidden shadow-inner"
          onScroll={scrollHandler}
          ref={scrollBlock}
        >
          {props.isOld && props.userInfo.messages.length ? (
            <>
              {messages.map((message) => {
                var setDay = false;
                var prevDay = "";
                var msgDay = getDay(message.time);
                if (msgDay !== currDate) {
                  prevDay = currDate;
                  currDate = msgDay;
                  setDay = true;
                }
                if (message.to === userName) {
                  return (
                    <>
                      {setDay ? (
                        <>
                          <div className="flex flex-row justify-center">
                            <span className="w-1/3 bg-red-700 text-white text-center py-1 rounded">
                              {prevDay}
                            </span>
                          </div>
                        </>
                      ) : (
                        <>{/* <div>set day</div> */}</>
                      )}
                      <div
                        key={message._id}
                        ref={
                          props.selectedMsg === message._id
                            ? selectedMsgRef
                            : null
                        }
                        className={`w-full ${
                          props.selectedMsg === message._id
                            ? "bg-red-300 rounded"
                            : ""
                        } flex flex-row justify-end mt-1 `}
                      >
                        <span className="max-w-screen-md bg-red-600 rounded-l-2xl rounded-tr-2xl rounder-br-xs overflow-hidden">
                          <div className="w-full flex bg-red-600 flex-row rounded pl-6 space-x-8 pb-2 px-0 pt-2 items-end text-white justify-start ">
                            <span className="w-11/12  break-words whitespace-pre-wrap">
                              {message.message}
                            </span>
                            <span>{statusIcon(message.status)}</span>
                          </div>
                          <div className="flex flex-row justify-end pr-2 pb-2  text-gray-100 text-[10px]">
                            {getTime(message.time)}
                          </div>
                        </span>
                      </div>
                    </>
                  );
                } else {
                  return (
                    <>
                      {setDay ? (
                        <>
                          <div className="flex flex-row justify-center">
                            <span className="w-1/3 bg-red-700 text-white text-center py-1 rounded">
                              {prevDay}
                            </span>
                          </div>
                        </>
                      ) : (
                        <>{/* <div>set day</div> */}</>
                      )}
                      <div
                        key={message._id}
                        ref={
                          props.selectedMsg === message._id
                            ? selectedMsgRef
                            : null
                        }
                        className={`w-full ${
                          props.selectedMsg === message._id
                            ? "bg-red-300 rounded"
                            : ""
                        } flex flex-row mt-1  `}
                      >
                        <span className="max-w-screen-md bg-gray-300 rounded-r-2xl rounded-tl-2xl rounder-bl-xs overflow-hidden">
                          <div className="w-full flex flex-row rounded pr-14  pl-6 pb-2 pt-2">
                            <span className="w-full  break-words whitespace-pre-wrap">
                              {message.message}
                            </span>
                          </div>
                          <div className="flex flex-row justify-end pr-2 pb-2  text-gray-800 text-[10px] ">
                            {getTime(message.time)}
                          </div>
                        </span>
                      </div>
                    </>
                  );
                }
              })}
            </>
          ) : (
            <></>
          )}
          {messages.length ? (
            <>
              <div className="flex flex-row justify-center">
                <span className="w-1/3 bg-red-700 text-white text-center py-1 rounded">
                  {currDate}
                </span>
              </div>
            </>
          ) : (
            <></>
          )}
          {scrollDownButton ? (
            <>
              <div className=" w-2/3 h-[50px] absolute flex flex-row justify-center">
                <span
                  onClick={() => {
                    scrollBlock.current.scrollTop = 0;
                  }}
                  className="bg-red-400 h-full w-[50px] flex flex-row justify-center rounded-full items-center"
                >
                  <svg
                    className="fill-white"
                    xmlns="http://www.w3.org/2000/svg"
                    height="1em"
                    viewBox="0 0 448 512"
                  >
                    <path d="M201.4 342.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 274.7 86.6 137.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
                  </svg>
                </span>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
        <div className="h-1/6 ">
          <div className="h-full w-full px-0  flex flex-row justify-around items-center space-x-3">
            <textarea
              className="w-3/4 h-full px-3 py-2 text-xl leading-tight bg-gray-200 outline-none text-red-500 font-medium appearance-none focus:outline-none focus:shadow-outline resize-none placeholder:font-normal"
              ref={chatInputRef}
              onChange={setTyping}
              onKeyPress={(e) => {
                if (e.which === 13 && !e.shiftKey) {
                  sendButtonHandler();
                }
              }}
              placeholder="Type your message here..."
            />
            <button
              className="px-3 py-3 rounded-full font-normal bg-red-600 text-white"
              onClick={sendButtonHandler}
            >
              <svg
                className="fill-gray-100"
                xmlns="http://www.w3.org/2000/svg"
                height="1.9em"
                viewBox="0 0 512 512"
              >
                <path d="M16.1 260.2c-22.6 12.9-20.5 47.3 3.6 57.3L160 376V479.3c0 18.1 14.6 32.7 32.7 32.7c9.7 0 18.9-4.3 25.1-11.8l62-74.3 123.9 51.6c18.9 7.9 40.8-4.5 43.9-24.7l64-416c1.9-12.1-3.4-24.3-13.5-31.2s-23.3-7.5-34-1.4l-448 256zm52.1 25.5L409.7 90.6 190.1 336l1.2 1L68.2 285.7zM403.3 425.4L236.7 355.9 450.8 116.6 403.3 425.4z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatBox;
