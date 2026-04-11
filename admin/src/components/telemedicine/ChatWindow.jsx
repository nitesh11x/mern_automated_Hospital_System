import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { 
  fetchChatHistoryThunk, 
  sendChatMessageThunk, 
  addMessageToStore, 
  clearChatStore 
} from "../../redux/slices/chat.slice";
import { Send, X, User, Stethoscope, Video, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import VideoRoom from "./VideoRoom";

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_URL; 

const ChatWindow = ({ appointment, currentUser, onClose }) => {
  const dispatch = useDispatch();
  const { messages, loading } = useSelector(state => state.chat);
  
  const [text, setText] = useState("");
  const [showVideo, setShowVideo] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  const socketRef = useRef(null);
  const endRef = useRef(null);
  const isDoc = currentUser.role?.toLowerCase() === "doctor";

  useEffect(() => {
    // 1. Fetch History
    dispatch(clearChatStore());
    dispatch(fetchChatHistoryThunk(appointment._id));

    // 2. Connect Socket
    socketRef.current = io(SOCKET_SERVER_URL, {
      withCredentials: true,
    });

    // 3. Join Room
    socketRef.current.emit("join_appointment_room", { 
      appointmentId: appointment._id, 
      userId: currentUser._id 
    });

    // 4. Listeners
    socketRef.current.on("receive_message", (msg) => {
      dispatch(addMessageToStore(msg));
      scrollToBottom();
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [dispatch, appointment._id, currentUser._id]);

  const scrollToBottom = () => {
    setTimeout(() => {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;

    const DetermineSenderType = () => {
      if (currentUser.role === "patient" || currentUser.role === "user") return "Patient";
      if (currentUser.role === "doctor") return "Doctor";
      return "Admin";
    };

    const senderType = DetermineSenderType();

    const msgData = {
      appointmentId: appointment._id,
      content: text,
      senderId: currentUser._id,
      senderName: currentUser.name || currentUser.firstName || "User",
      senderType
    };

    // Optimistic UI emission
    socketRef.current.emit("send_message", { ...msgData, _id: Date.now().toString() });
    
    // Database sync
    dispatch(sendChatMessageThunk(msgData));
    setText("");
  };

  const sendSystemMessage = (content) => {
    const DetermineSenderType = () => {
      if (currentUser.role === "doctor") return "Doctor";
      return "Patient";
    };

    const msgData = {
      appointmentId: appointment._id,
      content,
      senderId: currentUser._id,
      senderName: currentUser.name || currentUser.firstName || "System",
      senderType: DetermineSenderType()
    };

    socketRef.current.emit("send_message", { ...msgData, _id: Date.now().toString() });
    dispatch(sendChatMessageThunk(msgData));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.95 }}
      className="fixed bottom-4 right-4 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-sm shadow-2xl overflow-hidden flex flex-col border border-purple-100 z-50 h-128"
    >
      <div className="bg-linear-to-r from-purple-700 to-indigo-700 text-white p-4 flex justify-between items-center shadow-md z-10">
        <div>
          <h3 className="font-black text-sm uppercase tracking-wide">Live Consultation</h3>
          <p className="text-[10px] text-purple-200">Ref: {appointment.appointmentId}</p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 bg-slate-50 p-4 overflow-y-auto space-y-4">
        {loading && messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-purple-400">
             <span className="animate-pulse text-xs font-bold uppercase tracking-widest">Syncing Records...</span>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMe = String(msg.senderId) === String(currentUser._id);
            const isDocUser = msg.senderType === "Doctor";

            if (msg.content.startsWith("[SYSTEM_CALL_REQUEST]")) {
              return (
                <div key={msg._id || i} className="flex flex-col items-center my-4 w-full">
                  <div className="bg-indigo-50 border border-indigo-200 px-6 py-4 rounded-sm shadow-sm flex flex-col items-center gap-2 max-w-[90%]">
                    <Video className="text-indigo-600 animate-pulse" size={20} />
                    <p className="text-[11px] font-black text-indigo-700 uppercase tracking-widest text-center">
                      {msg.senderName} requested a video consultation
                    </p>
                    {isDoc && (
                      <button 
                        onClick={() => sendSystemMessage("[SYSTEM_CALL_START]")}
                        className="mt-2 bg-indigo-600 text-white px-4 py-1.5 rounded-sm text-[9px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-md"
                      >
                        Start Session Now
                      </button>
                    )}
                  </div>
                </div>
              );
            }

            if (msg.content.startsWith("[SYSTEM_CALL_TIME:")) {
              const time = msg.content.replace("[SYSTEM_CALL_TIME:", "").replace("]", "").trim();
              return (
                <div key={msg._id || i} className="flex flex-col items-center my-4 w-full">
                  <div className="bg-amber-50 border border-amber-200 px-6 py-4 rounded-sm shadow-sm flex flex-col items-center gap-2 max-w-[90%]">
                    <Clock className="text-amber-600" size={20} />
                    <p className="text-[11px] font-black text-amber-700 uppercase tracking-widest text-center">
                      Call scheduled for {time}
                    </p>
                  </div>
                </div>
              );
            }

            if (msg.content.startsWith("[SYSTEM_CALL_START]")) {
              return (
                <div key={msg._id || i} className="flex flex-col items-center my-6 w-full">
                  <div className="bg-linear-to-r from-emerald-600 to-teal-600 p-1 rounded-sm shadow-lg w-full max-w-[80%]">
                    <div className="bg-white/10 backdrop-blur-sm p-4 flex flex-col items-center gap-3 border border-white/20">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-inner">
                        <Video size={20} className="text-emerald-600" />
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Session Active</p>
                        <p className="text-xs text-emerald-50 font-bold">The doctor has started the consultation</p>
                      </div>
                      <button 
                        onClick={() => setShowVideo(true)}
                        className="w-full bg-white text-emerald-700 py-2 rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-md"
                      >
                        Join Call Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={msg._id || i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className="flex items-end gap-2 max-w-[85%]">
                  {!isMe && (
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${isDocUser ? 'bg-indigo-100 text-indigo-600' : 'bg-purple-100 text-purple-600'}`}>
                      {isDocUser ? <Stethoscope size={10} /> : <User size={10} />}
                    </div>
                  )}
                  
                  <div className={`px-4 py-2.5 rounded-sm shadow-sm text-sm ${
                    isMe 
                      ? 'bg-purple-600 text-white rounded-br-sm' 
                      : 'bg-white border border-slate-100 text-slate-800 rounded-bl-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-8 font-medium">
                  {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {msg.senderName}
                </span>
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>

      <div className="p-3 bg-white border-t border-slate-100 flex flex-col gap-2 w-full">
        {isDoc && showTimePicker && (
          <div className="p-3 bg-purple-50 rounded-sm border border-purple-100 flex flex-col gap-3 animate-in slide-in-from-bottom-2">
            <p className="text-[9px] font-black text-purple-600 uppercase tracking-widest font-mono">Propose Time Slot</p>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="e.g. 5:30 PM" 
                className="flex-1 bg-white border border-purple-200 rounded-sm px-3 py-1.5 text-xs focus:ring-1 focus:ring-purple-500 outline-none"
                id="callTimeInput"
              />
              <button 
                onClick={() => {
                  const val = document.getElementById('callTimeInput').value;
                  if(val) {
                    sendSystemMessage(`[SYSTEM_CALL_TIME: ${val}]`);
                    setShowTimePicker(false);
                  }
                }}
                className="bg-purple-600 text-white px-3 py-1.5 rounded-sm text-[9px] font-bold uppercase"
              >
                Send
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-2 w-full">
          {isDoc && (
            <div className="flex gap-1">
              <button 
                onClick={() => setShowTimePicker(!showTimePicker)}
                className={`p-2 rounded-full transition-colors ${showTimePicker ? 'bg-purple-100 text-purple-600' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                title="Propose Time"
              >
                <Clock size={18} />
              </button>
              <button 
                onClick={() => sendSystemMessage("[SYSTEM_CALL_START]")}
                className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-full transition-colors"
                title="Start Video Session"
              >
                <Video size={18} />
              </button>
            </div>
          )}
          
          {!isDoc && (
            <button 
              onClick={() => sendSystemMessage("[SYSTEM_CALL_REQUEST]")}
              className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-full transition-colors"
              title="Request Video Call"
            >
              <Video size={18} />
            </button>
          )}

          <input 
            className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="Type your message..."
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            className="w-10 h-10 bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center rounded-full shadow-md transition-colors shrink-0"
          >
            <Send size={16} className="-ml-0.5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showVideo && (
          <VideoRoom 
            appointment={appointment} 
            currentUser={currentUser} 
            onClose={() => setShowVideo(false)} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ChatWindow;
