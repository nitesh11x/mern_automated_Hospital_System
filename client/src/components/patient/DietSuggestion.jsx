import React, { useEffect } from "react";
import { CheckCircle, XCircle, Utensils, Droplet, Coffee, Apple, Heart, RefreshCw, Bot } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getDietSuggestionThunk } from "../../redux/slices/ai.slice";

const DietSuggestion = ({ prescriptions = [] }) => {
  const dispatch = useDispatch();
  const { dietLoading, dietError, dietData } = useSelector((state) => state.ai || {});

  useEffect(() => {
    // Dispatch whenever prescriptions change or on mount
    dispatch(getDietSuggestionThunk(prescriptions));
  }, [dispatch, prescriptions]);

  const foodsToEat = dietData?.foodsToEat || [];
  const foodsToAvoid = dietData?.foodsToAvoid || [];
  const conditions = dietData?.conditions || [];

  return (
    <section className="bg-white rounded-sm border border-purple-100 shadow-xl overflow-hidden animate-in fade-in duration-500 min-h-[400px] flex flex-col">
      <div className="p-6 border-b border-purple-100 bg-linear-to-r from-purple-50/30 to-white flex justify-between items-center relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-purple-100/50 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <div className="w-1 h-5 bg-linear-to-b from-purple-600 to-indigo-600 rounded-full"></div>
            Smart Nutrition AI
          </h3>
          <p className="text-[10px] text-purple-500 mt-1 uppercase tracking-widest font-bold flex items-center gap-2">
            <Bot size={12} /> Exclusively AI-tailored for your health profile
          </p>
        </div>
        <div className="bg-purple-100 p-2 rounded-sm text-purple-600 relative z-10 shadow-sm border border-purple-200">
          <Utensils size={20} />
        </div>
      </div>

      {dietLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20">
          <RefreshCw size={32} className="animate-spin text-purple-600 mb-4" />
          <p className="text-sm font-black uppercase tracking-widest text-slate-600">AI Nutritionist is Analyzing...</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">Correlating your prescription history with diet plans</p>
        </div>
      ) : dietError ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center px-6">
          <XCircle size={40} className="text-rose-400 mb-4" />
          <p className="text-sm font-black text-rose-700 uppercase">{dietError}</p>
          <button 
            onClick={() => dispatch(getDietSuggestionThunk(prescriptions))}
            className="mt-4 px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-sm text-[10px] font-bold uppercase transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : dietData ? (
        <>
          <div className="px-6 pt-6 -mb-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-sm">
              <span className="flex w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[9px] font-black uppercase tracking-wider text-emerald-700">
                Conditions Analyzed: {conditions.join(", ")}
              </span>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8 p-6 lg:p-8">
            
            {/* WHAT TO EAT */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-emerald-100 pb-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex justify-center items-center shadow-inner">
                  <CheckCircle size={20} className="text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Targeted Diet</h4>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase">Optimal foods to consume</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {foodsToEat.length > 0 ? foodsToEat.map((food, idx) => (
                  <div key={idx} className="bg-emerald-50/30 border border-emerald-100 p-4 rounded-sm hover:shadow-md transition-all hover:bg-emerald-50/60 group">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-white p-2 border border-emerald-100 rounded-sm shadow-sm group-hover:scale-110 transition-transform">
                        <Apple size={18} className="text-emerald-500" />
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-800 text-sm">{food.category}</h5>
                        <p className="text-[10px] font-bold text-emerald-600 uppercase mt-0.5">{food.items}</p>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed mt-3 p-2.5 bg-white rounded-sm border border-emerald-50/50 shadow-sm relative">
                      <span className="absolute -left-1 top-3 w-2 h-4 bg-emerald-400 rounded-r-full"></span>
                      {food.benefits}
                    </p>
                  </div>
                )) : (
                  <p className="text-[11px] text-slate-500 font-medium">No specific recommendations found.</p>
                )}
              </div>
            </div>

            {/* WHAT NOT TO EAT */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-rose-100 pb-3">
                <div className="w-10 h-10 rounded-full bg-rose-100 flex justify-center items-center shadow-inner">
                  <XCircle size={20} className="text-rose-600" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Foods to Avoid</h4>
                  <p className="text-[10px] text-rose-600 font-bold uppercase">Harmful for your conditions</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {foodsToAvoid.length > 0 ? foodsToAvoid.map((food, idx) => (
                  <div key={idx} className="bg-rose-50/30 border border-rose-100 p-4 rounded-sm hover:shadow-md transition-all hover:bg-rose-50/60 group">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-white p-2 border border-rose-100 rounded-sm shadow-sm group-hover:scale-110 transition-transform">
                        <Coffee size={18} className="text-rose-500" />
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-800 text-sm">{food.category}</h5>
                        <p className="text-[10px] font-bold text-rose-600 uppercase mt-0.5">{food.items}</p>
                      </div>
                    </div>
                    <div className="bg-white p-2.5 rounded-sm border border-rose-50 mt-3 text-rose-700/80 flex items-start gap-2 shadow-sm">
                      <XCircle size={14} className="mt-0.5 shrink-0 text-rose-400" />
                      <p className="text-[11px] leading-relaxed">
                        {food.reason}
                      </p>
                    </div>
                  </div>
                )) : (
                  <p className="text-[11px] text-slate-500 font-medium">No specific restrictions found.</p>
                )}
              </div>
            </div>

          </div>
          
          <div className="bg-slate-50 p-4 border-t border-purple-100 flex justify-between items-center text-[10px] text-slate-500 uppercase tracking-widest font-bold">
            <span>* AI-Generated Guidelines</span>
            <span>Please consult with your primary doctor.</span>
          </div>
        </>
      ) : null}
    </section>
  );
};

export default DietSuggestion;
