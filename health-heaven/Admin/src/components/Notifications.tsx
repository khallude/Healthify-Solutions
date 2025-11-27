import React, { useState } from "react";
import {
  Bell,
  Check,
  AlertTriangle,
  Info,
  Mail,
  Megaphone,
  X,
  Search,
} from "lucide-react";

export type NotificationType = "new appointment" | "new doctor" | "new user";

export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: NotificationType;
  read: boolean;
  sender?: string;
  priority?: "low" | "medium" | "high";
}

interface NotificationsProps {
  darkMode: boolean;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

const Notifications: React.FC<NotificationsProps> = ({
  darkMode,
  notifications,
  setNotifications,
}) => {
  const [selectedType, setSelectedType] = useState<NotificationType | "all">(
    "all"
  );
  const [searchTerm, setSearchTerm] = useState("");

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case "new appointment":
        return <Megaphone className="w-5 h-5" />;
      case "new doctor":
        return <Bell className="w-5 h-5" />;
      case "new user":
        return <Mail className="w-5 h-5" />;
    }
  };

  const getTypeStyles = (type: NotificationType) => {
    switch (type) {
      case "new appointment":
        return "text-blue-500 bg-blue-100 dark:bg-blue-500/20";
      case "new doctor":
        return "text-green-500 bg-green-100 dark:bg-green-500/20";
      case "new user":
        return "text-yellow-500 bg-yellow-100 dark:bg-yellow-500/20";
    }
  };

  const filteredNotifications = notifications
    .filter(
      (notification) =>
        selectedType === "all" || notification.type === selectedType
    )
    .filter(
      (notification) =>
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (notification.sender
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ??
          false)
    );

  return (
    <div
      className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"} p-6`}
    >
      <div
        className={`max-w-4xl mx-auto rounded-xl shadow-xl overflow-hidden ${
          darkMode ? "bg-gray-800 ring-1 ring-gray-700" : "bg-white"
        }`}
      >
        {/* Header */}
        <div
          className={`px-6 py-4 ${
            darkMode ? "bg-gray-800/50" : "bg-gray-50/50"
          } border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}
        >
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell
                  className={`w-6 h-6 ${
                    darkMode ? "text-blue-400" : "text-blue-500"
                  }`}
                />
                <h2
                  className={`text-xl font-bold ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Notifications & Messages
                </h2>
              </div>
              <button
                onClick={markAllAsRead}
                className={`text-sm px-3 py-1.5 rounded-lg ${
                  darkMode
                    ? "text-blue-400 hover:bg-blue-500/10"
                    : "text-blue-500 hover:bg-blue-50"
                } transition-colors duration-150`}
              >
                Mark all as read
              </button>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                    darkMode
                      ? "bg-gray-700 text-white placeholder-gray-400 border-gray-600"
                      : "bg-white text-gray-900 placeholder-gray-500 border-gray-200"
                  } border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {(
                  ["all", "new appointment", "new doctor", "new user"] as const
                ).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 whitespace-nowrap ${
                      selectedType === type
                        ? "bg-blue-500 text-white"
                        : darkMode
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredNotifications.length === 0 ? (
            <div
              className={`text-center py-12 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No notifications found</p>
              <p className="text-sm mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 ${
                  !notification.read
                    ? darkMode
                      ? "bg-gray-700/50"
                      : "bg-blue-50/50"
                    : ""
                } transition-colors duration-150`}
              >
                <div className="flex gap-4">
                  <div
                    className={`p-2 rounded-lg ${getTypeStyles(
                      notification.type
                    )}`}
                  >
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3
                          className={`font-semibold ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {notification.title}
                        </h3>
                        {notification.sender && (
                          <p
                            className={`text-sm ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            From: {notification.sender}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {notification.priority && (
                          <span
                            className={`px-2 py-1 text-xs rounded-full font-medium ${
                              notification.priority === "high"
                                ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                                : notification.priority === "medium"
                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400"
                                : "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                            }`}
                          >
                            {notification.priority.charAt(0).toUpperCase() +
                              notification.priority.slice(1)}
                          </span>
                        )}
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className={`p-1 rounded-lg ${
                              darkMode
                                ? "hover:bg-gray-600"
                                : "hover:bg-gray-100"
                            } transition-colors duration-150`}
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4 text-blue-500" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className={`p-1 rounded-lg ${
                            darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
                          } transition-colors duration-150`}
                          title="Delete notification"
                        >
                          <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
                        </button>
                      </div>
                    </div>
                    <p
                      className={`mt-2 text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {notification.message}
                    </p>
                    <span
                      className={`text-xs mt-2 block ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {notification.time}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
