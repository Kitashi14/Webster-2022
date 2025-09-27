/** @format */

const { Server } = require("socket.io");
const Chat = require("./models/chat");
const User = require("./models/user");
const logger = require("./utils/logger");

const startSocket = async (httpServer) => {
  try {
    const io = new Server(httpServer, {
      cors: {
        origin: process.env.UI_ROOT_URI || "*",
        methods: ["GET", "POST"],
      },
    });

    let connectedUsers = 0;
    const onlineUsers = new Map();

    io.on("connection", (socket) => {
      connectedUsers++;
      logger.info(
        `New user connected: ${socket.id}. Total connected: ${connectedUsers}`
      );

      socket.on("joined", async (data) => {
        try {
          if (!data || !data.userName) {
            socket.emit("error", { message: "Invalid join request" });
            return;
          }

          logger.info(`User joining chat: ${data.userName}`);

          // Get online users list
          const users = Array.from(onlineUsers.values());

          // Get chat history for the user
          const oldData = await Chat.find({
            $or: [{ from: data.userName }, { to: data.userName }],
          }).sort({ time: 1 });

          // Get user details
          const userDetails = await User.findOne({
            username: data.userName,
          });

          if (!userDetails) {
            socket.emit("error", { message: "User not found" });
            return;
          }

          // Update message status to received
          await Chat.updateMany(
            {
              to: data.userName,
              status: "delivered",
            },
            {
              status: "received",
            }
          );

          console.log("sending online users info and his data\n");
          socket.emit("initial info", {
            onlineUsers: users,
            oldData,
          });
          socket.join(data.userName);
          console.log("sending broadcast for new online user");
          socket.broadcast.emit("joined", {
            ...data,
            userProfile: userDetails.profilePic,
          });
          onlineUsers.set(socket.id, {
            userName: data.userName,
            userProfile: userDetails.profilePic,
          });
        } catch (err) {
          console.log(err);
        }
      });

      socket.on("disconnect", (reason) => {
        console.log("\ndisconnected : ", reason);
        connectedUsers--;
        if (onlineUsers.has(socket.id)) {
          console.log(
            "sending braodcast for left user\n",
            onlineUsers.get(socket.id).userName
          );
          socket.broadcast.emit("left", onlineUsers.get(socket.id).userName);
          onlineUsers.delete(socket.id);
        }
        logger.info(
          `User disconnected: ${socket.id}. Total connected: ${connectedUsers}`
        );
      });

      socket.on("send message", async (data) => {
        console.log("\nnew send message request : ", data);
        try {
          if (!data.from || !data.to || !data.message) {
            throw Error("Data not defined properly");
          }
          var status = "delivered";

          onlineUsers.forEach((val, key) => {
            if (val.userName === data.to) {
              status = "received";
            }
          });

          const newMessage = new Chat({
            from: data.from,
            to: data.to,
            message: data.message,
            time: data.time,
            status,
          });

          await newMessage.save();
          console.log("sending sender ack");
          socket.emit("server received message", {
            data: newMessage,
          });
          console.log("sending message to receiver");
          socket.to(data.to).emit("new message", newMessage);
        } catch (err) {
          console.log(err, "\n");
          console.log("sending sender ack");
          socket.emit("server received message", { data });
        }
      });

      socket.on("seen", async (userName) => {
        const userWhoSaw = onlineUsers.get(socket.id).userName;
        const userWhoseMessageWasSeen = userName;
        console.log(
          "\nseen request from",
          userWhoSaw,
          "for",
          userWhoseMessageWasSeen
        );
        try {
          await Chat.updateMany(
            {
              from: userWhoseMessageWasSeen,
              to: userWhoSaw,
              $or: [{ status: "delivered" }, { status: "received" }],
            },
            {
              status: "seen",
            }
          );

          socket.to(userWhoseMessageWasSeen).emit("seen", userWhoSaw);
        } catch (err) {
          console.log(err);
        }
      });

      socket.on("typing", (data) => {
        socket.to(data.for).emit("typing", data);
      });
    });
  } catch (err) {
    console.log(err);
  }
};

exports.startSocket = startSocket;
