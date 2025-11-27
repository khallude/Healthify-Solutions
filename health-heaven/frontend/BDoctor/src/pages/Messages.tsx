import React from 'react';
import { Search, Edit } from 'lucide-react';

const messages = [
  {
    id: 1,
    sender: {
      name: 'Dr. Emily White',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100',
      online: true
    },
    message: 'Patient lab results are ready for review',
    time: '10:30 AM',
    unread: true
  },
  {
    id: 2,
    sender: {
      name: 'Dr. James Wilson',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100',
      online: false
    },
    message: 'Can we discuss the treatment plan for Mr. Chen?',
    time: 'Yesterday',
    unread: true
  },
  {
    id: 3,
    sender: {
      name: 'Nurse Sarah',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100',
      online: true
    },
    message: 'Emergency consultation needed in Room 302',
    time: 'Yesterday',
    unread: false
  }
];

export default function Messages() {
  return (
    <div className="h-[calc(100vh-8rem)] flex">
      {/* Messages List */}
      <div className="w-1/3 border-r border-gray-200 bg-white">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100%-5rem)]">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-4 hover:bg-gray-50 cursor-pointer ${
                message.unread ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={message.sender.photo}
                    alt={message.sender.name}
                    className="w-12 h-12 rounded-full"
                  />
                  {message.sender.online && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 rounded-full ring-2 ring-white"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {message.sender.name}
                    </h3>
                    <p className="text-xs text-gray-500">{message.time}</p>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{message.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-gray-50 flex flex-col">
        <div className="p-4 bg-white border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <img
              src={messages[0].sender.photo}
              alt={messages[0].sender.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="text-sm font-medium text-gray-900">{messages[0].sender.name}</h3>
              <p className="text-xs text-gray-500">Online</p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4">
          {/* Chat messages would go here */}
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a conversation to start messaging
          </div>
        </div>

        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="p-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
              <Edit className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}