import React, { useState, useEffect, useRef } from "react";
import { Phone, Video } from "lucide-react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import AudioCall from "./AudioCall";
import VideoCall from "./Videocall";

// Mock message history for each chat
const mockMessageHistory = {
  1: [
    {
      id: "1",
      text: "Hello! I'm Dr. Sarah Wilson. How can I assist you today?",
      sender: "other",
      timestamp: new Date(Date.now() - 3600000),
      status: "read",
    },
    {
      id: "2",
      text: "I'd like to discuss my recent test results.",
      sender: "user",
      timestamp: new Date(Date.now() - 3300000),
      status: "read",
    },
    {
      id: "3",
      text: "Of course! I've reviewed them and everything looks good. Your cholesterol levels have improved significantly.",
      sender: "other",
      timestamp: new Date(Date.now() - 3000000),
      status: "read",
    }
  ],
  2: [
    {
      id: "1",
      text: "Hi there! Dr. John Smith here. Your appointment is scheduled for tomorrow at 2 PM.",
      sender: "other",
      timestamp: new Date(Date.now() - 7200000),
      status: "read",
    },
    {
      id: "2",
      text: "Thank you for the reminder. Should I bring anything specific?",
      sender: "user",
      timestamp: new Date(Date.now() - 6900000),
      status: "read",
    }
  ],
  3: [
    {
      id: "1",
      text: "Hello! Dr. Emily Brown here. Your prescription has been sent to the pharmacy.",
      sender: "other",
      timestamp: new Date(Date.now() - 5400000),
      status: "read",
    },
    {
      id: "2",
      text: "Great, when can I pick it up?",
      sender: "user",
      timestamp: new Date(Date.now() - 5100000),
      status: "read",
    },
    {
      id: "3",
      text: "It should be ready in about 30 minutes.",
      sender: "other",
      timestamp: new Date(Date.now() - 4800000),
      status: "read",
    }
  ]
};

const chats = [
  {
    id: 1,
    name: "Dr. Sarah Wilson",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150",
    isOnline: true,
  },
  {
    id: 2,
    name: "Dr. John Smith",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150",
    isOnline: false,
  },
  {
    id: 3,
    name: "Dr. Emily Brown",
    avatar: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=150",
    isOnline: true,
  },
];

const ChatWindow = ({ chatId }) => {
  const [isAudioCall, setIsAudioCall] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Find the current chat
    const chat = chats.find((c) => c.id === chatId);
    setCurrentChat(chat);

    // Load message history for the selected chat
    if (chatId && mockMessageHistory[chatId]) {
      setMessages(mockMessageHistory[chatId]);
    }
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (text, file) => {
    const newMessage = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
      status: "sent",
    };

    if (file) {
      const fileUrl = URL.createObjectURL(file);
      newMessage.file = {
        name: file.name,
        url: fileUrl,
        type: file.type,
      };
    }

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Simulate message delivery status updates
    setTimeout(() => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg
        )
      );
    }, 1000);

    setTimeout(() => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: "read" } : msg
        )
      );

      // Simulate doctor's response
      const responses = [
        "I'll review this and get back to you shortly.",
        "Thank you for sharing that information.",
        "Let me check your records and respond in detail.",
        "I understand your concern. Let's discuss this further.",
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const responseMessage = {
        id: Date.now().toString() + 1,
        text: randomResponse,
        sender: "other",
        timestamp: new Date(),
        status: "read",
      };

      setMessages((prevMessages) => [...prevMessages, responseMessage]);
    }, 2000);
  };

  if (!currentChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <div className="relative">
            <img
              src={currentChat.avatar}
              alt={currentChat.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div
              className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${
                currentChat.isOnline ? "bg-green-500" : "bg-gray-400"
              }`}
            />
          </div>
          <div className="ml-3">
            <h2 className="font-medium text-gray-900">{currentChat.name}</h2>
            <p className="text-sm text-gray-500">
              {currentChat.isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setIsAudioCall(true);
              setIsVideoCall(false);
            }}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Phone className="h-5 w-5 text-gray-500" />
          </button>
          <button
            onClick={() => {
              setIsVideoCall(true);
              setIsAudioCall(false);
            }}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Video className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput onSend={handleSendMessage} />

      {isAudioCall && (
        <AudioCall
          onEnd={() => setIsAudioCall(false)}
          isOutgoing={true}
        />
      )}
      {isVideoCall && (
        <VideoCall
          onEnd={() => setIsVideoCall(false)}
          isOutgoing={true}
        />
      )}
    </div>
  );
};

export default ChatWindow;