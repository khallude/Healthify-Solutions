import React, { useState } from "react";
import ChatList from "./Messenger/ChatList";
import ChatWindow from "./Messenger/ChatWindow";

const Messenger = () => {
  const [selectedChat, setSelectedChat] = useState(1); // Default chat ID

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <ChatList onSelectChat={setSelectedChat} selectedChat={selectedChat} />
      <ChatWindow chatId={selectedChat} />
    </div>
  );
};

export default Messenger;
