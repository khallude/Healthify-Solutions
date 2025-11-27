import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Mic, MicOff, PhoneOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AudioCall = ({ onEnd }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isCallConnected, setIsCallConnected] = useState(false);
  const audioRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    startAudio();
    return () => {
      stopAudio();
    };
  }, []);

  const startAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });
      audioRef.current = stream;
      setIsCallConnected(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      const tracks = audioRef.current.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const audioTrack = audioRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = isMuted;
        setIsMuted(!isMuted);
      }
    }
  };

  const handleEndCall = () => {
    stopAudio();
    if (onEnd) {
      onEnd();
    }
    navigate("/messenger");
  };

  return (
    <div className="fixed inset-0 bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between bg-gray-800">
        <button
          onClick={handleEndCall}
          className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Chat</span>
        </button>
        <div className="text-center">
          <h2 className="text-lg font-semibold">Dr. Sarah Wilson</h2>
          <p className="text-sm text-gray-400">
            {isCallConnected ? "Connected" : "Connecting..."}
          </p>
        </div>
        <div className="w-24" />
      </div>

      {/* Call interface */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center mb-8">
          <img
            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150"
            alt="Doctor"
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Dr. Sarah Wilson</h2>
        <p className="text-gray-400">
          {isCallConnected ? "Call in progress" : "Connecting..."}
        </p>
      </div>

      {/* Controls */}
      <div className="p-6 bg-gray-800 flex justify-center gap-4">
        <button
          onClick={toggleMute}
          className={`p-4 rounded-full ${
            isMuted ? "bg-red-500 hover:bg-red-600" : "bg-gray-600 hover:bg-gray-700"
          } transition-colors`}
        >
          {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </button>
        <button
          onClick={handleEndCall}
          className="p-4 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
        >
          <PhoneOff className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default AudioCall;