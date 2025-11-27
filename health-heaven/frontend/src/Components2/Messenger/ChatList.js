import React, { useState, useEffect } from "react";
import { Search, UserPlus } from "lucide-react";
import ChatItem from "./ChatItem";

const ChatList = ({ onSelectChat, selectedChat }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [chats, setChats] = useState([
    {
      id: 1,
      name: "Dr. Sarah Wilson",
      lastMessage: "Your test results look good",
      unread: 2,
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150",
      isOnline: true,
      lastActive: new Date(),
      typing: false
    },
    {
      id: 2,
      name: "Dr. John Smith",
      lastMessage: "See you at your appointment",
      avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150",
      isOnline: false,
      lastActive: new Date(Date.now() - 1800000), // 30 minutes ago
      typing: false
    },
    {
      id: 3,
      name: "Dr. Emily Brown",
      lastMessage: "Your prescription is ready",
      unread: 1,
      avatar: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=150",
      isOnline: true,
      lastActive: new Date(),
      typing: false
    },
  ]);

  // Simulate typing indicator for random chats
  useEffect(() => {
    const interval = setInterval(() => {
      const randomChatIndex = Math.floor(Math.random() * chats.length);
      if (!chats[randomChatIndex].typing && chats[randomChatIndex].isOnline) {
        setChats(prevChats => 
          prevChats.map((chat, index) => 
            index === randomChatIndex ? { ...chat, typing: true } : chat
          )
        );

        // Stop typing after 2-3 seconds
        setTimeout(() => {
          setChats(prevChats =>
            prevChats.map((chat, index) =>
              index === randomChatIndex ? { ...chat, typing: false } : chat
            )
          );
        }, 2000 + Math.random() * 1000);
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const filteredChats = chats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChatClick = (chatId) => {
    onSelectChat(chatId);
    // Clear unread messages when chat is selected
    setChats(
      chats.map((chat) => (chat.id === chatId ? { ...chat, unread: 0 } : chat))
    );
  };

  const sortedChats = [...filteredChats].sort((a, b) => {
    // Online users first
    if (a.isOnline && !b.isOnline) return -1;
    if (!a.isOnline && b.isOnline) return 1;
    
    // Then by unread messages
    if (a.unread && !b.unread) return -1;
    if (!a.unread && b.unread) return 1;
    
    // Finally by last active time
    return new Date(b.lastActive) - new Date(a.lastActive);
  });

  return (
    <div className="w-80 border-r border-gray-200 bg-white flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Messages</h2>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search messages"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sortedChats.length > 0 ? (
          sortedChats.map((chat) => (
            <ChatItem
              key={chat.id}
              chat={chat}
              isSelected={selectedChat === chat.id}
              onClick={() => handleChatClick(chat.id)}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
            <Search className="h-12 w-12 mb-2 text-gray-400" />
            <p className="text-center">No conversations found</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 bg-white">
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          <UserPlus className="h-5 w-5" />
          <span>New Conversation</span>
        </button>
      </div>
    </div>
  );
};

export default ChatList;