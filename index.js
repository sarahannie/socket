const { Server } = require("socket.io");

const io = new Server({
  cors: "http://localhost:3001",
}); //Change to live url

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log(`suck: `, socket.id);

  // Listen to a connection for new online user
  socket.on("addNewUser", (userId) => {
    // This would add a new user into the onlineUsers array if the user doesn't exist in the array
    !onlineUsers.some((user) => user.userId === userId) &&
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });

    console.log("onlineUsers: ", onlineUsers);

    io.emit("getOnlineUsers", onlineUsers);
  });

  // Add message
  socket.on("sendMessage", (message) => {
    const user = onlineUsers.find(
      (user) => user.userId === message.recipientId
    );

    if (user) {
      io.to(user.socketId).emit("getMessage", message);
    }
  });

  // Listen to disconnect event to disconnect an offline user
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);

    io.emit("getOnlineUsers", onlineUsers);
  });
});

io.listen(3000);
