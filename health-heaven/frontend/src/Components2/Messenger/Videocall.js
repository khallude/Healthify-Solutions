import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Mic, MicOff, Video, VideoOff, PhoneOff, Volume2, Phone, MonitorSmartphone } from "lucide-react";
import { useNavigate } from "react-router-dom";

const VideoCall = ({ onEnd }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isCallConnected, setIsCallConnected] = useState(false);
  const [isRinging, setIsRinging] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const ringingAudioRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate ringing for 5 seconds before auto-connecting
    const ringingTimeout = setTimeout(() => {
      setIsRinging(false);
      startCamera();
    }, 5000);

    // Play ringing sound
    ringingAudioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2906/2906-preview.mp3');
    ringingAudioRef.current.loop = true;
    ringingAudioRef.current.play().catch(err => console.log('Audio play failed:', err));

    return () => {
      clearTimeout(ringingTimeout);
      if (ringingAudioRef.current) {
        ringingAudioRef.current.pause();
        ringingAudioRef.current = null;
      }
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      setIsCallConnected(true);
      // Stop ringing sound when connected
      if (ringingAudioRef.current) {
        ringingAudioRef.current.pause();
        ringingAudioRef.current = null;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const tracks = localVideoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const toggleMute = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const audioTrack = localVideoRef.current.srcObject.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = isMuted;
        setIsMuted(!isMuted);
      }
    }
  };

  const toggleVideo = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const videoTrack = localVideoRef.current.srcObject.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = isVideoOff;
        setIsVideoOff(!isVideoOff);
      }
    }
  };

  const switchToAudio = () => {
    setIsVideoOff(true);
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const videoTrack = localVideoRef.current.srcObject.getVideoTracks()[0];
      if (videoTrack) videoTrack.enabled = false;
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  const handleEndCall = () => {
    stopCamera();
    if (ringingAudioRef.current) {
      ringingAudioRef.current.pause();
      ringingAudioRef.current = null;
    }
    if (onEnd) {
      onEnd();
    }
    navigate("/messenger");
  };

  if (isRinging) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150"
          alt="Doctor"
          className="w-32 h-32 rounded-full object-cover ring-4 ring-white/10 animate-pulse mb-6"
        />
        <h2 className="text-2xl font-semibold mb-2">Dr. Sarah Wilson</h2>
        <p className="text-gray-400 mb-8">Incoming video call...</p>
        <div className="flex gap-6">
          <button
            onClick={handleEndCall}
            className="p-6 bg-red-500 hover:bg-red-600 rounded-full transform transition-all duration-200 hover:scale-110 ring-2 ring-red-400/50"
          >
            <PhoneOff className="h-8 w-8" />
          </button>
          <button
            onClick={() => setIsRinging(false)}
            className="p-6 bg-green-500 hover:bg-green-600 rounded-full transform transition-all duration-200 hover:scale-110 ring-2 ring-green-400/50"
          >
            <Phone className="h-8 w-8" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col">
      {/* Header with enhanced styling */}
      <div className="p-4 flex items-center justify-between bg-black/30 backdrop-blur-sm">
        <button
          onClick={handleEndCall}
          className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Chat</span>
        </button>
        <div className="text-center">
          <h2 className="text-lg font-semibold">Dr. Sarah Wilson</h2>
          <div className={`flex items-center justify-center gap-2 ${isCallConnected ? 'text-green-400' : 'text-yellow-400'}`}>
            <span className={`h-2 w-2 rounded-full ${isCallConnected ? 'bg-green-400' : 'bg-yellow-400'} animate-pulse`}></span>
            <p className="text-sm">{isCallConnected ? "Connected" : "Connecting..."}</p>
          </div>
        </div>
        <button
          onClick={toggleFullScreen}
          className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
        >
          <MonitorSmartphone className="h-5 w-5" />
        </button>
      </div>

      {/* Enhanced video container with better positioning */}
      <div className="flex-1 relative bg-black/20">
        {/* Remote video with improved layout */}
        <div className="absolute inset-0 flex items-center justify-center">
          <video
            ref={remoteVideoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
          />
          {isVideoOff && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800/90">
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150"
                alt="Doctor"
                className="w-32 h-32 rounded-full object-cover ring-4 ring-white/10"
              />
            </div>
          )}
        </div>
        
        {/* Local video with enhanced PiP styling */}
        <div className="absolute bottom-4 right-4 w-48 h-36 rounded-xl overflow-hidden shadow-lg ring-1 ring-white/20 backdrop-blur-sm">
          <video
            ref={localVideoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted
          />
          {isVideoOff && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800/90">
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150"
                alt="You"
                className="w-16 h-16 rounded-full object-cover ring-2 ring-white/10"
              />
            </div>
          )}
        </div>
      </div>

      {/* Enhanced controls with better styling and animations */}
      <div className="p-6 bg-black/30 backdrop-blur-sm flex justify-center gap-4">
        <button
          onClick={toggleMute}
          className={`p-4 rounded-full transform transition-all duration-200 hover:scale-110 ${
            isMuted 
              ? "bg-red-500 hover:bg-red-600 ring-red-400/50" 
              : "bg-gray-600 hover:bg-gray-700"
          } ring-2 ring-opacity-50`}
        >
          {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </button>
        <button
          onClick={toggleVideo}
          className={`p-4 rounded-full transform transition-all duration-200 hover:scale-110 ${
            isVideoOff 
              ? "bg-red-500 hover:bg-red-600 ring-red-400/50" 
              : "bg-gray-600 hover:bg-gray-700"
          } ring-2 ring-opacity-50`}
        >
          {isVideoOff ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
        </button>
        <button
          onClick={switchToAudio}
          className="p-4 bg-blue-500 hover:bg-blue-600 rounded-full transform transition-all duration-200 hover:scale-110 ring-2 ring-blue-400/50"
        >
          <Volume2 className="h-6 w-6" />
        </button>
        <button
          onClick={handleEndCall}
          className="p-4 bg-red-500 hover:bg-red-600 rounded-full transform transition-all duration-200 hover:scale-110 ring-2 ring-red-400/50"
        >
          <PhoneOff className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default VideoCall;