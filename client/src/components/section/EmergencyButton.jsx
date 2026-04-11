import React, { useState } from 'react';
import { AlertCircle, MapPin, Phone, Send, Loader2, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { createEmergencyRequestThunk } from '../../redux/slices/emergency.slice';
import { motion, AnimatePresence } from 'framer-motion';
import EmergencyStatus from './EmergencyStatus';

const EmergencyButton = () => {
  const dispatch = useDispatch();
  const { patient } = useSelector((state) => state.patient);
  const [loading, setLoading] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [emergencyData, setEmergencyData] = useState(null);
  
  const [phone, setPhone] = useState(patient?.phone || '');
  const [address, setAddress] = useState('');

  React.useEffect(() => {
    if (patient?.phone) {
      setPhone(patient.phone);
    }
  }, [patient]);

  const triggerEmergency = () => {
    setLoading(true);
    
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported. Please enter address manually.");
      setShowManualForm(true);
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await dispatch(createEmergencyRequestThunk({
            patientId: patient?._id,
            patientName: patient?.firstName ? `${patient.firstName} ${patient.lastName}` : 'Guest',
            phone: phone || patient?.phone || "000-000-0000",
            location: { lat: latitude, lng: longitude },
            address: "Live GPS Coordinates"
          })).unwrap();
          
          setEmergencyData(res.data);
          toast.success("HELP IS ON THE WAY!");
        } catch (error) {
          toast.error("Network error. Please try calling emergency services.");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error", error);
        toast.error("Location access denied. Please enter details manually.");
        setShowManualForm(true);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!phone || !address) return toast.error("Please provide both phone and address");
    
    setLoading(true);
    try {
      const res = await dispatch(createEmergencyRequestThunk({
        patientId: patient?._id,
        patientName: patient?.firstName ? `${patient.firstName} ${patient.lastName}` : 'Guest',
        phone,
        location: { lat: 0, lng: 0 },
        address: `MANUAL: ${address}`
      })).unwrap();
      
      setEmergencyData(res.data);
      setShowManualForm(false);
      toast.success("EMERGENCY LOGGED!");
    } catch (err) {
      toast.error("Failed to log emergency");
    } finally {
      setLoading(false);
    }
  };

  if (emergencyData) {
    return <EmergencyStatus emergency={emergencyData} onClose={() => setEmergencyData(null)} />;
  }

  return (
    <>
      <div className="fixed bottom-8 left-8  ">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{ boxShadow: ["0 0 0 0px rgba(139, 92, 246, 0.4)", "0 0 0 20px rgba(139, 92, 246, 0)"] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          onClick={triggerEmergency}
          disabled={loading}
          className="bg-linear-to-r from-purple-600 to-indigo-600 text-white px-8 py-5 rounded-sm flex items-center justify-center shadow-2xl border border-white/20 group hover:shadow-purple-500/20"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <div className="flex items-center gap-4">
              <div className="relative">
                <AlertCircle size={22} className="group-hover:rotate-12 transition-transform" />
                <div className="absolute inset-0 bg-white/20 blur-lg animate-pulse"></div>
              </div>
              <span className="text-xs font-black uppercase tracking-[0.3em] font-mono">Emergency</span>
            </div>
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {showManualForm && (
          <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-1000 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-sm shadow-2xl w-full max-w-md overflow-hidden border border-purple-100"
            >
              <div className="bg-purple-600 p-6 flex justify-between items-center text-white">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-widest">Manual SOS</h2>
                  <p className="text-[10px] font-bold text-purple-100 italic uppercase">GPS unavailable, please specify</p>
                </div>
                <button onClick={() => setShowManualForm(false)} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleManualSubmit} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Contact Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="tel" 
                      placeholder="Enter emergency number"
                      className="w-full bg-slate-50 border border-slate-200 rounded-sm py-3 pl-10 pr-4 text-sm font-bold focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Emergency Location/Landmark</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-4 text-slate-400" size={16} />
                    <textarea 
                      placeholder="e.g. Near City Mall, Room 402..."
                      rows={3}
                      className="w-full bg-slate-50 border border-slate-200 rounded-sm py-3 pl-10 pr-4 text-sm font-bold focus:ring-2 focus:ring-purple-500 outline-none transition-all resize-none"
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black py-4 rounded-sm shadow-lg flex items-center justify-center gap-3 transition-all uppercase text-xs tracking-[0.2em]"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                  Dispatch Emergency Help
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EmergencyButton;
