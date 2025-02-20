import React, { useState, useEffect, useRef } from 'react';
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff, MoreVertical, Minimize, Maximize } from 'lucide-react';

const VoCallSub = ({VoiceCall=true,VideoCall=false}) => {
  const [callStatus, setCallStatus] = useState('idle'); // idle, calling, connected
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMinimized, setIsMinimized] = useState(false);
  
  const componentRef = useRef(null);
  
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
    if (callStatus === 'idle') {
      setCallStatus('calling');
      // In a real app, would initiate connection here
      setTimeout(() => setCallStatus('connected'), 2000); // Simulate connection after 2s
    } else {
      setCallStatus('idle');
      setCallDuration(0);
    }
  };
  
  // Dragging handlers
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
  
  // Add global event listeners for mouse movement and up
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

  const handleMinimizeToggle = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div 
      ref={componentRef}
      className={`absolute ${isDragging ? 'cursor-grabbing' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 1000,
        width: isMinimized ? 'auto' : '100%',
        maxWidth: isMinimized ? '160px' : '420px',
        transition: isDragging ? 'none' : 'all 0.2s ease'
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="flex flex-col bg-gray-100 rounded-lg overflow-hidden shadow-lg border border-gray-300">
        {/* Header / Drag handle */}
        <div className="bg-gray-800 text-white py-2 px-3 flex items-center justify-between drag-handle cursor-grab">
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
            <span className="font-medium">{
              callStatus === 'idle' ? 'Start Call' : 
              callStatus === 'calling' ? 'Calling...' : 
              'In Call'
            }</span>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={handleMinimizeToggle} className="p-1 hover:bg-gray-700 rounded">
              {isMinimized ? <Maximize size={16} /> : <Minimize size={16} />}
            </button>
          </div>
        </div>
        
        {/* Video area - only show when not minimized */}
        {!isMinimized && (
          <div className="relative h-64 bg-black">
            {isVideoEnabled ? (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white">
                {/* This would be replaced with actual video stream */}
                <div className="text-center">
                  {VideoCall &&  callStatus === 'idle' && <p>Start a video call</p>}
                  {callStatus === 'calling' && <p>Calling...</p>}
                  {callStatus === 'connected' && <p>Connected</p>}
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <div className="h-32 w-32 rounded-full bg-gray-600 flex items-center justify-center">
                  <span className="text-white text-4xl">JD</span>
                </div>
              </div>
            )}
            
            {/* Small self-view when connected */}
            {VideoCall && callStatus !== 'idle' && (
              <div className="absolute bottom-4 right-4 h-24 w-32 bg-gray-500 rounded-lg overflow-hidden border-2 border-white">
                {/* This would show the local video preview */}
                <div className="h-full w-full flex items-center justify-center">
                  <span className="text-white text-xs">You</span>
                </div>
              </div>
            )}
            
            {/* Call duration if connected */}
            {callStatus === 'connected' && (
              <div className="absolute top-4 left-4 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-sm">
                {formatDuration(callDuration)}
              </div>
            )}
          </div>
        )}
        
        {/* Controls - if minimized, show compact version */}
        <div className={`bg-gray-800 flex items-center justify-around px-4 ${isMinimized ? 'py-2' : 'h-20'}`}>
          {isMinimized ? (
            <>
              <button 
                onClick={handleCallButton}
                className={`rounded-full p-2 ${callStatus !== 'idle' ? 'bg-red-500' : 'bg-green-500'}`}
              >
                {callStatus === 'idle' ? 
                  <Phone size={16} color="white" /> : 
                  <PhoneOff size={16} color="white" />
                }
              </button>
              
              {callStatus === 'connected' && (
                <span className="text-white text-xs ml-2">{formatDuration(callDuration)}</span>
              )}
            </>
          ) : (
            <>
              <button 
                onClick={() => setIsMuted(!isMuted)} 
                className={`rounded-full p-3 ${isMuted ? 'bg-red-500' : 'bg-gray-700'}`}
              >
                {isMuted ? <MicOff size={24} color="white" /> : <Mic size={24} color="white" />}
              </button>
              
              <button 
                onClick={handleCallButton}
                className={`rounded-full p-5 ${callStatus !== 'idle' ? 'bg-red-500' : 'bg-green-500'}`}
              >
                {callStatus === 'idle' ? 
                  <Phone size={24} color="white" /> : 
                  <PhoneOff size={24} color="white" />
                }
              </button>
              
              {VideoCall &&
              <button 
                onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                className={`rounded-full p-3 ${!isVideoEnabled ? 'bg-red-500' : 'bg-gray-700'}`}
              >
                {isVideoEnabled ? <Video size={24} color="white" /> : <VideoOff size={24} color="white" />}
              </button>}
              
              <button className="rounded-full p-3 bg-gray-700">
                <MoreVertical size={24} color="white" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoCallSub;