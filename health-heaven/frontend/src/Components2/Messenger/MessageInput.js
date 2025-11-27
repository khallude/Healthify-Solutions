import React, { useState } from "react";
import { Send, Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import FileUpload from "./FileUpload";

const MessageInput = ({ onSend }) => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() || selectedFile) {
      onSend(message.trim(), selectedFile || undefined);
      setMessage("");
      setSelectedFile(null);
    }
  };

  const onEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
      <div className="flex items-center gap-2">
        <FileUpload onFileSelect={handleFileSelect} />

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Smile className="h-5 w-5 text-gray-500" />
          </button>

          {showEmojiPicker && (
            <div className="absolute bottom-full left-0 mb-2">
              <EmojiPicker onEmojiClick={onEmojiClick} autoFocusSearch={false} />
            </div>
          )}
        </div>

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-blue-500"
        />

        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          disabled={!message.trim() && !selectedFile}
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
