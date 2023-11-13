import { useContext, useEffect, useRef, useState } from "react";
import ChatContext from "../context/chatContext";
import ControlBlock from "../Components/chat/controlBlock";
import ChatBlock from "../Components/chat/chatBlock";
import { socket } from "../socket/sc";
import { useNavigate, useParams } from "react-router-dom";

const ChatPage = ()=>{
  const chat = useContext(ChatContext);
  const chatBox = chat.chatBox;

  const chatUserName = useParams().uid;
  const navigate = useNavigate();

  const chatPageRef = useRef();

  const [showUsers, setShowUsers] = useState(chatBox.users);
  const [searchedMsg, setSearchedMsg] = useState([]);
  const [isChatBoxOpen, setChatBoxOpen] = useState(false);

  const [isSelectedUserOld, setIsSelectedUserOld] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState(null);
  const [selectedMsg, setSelectedMsg] = useState(null);


  if (isChatBoxOpen && selectedUserName) {
    var user = chat.chatBox.isUserPresent(selectedUserName);
    if (!isSelectedUserOld && user) {
      setIsSelectedUserOld(true);
      setSelectedUser(user);
    }
  }

  

  const openChatBox = (userName, message_id) => {
    if (message_id) {
      setSelectedMsg(message_id);
    } else {
      setSelectedMsg(null);
    }
    setSelectedUserName(userName);
    var user = chat.chatBox.isUserPresent(userName);
    console.log(user);
    if (user) {
      setIsSelectedUserOld(true);
      setSelectedUser(user);
      var currObj = chat.chatBox;
      currObj.meSaw(userName);
      chat.setChatBox(currObj);
    } else {
      setIsSelectedUserOld(false);
      setSelectedUser(userName);
    }
    setChatBoxOpen(true);
    chat.setChatScreenUser(userName);
    socket.emit("seen", userName);
  };

  const setNavigate = (userName,message_id)=>{
    if(message_id){
      openChatBox(userName,message_id);
      navigate("/chat");
      return;
    }
    navigate(`/chat/${userName}`);
  }

  useEffect(()=>{
    const showChatPage =()=>{
      chatPageRef.current?.scrollIntoView({block:"end"});
    }
    showChatPage();
    if(chatUserName){
      if(!chat.isChatSet){
        navigate("/chat");
      }
      else{
        openChatBox(chatUserName);
      }
    }
    
  },[chatUserName]);

  const searchedUsers = (text) => {
    var msgs = [];
    const searchResult = chatBox.users.filter((user) => {
      user.messages.map((msg) => {
        if (text.length)
          if (msg.message.includes(text)) {
            msgs.push({
              userName: user.userName,
              message: msg,
            });
          }
        return 0;
      });
      return user.userName.includes(text);
    });
    setShowUsers(searchResult);
    msgs.sort((a,b)=>{
      var timeA = new Date(a.message.time);
      timeA=timeA.getTime();
      var timeB = new Date(b.message.time);
      timeB=timeB.getTime();
      return timeB-timeA;
    })
    setSearchedMsg(msgs);
  };
    return (
        <>
        <div className="h-screen w-full bg-gray-200 flex flex-row " ref={chatPageRef}>
        <ControlBlock searchFunc={searchedUsers} searchedUsers={showUsers} searchedMsg={searchedMsg} openChatBox={setNavigate} selectedMsg={selectedMsg} selectedUser={selectedUser}/>
        <ChatBlock isChatBoxOpen={isChatBoxOpen} isOld={isSelectedUserOld} userInfo={selectedUser} selectedMsg={selectedMsg}/>
        {/* <Navbar  />
        <ChatPage  /> */}
      </div></>
    );
}

export default ChatPage;