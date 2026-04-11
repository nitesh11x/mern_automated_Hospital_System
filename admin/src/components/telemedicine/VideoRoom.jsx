import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Peer from "peerjs";
import { Mic, MicOff, Video, VideoOff, PhoneOff, User, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const SOCKET_SERVER_URL = import.meta.env.VITE_APP_SOCKET_URL || `http://${window.location.hostname}:1111`; // Should use env var in prod

const VideoRoom = ({ appointment, currentUser, onClose }) => {
  const [peerId, setPeerId] = useState(null);
  const [remotePeerId, setRemotePeerId] = useState(null);
  const [stream, setStream] = useState(null);
  const [callActive, setCallActive] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);

  const socketRef = useRef(null);
  const peerInstance = useRef(null);
  const streamRef = useRef(null);
  const myVideo = useRef();
  const userVideo = useRef();
  const activeCall = useRef(null);

  useEffect(() => {
    // 1. Init Socket
    socketRef.current = io(SOCKET_SERVER_URL, { withCredentials: true });
    socketRef.current.emit("join_appointment_room", { 
      appointmentId: appointment._id,
      userId: currentUser._id 
    });

    const initiateCall = (targetPeerIdToCall) => {
      const activeStream = streamRef.current;
      if (!targetPeerIdToCall || !peerInstance.current || !activeStream) return;
      
      socketRef.current.emit("call_user", {
        appointmentId: appointment._id,
        callerId: currentUser._id,
        peerId: peerInstance.current.id,
        callerName: currentUser.name || currentUser.firstName || "User",
      });

      const call = peerInstance.current.call(targetPeerIdToCall, activeStream);
      activeCall.current = call;
      setCallActive(true);
      setRemotePeerId(targetPeerIdToCall);

      call.on("stream", (userVideoStream) => {
        if (userVideo.current) userVideo.current.srcObject = userVideoStream;
      });
    };

    // 2. Fetch Media Stream natively
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        streamRef.current = currentStream;
        if (myVideo.current) myVideo.current.srcObject = currentStream;

        // 3. Init PeerJS using the default PeerJS public cloud network
        const peer = new Peer();

        peer.on("open", (id) => {
          setPeerId(id);
          // Broadcast presence and Peer ID to the room
          socketRef.current.emit("join_appointment_room", { 
            appointmentId: appointment._id, 
            userId: currentUser._id,
            peerId: id // Share peer ID on join
          });
        });

        peer.on("call", (call) => {
          // Answer incoming call automatically if in room
          setRemotePeerId(call.peer);
          call.answer(currentStream);
          activeCall.current = call;
          setCallActive(true);

          call.on("stream", (userVideoStream) => {
            if (userVideo.current) userVideo.current.srcObject = userVideoStream;
          });
        });

        peerInstance.current = peer;
      })
      .catch((err) => {
        console.error("Failed to get local stream", err);
        alert("Camera or microphone access denied. Please allow permissions.");
      });

    // 4. Listeners for socket triggers
    socketRef.current.on("user_joined", ({ userId, peerId: remoteId }) => {
      console.log(`User ${userId} joined room with PeerID: ${remoteId}`);
      
      // AUTO-CALL LOGIC:
      // Whoever is already in the room will receive this event when the other person joins.
      // So the person already here will initiate the call to the newcomer.
      if (remoteId && remoteId !== peerInstance.current?.id) {
        // Slight delay to ensure their peer instance is ready to answer
        setTimeout(() => initiateCall(remoteId), 1500);
      }
    });

    socketRef.current.on("incoming_call", ({ callerId, peerId: callerPeerId, callerName }) => {
      console.log(`Incoming call signal from ${callerName} (${callerPeerId})`);
    });

    socketRef.current.on("call_ended", () => {
      endCallLocally();
    });

    return () => {
      endCallLocally();
      if (socketRef.current) socketRef.current.disconnect();
      if (peerInstance.current) peerInstance.current.destroy();
      if (stream) stream.getTracks().forEach((track) => track.stop());
    };
  }, [appointment._id, currentUser._id]);



  const endCallLocally = () => {
    if (activeCall.current) {
      activeCall.current.close();
    }
    setCallActive(false);
    setRemotePeerId(null);
    if (userVideo.current) userVideo.current.srcObject = null;
  };

  const handleEndCall = () => {
    endCallLocally();
    socketRef.current.emit("end_call", { appointmentId: appointment._id, senderId: currentUser._id });
    onClose();
  };

  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoMuted(!videoTrack.enabled);
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/95 backdrop-blur-xl z-999 flex flex-col items-center justify-center font-sans p-4"
    >
      <div className="absolute top-6 left-6 text-white text-left">
        <h2 className="text-xl font-black uppercase tracking-widest text-indigo-400">Telemedicine Link</h2>
        <p className="text-xs font-mono text-slate-400 mt-1">Ref - {appointment.appointmentId}</p>
        <div className="flex gap-2 mt-4">
           {/* Demo trigger: In a real app, you'd auto-call if the other peer is detected in the room */}
           {!callActive && peerId && (
            <div className="bg-indigo-900/50 border border-indigo-500/50 p-3 rounded-sm flex items-center gap-3">
              <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider animate-pulse">
                Waiting for Peer Connection on Socket Room...
              </span>
              <Loader2 size={14} className="text-indigo-400 animate-spin" />
            </div>
           )}
        </div>
      </div>

      <div className="relative w-full max-w-5xl aspect-video rounded-sm overflow-hidden bg-slate-900 shadow-2xl border border-slate-800">
        
        {/* Remote Video (Full Screen inside container) */}
        {callActive ? (
          <video 
            playsInline 
            ref={userVideo} 
            autoPlay 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-700">
            <User size={80} className="mb-4 opacity-20" />
            <p className="text-sm font-black uppercase tracking-widest text-slate-600">No active stream</p>
          </div>
        )}

        {/* Local Video (Floating bottom right) */}
        <div className={`absolute bottom-6 right-6 w-48 aspect-video bg-black rounded-sm overflow-hidden shadow-2xl border-2 ${isVideoMuted ? 'border-rose-500/50' : 'border-indigo-500/50'}`}>
           <video 
            playsInline 
            muted 
            ref={myVideo} 
            autoPlay 
            className={`w-full h-full object-cover ${isVideoMuted ? 'opacity-0' : 'opacity-100'}`} 
          />
          {isVideoMuted && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
              <VideoOff size={24} className="text-rose-500" />
            </div>
          )}
        </div>

        {/* Controls Overlay */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-slate-900/80 backdrop-blur-md px-8 py-4 rounded-full border border-slate-800 shadow-2xl">
          <button 
            onClick={toggleAudio}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isAudioMuted ? 'bg-rose-500 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'}`}
          >
            {isAudioMuted ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          
          <button 
            onClick={toggleVideo}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isVideoMuted ? 'bg-rose-500 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'}`}
          >
            {isVideoMuted ? <VideoOff size={20} /> : <Video size={20} />}
          </button>

          <div className="w-px h-8 bg-slate-700 mx-2"></div>

          <button 
            onClick={handleEndCall}
            className="w-16 h-12 rounded-full flex items-center justify-center bg-rose-600 hover:bg-rose-700 text-white shadow-lg transition-all"
          >
            <PhoneOff size={24} />
          </button>
        </div>

      </div>
    </motion.div>
  );
};

export default VideoRoom;
