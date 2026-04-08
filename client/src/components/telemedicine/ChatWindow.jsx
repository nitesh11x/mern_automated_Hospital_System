import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { 
  fetchChatHistoryThunk, 
  sendChatMessageThunk, 
  addMessageToStore, 
  clearChatStore 
} from "../../redux/slices/chat.slice";
import { Send, X, User, Stethoscope } from "lucide-react";
import { motion } from "framer-motion";

const SOCKET_SERVER_URL = "http://localhost:1111"; // Should use env var in prod

const ChatWindow = ({ appointment, currentUser, onClose }) => {
  const dispatch = useDispatch();
  const { messages, loading } = useSelector(state => state.chat);
  
  const [text, setText] = useState("");
  const socketRef = useRef(null);
  const endRef = useRef(null);

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
            const isDoc = msg.senderType === "Doctor";

            return (
              <div key={msg._id || i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className="flex items-end gap-2 max-w-[85%]">
                  {!isMe && (
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${isDoc ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                      {isDoc ? <Stethoscope size={10} /> : <User size={10} />}
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

      <div className="p-3 bg-white border-t border-slate-100 flex gap-2 w-full">
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
    </motion.div>
  );
};

export default ChatWindow;
