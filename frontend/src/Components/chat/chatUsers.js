/** @format */

import ChatUserCard from "./chatUserCard";
import SearchedMsgCard from "./searchedMsgCard";

const ChatUsers = (props) => {
  return (
    <>
      <div className="h-full w-full bg-red-600  flex-col   overflow-y-scroll sc-hide rounded-br-2xl">
        {props.users.map((user) => {
          return (
            <ChatUserCard
              key={user.userName}
              user={user}
              selectedUser={props.selectedUser}
              openChatBox={props.openChatBox}
            />
          );
        })}
        {props.searchedMsg.length ? (
          <>
            <div className="h-10 w-full bg-red-700 flex flex-row text-white text-2xl px-4 font-bold">
              Chat:
            </div>
            {props.searchedMsg.map((data) => {
          return (
            <SearchedMsgCard
              key={data.message._id}
              selectedMsg={props.selectedMsg}
              searchedMsg={data}
              openChatBox={props.openChatBox}
            />
          );
        })}
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default ChatUsers;
