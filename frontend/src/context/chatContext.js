/** @format */

import { createContext, useContext, useReducer, useState } from "react";
import AuthContext from "./auth-context";
import { socket } from "../socket/sc";

const ChatContext = createContext({
  isChatSet : false,
  chatBox: null,
  setChatBox: function (data) {},
  chatScreenUser: null,
  setChatScreenUser: (user) => {},
  userTyping: false,
  setUserTyping: (user) => {},
});

export const ChatContextProvider = (props) => {
  const auth = useContext(AuthContext);

  class User {
    constructor(otherParty) {
      this.userName = otherParty;
      this.latestMessage = 0;
      this.messages = [];
      this.unseenCount = 0;
    }

    getName() {
      return this.userName;
    }

    addMessage(data) {
      var date = new Date(data.time);

      if (this.latestMessage < date || !this.latestMessage)
        this.latestMessage = date;
      if (
        (data.status === "delivered" || data.status === "received") &&
        data.from === this.userName
      )
        this.unseenCount++;
      this.messages.push(data);
    }

    async sendMessage(from, message) {
      var currTime = new Date();
      var stat = "Not Delivered";
      var to = this.userName;

      try {
        //socket call
        const messageObj = {
          from,
          to,
          message,
          status: stat,
          time: currTime,
        };
        socket.emit("send message", messageObj);
      } catch (err) {
        console.log(err);
        this.latestMessage = currTime;
        this.messages.push({
          time: currTime,
          status: stat,
          from,
          to,
          message,
          id: null,
        });
      }
    }

    userReceived() {
      for (var j = 0; j < this.messages.length; j++) {
        if (
          this.messages[j].status === "delivered" &&
          this.messages[j].to === this.userName
        ) {
          this.messages[j].status = "received";
        }
      }
      return;
    }

    userSaw() {
      for (var j = 0; j < this.messages.length; j++) {
        if (
          (this.messages[j].status === "received" ||
            this.messages[j].status === "delivered") &&
          this.messages[j].to === this.userName
        ) {
          this.messages[j].status = "seen";
        }
      }
      return;
    }
  }
  class ChatBox {
    constructor() {
      this.userIndex = new Map();
      this.users = [];
      this.onlineUsers = [];
      this.unreadUsers = new Set();
    }

    addData(authUser, data) {
      data.map((message_obj) => {
        var otherParty = message_obj.from === authUser ? message_obj.to : message_obj.from;
        if((message_obj.status==="delivered" || message_obj.status==="received") && message_obj.from=== otherParty){
          this.unreadUsers.add(otherParty);
        }
        if (this.userIndex.has(otherParty)) {
          var i = this.userIndex.get(otherParty);
          this.users[i].addMessage(message_obj);
        } else {
          const user = new User(otherParty);
          user.addMessage(message_obj);
          this.users.push(user);
          this.userIndex.set(otherParty, this.users.length - 1);
        }
        return 1;
      });

      this.users.sort((a, b) => {
        return b.latestMessage.getTime() - a.latestMessage.getTime();
      });
      for (var i = 0; i < this.users.length; i++) {
        this.userIndex.set(this.users[i].userName, i);
      }
    }

    async send(from, name, message) {
      if (!this.userIndex.has(name)) {
        const user = new User(name);
        this.users.push(user);
        var temp = user;
        var idx = this.users.length - 1;
        for (var i = idx - 1; i >= 0; i--) {
          this.users[i + 1] = this.users[i];
          this.userIndex.set(this.users[i + 1].getName(), i + 1);
        }
        await temp.sendMessage(from, message);
        this.users[0] = temp;
        this.userIndex.set(name, 0);
      } else {
        idx = this.userIndex.get(name);
        temp = this.users[idx];
        for (i = idx - 1; i >= 0; i--) {
          this.users[i + 1] = this.users[i];
          this.userIndex.set(this.users[i + 1].getName(), i + 1);
        }
        await temp.sendMessage(from, message);
        this.users[0] = temp;
        this.userIndex.set(this.users[0].getName(), 0);
      }
    }

    addMessage(name, data) {
      if((data.status==="delivered" || data.status==="received") && data.from=== name){
        this.unreadUsers.add(name);
      }
      if (!this.userIndex.has(name)) {
        const user = new User(name);
        this.users.push(user);
        var temp = user;
        var idx = this.users.length - 1;
        for (var i = idx - 1; i >= 0; i--) {
          this.users[i + 1] = this.users[i];
          this.userIndex.set(this.users[i + 1].getName(), i + 1);
        }
        temp.addMessage(data);
        this.users[0] = temp;
        this.userIndex.set(name, 0);
      } else {
        idx = this.userIndex.get(name);
        temp = this.users[idx];
        for (i = idx - 1; i >= 0; i--) {
          this.users[i + 1] = this.users[i];
          this.userIndex.set(this.users[i + 1].getName(), i + 1);
        }
        temp.addMessage(data);
        this.users[0] = temp;
        this.userIndex.set(this.users[0].getName(), 0);
      }
    }

    isUserPresent(name) {
      var userFound = this.users.filter((user) => {
        return user.userName === name;
      });

      if (userFound.length > 0) return userFound[0];
      return false;
    }

    isUserOnline(name) {
      var userFound = this.onlineUsers.filter((user) => {
        return user.userName === name;
      });

      if (userFound.length > 0) return true;
      return false;
    }

    addOnlineUser(data) {
      this.onlineUsers.push(data);
    }

    removeOnlineUser(userName) {
      this.onlineUsers = this.onlineUsers.filter((user) => {
        return user.userName !== userName;
      });
    }

    userReceived(userName) {
      if (this.userIndex.has(userName)) {
        this.users[this.userIndex.get(userName)].userReceived();
      }
    }
    userSaw(userName) {
      if (this.userIndex.has(userName)) {
        this.users[this.userIndex.get(userName)].userSaw();
      }
    }

    meSaw(userName) {
      var i = this.userIndex.get(userName);
      this.users[i].unseenCount = 0;
      this.unreadUsers.delete(userName);
    }
  }

  const [chatBoxx, setChatBoxx] = useState(new ChatBox());
  const [chatScreenUser, setChatScreenUser] = useState(null);
  const [isTyping, setIsTyping] = useState({});
  const [isChatSet,setIsChatSet] =useState(false);
  // eslint-disable-next-line
  const [_, forceRender] = useReducer((x) => !x, false);
  const [hasjoined, setHasJoined] = useState(false);

  const modifyChatBox = (chatObj) => {
    if(!isChatSet) setIsChatSet(true);
    setChatBoxx(chatObj);
    console.log("modifyChat function called");
    console.log(chatBoxx);
    forceRender();
  };

  const modifyChatScreenUser = (userName) => {
    setChatScreenUser(userName);
  };

  const modifyIsTyping = (userName) => {
    isTyping[userName] = isTyping[userName] + 1 || 1;
    setIsTyping(isTyping);
    console.log(isTyping);
    forceRender();
    setTimeout(() => {
      isTyping[userName] = isTyping[userName] - 1;
      console.log(isTyping);
      forceRender();
    }, 2500);
  };

  if (!hasjoined && auth.userName) {
    console.log("sending join request");
    socket.emit("joined", {
      userName: auth.userName,
    });
    setHasJoined(true);
  }

  const context = {
    isChatSet,
    chatBox: chatBoxx,
    setChatBox: modifyChatBox,
    chatScreenUser: chatScreenUser,
    setChatScreenUser: modifyChatScreenUser,
    userTyping: isTyping,
    setUserTyping: modifyIsTyping,
  };
  return (
    <ChatContext.Provider value={context}>
      {props.children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
