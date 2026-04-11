import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Clock, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { submitContactThunk, resetContactState } from "../../redux/slices/contact.slice";

const Contact = () => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.contact);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      return toast.error("Please fill all required fields");
    }
    dispatch(submitContactThunk(formData));
  };

  useEffect(() => {
    if (success) {
      toast.success("Message sent successfully!");
      setFormData({
        name: "",
        email: "",
        subject: "General Inquiry",
        message: "",
      });
      dispatch(resetContactState());
    }
    if (error) {
      toast.error(error);
      dispatch(resetContactState());
    }
  }, [success, error, dispatch]);

  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Left Side: Info */}
          <div className="space-y-12">
            <div>
              <h1 className="text-5xl font-black text-gray-900 leading-tight">
                Let's Start a <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">
                  Conversation.
                </span>
              </h1>
              <p className="text-gray-500 mt-6 text-lg max-w-md border-l-4 border-indigo-600 pl-4">
                Have questions about our services or need technical help? Our team is here for you.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-8 lg:grid-cols-1">
              <ContactMethod
                icon={<Phone className="text-indigo-600" />}
                title="Call us anytime"
                detail="+1 (555) 000-1234"
              />
              <ContactMethod
                icon={<Mail className="text-purple-600" />}
                title="Email support"
                detail="support@newcare.com"
              />
              <ContactMethod
                icon={<MapPin className="text-indigo-600" />}
                title="Visit our clinic"
                detail="123 Medical Plaza, New York, NY"
              />
              <ContactMethod
                icon={<Clock className="text-purple-600" />}
                title="Working Hours"
                detail="Mon - Sat: 9:00 AM - 8:00 PM"
              />
            </div>
          </div>

          {/* Right Side: Form */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-50 p-8 md:p-10 rounded-sm border-t-4 border-indigo-600 shadow-xl shadow-indigo-100"
          >
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-700 ml-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className="w-full p-3 bg-white rounded-sm outline-none border border-gray-200 focus:border-purple-600 transition-all text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-700 ml-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="@example.com"
                    className="w-full p-3 bg-white rounded-sm outline-none border border-gray-200 focus:border-purple-600 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-700 ml-1">Subject</label>
                <select 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full p-3 bg-white rounded-sm outline-none border border-gray-200 focus:border-purple-600 appearance-none cursor-pointer text-sm"
                >
                  <option>General Inquiry</option>
                  <option>Appointment Issue</option>
                  <option>Feedback</option>
                  <option>Emergency Services</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-700 ml-1">Message</label>
                <textarea
                  rows="4"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  className="w-full p-3 bg-white rounded-sm outline-none border border-gray-200 focus:border-purple-600 transition-all resize-none text-sm"
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-sm font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200 group disabled:opacity-50"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : "Send Message"}
                {!loading && <Send size={14} className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

const ContactMethod = ({ icon, title, detail }) => (
  <div className="flex items-center gap-4 group">
    <div className="w-10 h-10 bg-indigo-50 rounded-sm flex items-center justify-center shrink-0 border border-indigo-100 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
      {React.cloneElement(icon, { size: 18, className: "transition-colors duration-300" })}
    </div>
    <div>
      <h4 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">{title}</h4>
      <p className="text-gray-600 font-medium text-sm">{detail}</p>
    </div>
  </div>
);

export default Contact;