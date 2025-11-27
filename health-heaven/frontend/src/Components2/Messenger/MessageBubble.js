import React from "react";
import { Check, CheckCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const MessageBubble = ({ message }) => {
  const { text, sender, timestamp, status, file } = message;
  const isUser = sender === "user";

  const StatusIcon = () => {
    if (status === "sent") return <Check className="h-4 w-4" />;
    if (status === "delivered") return <CheckCheck className="h-4 w-4 text-gray-500" />;
    if (status === "read") return <CheckCheck className="h-4 w-4 text-blue-500" />;
    return null;
  };

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`max-w-[70%] ${
          isUser
            ? "bg-blue-500 text-white rounded-l-lg rounded-tr-lg"
            : "bg-gray-100 text-gray-900 rounded-r-lg rounded-tl-lg"
        } px-4 py-2 shadow-sm`}
      >
        {file && (
          <div className="mb-2">
            {file.type.startsWith("image/") ? (
              <img
                src={file.url}
                alt="Shared file"
                className="max-w-full rounded-lg"
              />
            ) : (
              <div className="bg-white bg-opacity-10 rounded p-2 text-sm">
                📎 {file.name}
              </div>
            )}
          </div>
        )}
        <p className="text-sm">{text}</p>
        <div
          className={`flex items-center justify-end gap-1 mt-1 text-xs ${
            isUser ? "text-white text-opacity-80" : "text-gray-500"
          }`}
        >
          <span>{formatDistanceToNow(timestamp, { addSuffix: true })}</span>
          {isUser && <StatusIcon />}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;