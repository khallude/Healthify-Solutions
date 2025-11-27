import React from "react";
import { formatDistanceToNow } from "date-fns";

const ChatItem = ({ chat, isSelected, onClick }) => {
  const { name, lastMessage, unread, avatar, isOnline, lastActive, typing } = chat;

  return (
    <div
      onClick={onClick}
      className={`p-4 cursor-pointer transition-colors ${
        isSelected
          ? "bg-blue-50 hover:bg-blue-100"
          : "hover:bg-gray-50"
      }`}
    >
      <div className="flex items-center space-x-4">
        <div className="relative">
          <img
            src={avatar}
            alt={name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div
            className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${
              isOnline ? "bg-green-500" : "bg-gray-400"
            }`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {name}
            </h3>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(lastActive, { addSuffix: true })}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500 truncate">
              {typing ? (
                <span className="text-blue-500">Typing...</span>
              ) : (
                lastMessage
              )}
            </p>
            {unread > 0 && (
              <span className="ml-2 bg-blue-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                {unread}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatItem;