import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllContactMessagesThunk,
  deleteContactMessageThunk,
  updateContactStatusThunk,
  replyToInquiryThunk,
} from "../../redux/slices/contact.slice";
import {
  Mail,
  Trash2,
  CheckCircle,
  Clock,
  Search,
  User,
  MessageSquare,
  AlertCircle,
  RefreshCcw,
  ChevronRight,
  X,
  Send,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

const ManageMessages = () => {
  const dispatch = useDispatch();
  const { messages, loading } = useSelector((state) => state.contact);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");

  // Reply State
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  useEffect(() => {
    dispatch(fetchAllContactMessagesThunk());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await dispatch(deleteContactMessageThunk(id)).unwrap();
        toast.success("Message deleted");
      } catch (err) {
        toast.error(err);
      }
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await dispatch(updateContactStatusThunk({ id, status })).unwrap();
      toast.success(`Message marked as ${status}`);
    } catch (err) {
      toast.error(err);
    }
  };

  const handleOpenReplyModal = (msg) => {
    setSelectedMessage(msg);
    setReplyContent("");
    setIsReplyModalOpen(true);
  };

  const handleSendReply = async () => {
    if (!replyContent.trim()) {
      return toast.error("Please enter a reply message");
    }

    setIsSubmittingReply(true);
    try {
      await dispatch(
        replyToInquiryThunk({
          id: selectedMessage._id,
          replyMessage: replyContent,
        })
      ).unwrap();
      
      toast.success("Reply sent successfully!");
      setIsReplyModalOpen(false);
      setSelectedMessage(null);
      setReplyContent("");
    } catch (err) {
      toast.error(err || "Failed to send reply");
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const filteredMessages = messages.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === "All" || m.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 space-y-8 bg-linear-to-br from-purple-50 via-white to-indigo-50 min-h-screen font-sans">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             Visitor <span className="text-indigo-600">Messages</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-2 flex items-center gap-2">
            <RefreshCcw size={12} className="text-indigo-400" /> Auto-Sync Enabled / 2026 Node
          </p>
        </div>

        <div className="flex items-center gap-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                    type="text" 
                    placeholder="Search by name, email or subject..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-sm w-72 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-medium"
                />
            </div>
            <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-sm px-4 py-3 text-sm font-bold text-slate-700 outline-none cursor-pointer focus:border-indigo-600"
            >
                <option value="All">All Inquiries</option>
                <option value="Pending">Pending</option>
                <option value="Resolved">Resolved</option>
            </select>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((msg) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={msg._id}
                className={`bg-white rounded-sm border-l-4 ${
                  msg.status === "Resolved" ? "border-emerald-500" : "border-indigo-600"
                } shadow-xl shadow-indigo-500/5 p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden group`}
              >
                {/* Status Badge */}
                <div className="absolute top-0 right-0 p-4">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    msg.status === "Resolved" 
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                      : "bg-indigo-50 text-indigo-600 border-indigo-100"
                  }`}>
                    {msg.status}
                  </span>
                </div>

                {/* Sender Info */}
                <div className="w-full md:w-64 space-y-4 shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-linear-to-br from-indigo-600 to-purple-600 rounded-sm flex items-center justify-center text-white font-black text-xl shadow-lg">
                      {msg.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900 leading-none">{msg.name}</h3>
                      <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-tighter">{msg.email}</p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2 text-slate-500 text-[11px] font-bold">
                        <Clock size={12} className="text-indigo-400" />
                        {new Date(msg.createdAt).toLocaleDateString()} @ {new Date(msg.createdAt).toLocaleTimeString()}
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-[11px] font-bold">
                        <MessageSquare size={12} className="text-indigo-400" />
                        SUB: {msg.subject}
                    </div>
                  </div>
                </div>

                {/* Message Content */}
                <div className="flex-1 space-y-4 w-full">
                   <div className="bg-slate-50 border border-slate-100 p-6 rounded-sm relative italic text-slate-700 text-sm leading-relaxed border-l-4 border-slate-200">
                        <span className="absolute -top-3 -left-1 text-4xl text-slate-200 font-serif">"</span>
                        {msg.message}
                   </div>

                   <div className="flex items-center justify-end gap-3 pt-4">
                      {msg.status === "Pending" ? (
                        <button 
                            onClick={() => handleStatusChange(msg._id, "Resolved")}
                            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-50 text-emerald-600 rounded-sm text-xs font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                        >
                            <CheckCircle size={14} /> Mark Resolved
                        </button>
                      ) : (
                        <button 
                            onClick={() => handleStatusChange(msg._id, "Pending")}
                            className="flex items-center gap-2 px-6 py-2.5 bg-slate-100 text-slate-600 rounded-sm text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                        >
                            <RefreshCcw size={14} /> Reopen
                        </button>
                      )}
                      <button 
                         onClick={() => handleDelete(msg._id)}
                         className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-sm transition-all shadow-sm border border-rose-100"
                      >
                         <Trash2 size={16} />
                      </button>
                      <button 
                         onClick={() => handleOpenReplyModal(msg)}
                         className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-sm text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg group"
                      >
                         Reply <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                   </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="bg-white border border-slate-200 border-dashed rounded-sm p-20 text-center space-y-4">
               <Mail size={64} className="mx-auto text-slate-200" />
               <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">Inbox Zero</h3>
               <p className="text-slate-400 text-sm font-bold">No visitor messages found matching your search.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Reply Modal */}
      <AnimatePresence>
        {isReplyModalOpen && (
          <div className="fixed inset-0 z-5000 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="bg-white rounded-sm shadow-2xl w-full max-w-xl overflow-hidden border border-indigo-100"
             >
                <div className="bg-linear-to-r from-indigo-600 to-purple-600 p-6 flex justify-between items-center text-white">
                    <div className="flex items-center gap-3">
                        <Mail size={20} />
                        <h2 className="text-lg font-black uppercase tracking-widest">Send Reply</h2>
                    </div>
                    <button onClick={() => setIsReplyModalOpen(false)} className="hover:rotate-90 transition-transform">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="bg-slate-50 p-4 rounded-sm border border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">To: {selectedMessage?.name}</p>
                            <p className="text-xs font-bold text-slate-600 truncate">{selectedMessage?.email}</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Your Response</label>
                            <textarea 
                                rows="6"
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Type your response here..."
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-sm text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all resize-none"
                            ></textarea>
                            <p className="text-[9px] font-bold text-slate-400 text-right">This message will be sent as an official NewCare response email.</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button 
                            onClick={() => setIsReplyModalOpen(false)}
                            className="flex-1 py-4 border border-slate-200 text-slate-600 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            disabled={isSubmittingReply}
                            onClick={handleSendReply}
                            className="flex-[2] py-4 bg-slate-900 text-white rounded-sm text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
                        >
                            {isSubmittingReply ? (
                                <>
                                    <RefreshCcw size={16} className="animate-spin" />
                                    Dispatching...
                                </>
                            ) : (
                                <>
                                    <Send size={16} />
                                    Send Reply Email
                                </>
                            )}
                        </button>
                    </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {loading && !isSubmittingReply && (
          <div className="fixed bottom-8 right-8 bg-white border border-indigo-100 shadow-2xl rounded-full px-6 py-3 flex items-center gap-3 animate-bounce">
              <RefreshCcw size={16} className="text-indigo-600 animate-spin" />
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Syncing Messages...</span>
          </div>
      )}
    </div>
  );
};

export default ManageMessages;
