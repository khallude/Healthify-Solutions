import React, { useState } from 'react';
import { Bell, Calendar, Clock, Repeat, Mail, MessageSquare, Phone, ChevronDown, Save } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SetReminder() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [recurrence, setRecurrence] = useState('none');
  const [notifyPush, setNotifyPush] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(false);
  const [notifySMS, setNotifySMS] = useState(false);
  const [message, setMessage] = useState('');
  const [isRecurrenceOpen, setIsRecurrenceOpen] = useState(false);

  // Valid recurrence values that backend accepts
  const validRecurrenceValues = ['None', 'Daily', 'Weekly', 'Monthly', 'Custom'];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the token exists
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("User not authenticated. Please log in.");
      return; // Prevent form submission if no token
    }

    // Validate the recurrence value
    if (!validRecurrenceValues.includes(recurrence)) {
      toast.error("Invalid recurrence value. Please select a valid recurrence.");
      return;
    }

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;

    const reminder = {
      date,
      time,
      recurrence,
      notifications: {
        push: notifyPush,
        email: notifyEmail,
        sms: notifySMS,
      },
      message,
      userId: userId, // Pass the token as userId
    };

    // Log reminder data to check what is being sent
    console.log("Reminder Data:", reminder);

    try {
      const response = await fetch("http://localhost:5000/api/reminders", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Attach the token to the Authorization header
          "Content-Type": "application/json", // Ensure the correct content type
        },
        body: JSON.stringify(reminder),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Failed to create reminder:", result);
        toast.error(`Error: ${result.message}`);
      } else {
        console.log("Reminder created successfully:", result);
        toast.success("Reminder saved successfully!");
        // Optionally, reset the form
        setDate('');
        setTime('');
        setRecurrence('none');
        setNotifyPush(true);
        setNotifyEmail(false);
        setNotifySMS(false);
        setMessage('');
      }
    } catch (error) {
      console.error("Error submitting reminder:", error);
      toast.error("An error occurred while creating the reminder.");
    }
  };

  const recurrenceOptions = [
    { value: 'None', label: 'None' },
    { value: 'Daily', label: 'Daily' },
    { value: 'Weekly', label: 'Weekly' },
    { value: 'Monthly', label: 'Monthly' },
    { value: 'Custom', label: 'Custom' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="flex items-center space-x-3 mb-8">
            <Bell className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Set Reminder</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Date and Time Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Date and Time
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Time
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Recurrence Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Repeat className="w-5 h-5 mr-2 text-blue-600" />
                Recurrence
              </h2>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsRecurrenceOpen(!isRecurrenceOpen)}
                  className="w-full px-4 py-2 text-left border border-gray-300 rounded-lg flex items-center justify-between hover:bg-gray-50"
                >
                  <span className="block truncate">
                    {recurrenceOptions.find(option => option.value === recurrence)?.label}
                  </span>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>
                {isRecurrenceOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                    {recurrenceOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                        onClick={() => {
                          setRecurrence(option.value);
                          setIsRecurrenceOpen(false);
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Notification Methods */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
                Notification Methods
              </h2>
              <div className="space-y-3">
                {[ 
                  { icon: Bell, label: 'Push Notifications', state: notifyPush, setState: setNotifyPush },
                  { icon: Mail, label: 'Email Notifications', state: notifyEmail, setState: setNotifyEmail },
                  { icon: Phone, label: 'SMS Alerts', state: notifySMS, setState: setNotifySMS }
                ].map(({ icon: Icon, label, state, setState }) => (
                  <label key={label} className="flex items-center space-x-3 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={state}
                        onChange={() => setState(!state)}
                        className="sr-only"
                      />
                      <div className={`w-10 h-6 rounded-full transition-colors ${state ? 'bg-blue-600' : 'bg-gray-200'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform transform ${state ? 'translate-x-5' : 'translate-x-1'} mt-1`} />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">{label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Message Content */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
                Reminder Message
              </h2>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your reminder message..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <Save className="w-5 h-5" />
              <span>Save Reminder</span>
            </button>
          </form>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}
