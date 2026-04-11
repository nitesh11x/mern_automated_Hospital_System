import React, { useState, useEffect } from 'react';
import { MapPin, Phone, ExternalLink, Loader2, Hospital } from 'lucide-react';

const NearbyHospitals = ({ location }) => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!location || !location.lat || !location.lng) return;

    const fetchNearbyHospitals = async () => {
      setLoading(true);
      try {
        // Overpass API Query for hospitals within 5000m
        const radius = 5000;
        const query = `[out:json];node["amenity"="hospital"](around:${radius},${location.lat},${location.lng});out;`;
        const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

        const response = await fetch(url);
        const data = await response.json();

        const results = data.elements.map(item => ({
          id: item.id,
          name: item.tags.name || "Unknown Hospital",
          lat: item.lat,
          lon: item.lon,
          distance: calculateDistance(location.lat, location.lng, item.lat, item.lon),
          phone: item.tags['contact:phone'] || item.tags.phone || "No phone listed"
        })).sort((a, b) => a.distance - b.distance).slice(0, 15); // Show more hospitals

        setHospitals(results);
      } catch (err) {
        console.error("Failed to fetch nearby hospitals", err);
        setError("Could not load nearby hospitals radar.");
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyHospitals();
  }, [location]);

  // Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-900/50 rounded-sm border border-slate-800">
      <Loader2 className="animate-spin text-indigo-400 mb-4" size={32} />
      <p className="text-xs font-black uppercase tracking-widest text-slate-400">Scanning Nearby Facilities...</p>
    </div>
  );

  if (error) return <p className="text-rose-500 text-xs font-bold text-center p-4">{error}</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Hospital className="text-indigo-400" size={18} />
          <h3 className="text-sm font-black uppercase tracking-tighter text-white">Emergency Units Radar</h3>
        </div>
        <span className="text-[9px] font-bold text-slate-500 uppercase">Within 5km</span>
      </div>
      
      {hospitals.length === 0 ? (
        <p className="text-slate-500 text-xs italic">No alternative units found.</p>
      ) : (
        <div className="grid gap-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
          {hospitals.map(h => (
            <div key={h.id} className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-sm flex justify-between items-start transition-all hover:bg-slate-800">
              <div>
                <p className="text-xs font-black text-white uppercase mb-1">{h.name}</p>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-[10px] text-indigo-300 font-bold">
                    <MapPin size={10} /> {h.distance} km away
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                    <Phone size={10} /> {h.phone}
                  </span>
                </div>
              </div>
              <a 
                href={`https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lon}`} 
                target="_blank" 
                rel="noreferrer"
                className="p-2 bg-indigo-600 hover:bg-slate-900 text-white rounded-sm transition-all shadow-md group"
              >
                <ExternalLink size={14} className="group-hover:scale-110 transition-transform" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NearbyHospitals;
