import React, { useState, useEffect, useRef } from 'react';
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff, MoreVertical, Minimize,Maximize2  } from 'lucide-react';
import Peer from 'peerjs';
import { set } from 'mongoose';

const VoCallSub = ({ VoiceCall = true, VideoCall = false, Vcall, setVcall }) => {
  const [callStatus, setCallStatus] = useState('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [remoteId, setRemoteId] = useState(""); // Other user’s ID
  const [peer, setPeer] = useState(null);
  const [conn, setConn] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [peerId, setPeerId] = useState(""); // Your ID

  const componentRef = useRef(null);
  const callPeer = () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      setLocalStream(stream);
      localVideoRef.current.srcObject = stream;

      const call = peer.call(remoteId, stream);
      call.on("stream", (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
      });
    });
  };

  const GSpeerid = async (callingId) => {
    const calling = await fetch("http://localhost:9000/api/setCallingId", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: localStorage.getItem("Email"),
        callingId: callingId
      })
    })
    Gpeerid();
  }
  const Gpeerid = async (callingId) => {
    const calling = await fetch("http://localhost:9000/api/getCallingId", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: localStorage.getItem("receiver_Email"),
      })
    })
    const callingdata = await calling.json()
    setRemoteId(callingdata.callingId)
  }


  useEffect(() => {
    // Initialize Peer
    const setPeers = async () => {
      const newPeer = new Peer();
      newPeer.on("open", (id) => {
        setPeerId(id); // Set your unique ID
      });
      // console.log(peerId)

      newPeer.on("connection", (connection) => {
        setConn(connection);
        connection.on("data", (data) => {
          console.log("Received:", data);
        });
      });

      newPeer.on("call", (call) => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
          setLocalStream(stream);
          localVideoRef.current.srcObject = stream;
          call.answer(stream); // Answer call with your stream

          call.on("stream", (remoteStream) => {
            remoteVideoRef.current.srcObject = remoteStream;
          });
        });
      });
      setPeer(newPeer);
    }
    if (!peerId) {
      setPeers()
    }
    if (peerId) {
      GSpeerid(peerId)
    }
  }, [peerId]);

  // Timer for call duration
  useEffect(() => {
    let interval;
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  // Format call duration as mm:ss
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleCallButton = () => {
    callPeer();
    if (callStatus === 'idle') {
      // Vcall?setVcall(false):setVcall(true);
      setCallStatus('calling');
      // In a real app, would initiate connection here
      setTimeout(() => setCallStatus('connected'), 2000); // Simulate connection after 2s
    } else {
      setCallStatus('idle');
      setCallDuration(0);
    }
  };

  const handleMouseDown = (e) => {
    if (e.target.closest('.drag-handle')) {
      setIsDragging(true);
      const rect = componentRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    if (isMinimized) setIsMinimized(false);
  };

  const getContainerStyles = () => {
    if (isFullScreen) {
      return {
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1000,
      };
    }
    
    if (isMinimized) {
      return {
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '240px',
        zIndex: 1000,
        transition: isDragging ? 'none' : 'all 0.3s ease'
      };
    }

    return {
      position: 'absolute',
      left: `${position.x}px`,
      top: `${position.y}px`,
      width: '500px',
      zIndex: 1000,
      transition: isDragging ? 'none' : 'all 0.3s ease'
    };
  };

  return (
    <div
      ref={componentRef}
      className={`${isDragging ? 'cursor-grabbing' : ''}`}
      style={getContainerStyles()}
    >
      <div className="flex flex-col bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-700 h-fit max-h-[100vh]">
        {/* Header */}
        <div className="bg-gray-800 text-white py-3 px-4 flex items-center justify-between drag-handle cursor-grab">
          <div className="flex items-center space-x-3">
            <div className={`h-3 w-3 rounded-full ${
              callStatus === 'connected' ? 'bg-green-500 animate-pulse' : 
              callStatus === 'calling' ? 'bg-yellow-500 animate-pulse' : 
              'bg-red-500'
            }`}></div>
            <span className="font-semibold text-gray-100">
              {callStatus === 'idle' ? 'Start Call' :
               callStatus === 'calling' ? 'Calling...' : 'In Call'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Minimize size={18} />
            </button>
            <button 
              onClick={toggleFullScreen}
              className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Maximize2 size={18} />
            </button>
          </div>
        </div>

        {/* Video container */}
        {!isMinimized && (
          <div className="relative bg-gray-950 flex-grow">
            <div className="w-full h-full flex align-center justify-center relative">
              <video 
                ref={remoteVideoRef} 
                autoPlay 
                playsInline 
                className="w-ful  object-cover"
              />
              {callStatus === 'idle' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <h3 className="text-lg font-medium mb-2">{peerId}</h3>
                    <h3 className="text-lg font-medium mb-2">Ready to Call</h3>
                    <p className="text-sm">Click the phone button to start</p>
                  </div>
                </div>
              )}
            </div>
            
            {callStatus !== 'idle' && (
              <div className={`absolute ${isFullScreen ? 'bottom-8 right-8 w-48' : 'bottom-4 right-4 w-32'} aspect-video`}>
                <video 
                  ref={localVideoRef} 
                  autoPlay 
                  playsInline 
                  muted
                  className="w-full h-full object-cover rounded-lg border-2 border-gray-700 shadow-lg"
                />
              </div>
            )}

            {callStatus === 'connected' && (
              <div className="absolute top-4 left-4 bg-black bg-opacity-60 px-3 py-1.5 rounded-full text-white text-sm">
                {formatDuration(callDuration)}
              </div>
            )}
          </div>
        )}

        {/* Controls */}
        <div className={`bg-gray-800 flex items-center justify-around ${isMinimized ? 'p-2' : 'p-4'}`}>
          {isMinimized ? (
            <div className="flex items-center space-x-3">
              <button
                onClick={handleCallButton}
                className={`rounded-full p-2.5 ${
                  callStatus !== 'idle' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                } transition-colors`}
              >
                {callStatus === 'idle' ? 
                  <Phone size={18} color="white" /> : 
                  <PhoneOff size={18} color="white" />}
              </button>
              {callStatus === 'connected' && (
                <span className="text-gray-300 text-sm">
                  {formatDuration(callDuration)}
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-around w-full">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`rounded-full p-4 transition-colors ${
                  isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {isMuted ? <MicOff size={22} color="white" /> : <Mic size={22} color="white" />}
              </button>

              <button
                onClick={handleCallButton}
                className={`rounded-full p-5 transition-colors ${
                  callStatus !== 'idle' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {callStatus === 'idle' ? 
                  <Phone size={24} color="white" /> : 
                  <PhoneOff size={24} color="white" />}
              </button>

              {VideoCall && (
                <button
                  onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                  className={`rounded-full p-4 transition-colors ${
                    !isVideoEnabled ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {isVideoEnabled ? 
                    <Video size={22} color="white" /> : 
                    <VideoOff size={22} color="white" />}
                </button>
              )}

              <button className="rounded-full p-4 bg-gray-700 hover:bg-gray-600 transition-colors">
                <MoreVertical size={22} color="white" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoCallSub;