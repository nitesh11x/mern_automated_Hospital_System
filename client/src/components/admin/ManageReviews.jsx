import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllReviewsThunk, deleteReviewThunk } from "../../redux/slices/review.slice";
import { Star, Trash2, Calendar, FileText, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";

const ManageReviews = () => {
  const dispatch = useDispatch();
  const { reviews, loading } = useSelector((state) => state.review);

  useEffect(() => {
    dispatch(getAllReviewsThunk());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await dispatch(deleteReviewThunk(id)).unwrap();
        toast.success("Review deleted successfully");
      } catch (error) {
        toast.error(error || "Failed to delete review");
      }
    }
  };

  if (loading) return <div className="p-10 text-center text-purple-600 font-bold uppercase">Loading Feedback Data...</div>;

  return (
    <div className="bg-white rounded-sm border border-purple-100 shadow-xl overflow-hidden animate-in fade-in duration-500">
      <div className="p-6 border-b border-purple-100 bg-linear-to-r from-purple-50/30 to-white flex justify-between items-center">
        <div>
          <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
            <div className="w-1 h-5 bg-linear-to-b from-purple-600 to-indigo-600 rounded-full"></div>
            Patient Feedback Management
          </h3>
          <p className="text-[9px] text-purple-500 mt-1 uppercase tracking-widest">Monitor and moderate clinical reviews</p>
        </div>
        <span className="text-[10px] bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
          {reviews?.length || 0} Total Reviews
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-purple-50/50 text-[10px] uppercase tracking-wider text-purple-600 font-black border-b border-purple-100">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Patient / Subject</th>
              <th className="px-6 py-4">Rating</th>
              <th className="px-6 py-4">Detailed Feedback</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-50">
            {reviews && reviews.length > 0 ? (
              reviews.map((rev) => {
                const patientName = rev.patientId ? `${rev.patientId.firstName} ${rev.patientId.lastName}` : "Anonymous";
                const doctorName = rev.doctorId ? `${rev.doctorId.firstName} ${rev.doctorId.lastName}` : "Unknown Specialist";
                
                return (
                  <tr key={rev._id} className="hover:bg-purple-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-bold text-purple-500">#{rev._id?.slice(-6).toUpperCase()}</span>
                      <div className="text-[8px] text-slate-400 mt-1 uppercase">{new Date(rev.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-800">{patientName}</p>
                      <p className="text-[9px] font-bold text-purple-500 uppercase">Re: Dr. {doctorName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            className={star <= rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-200 fill-slate-200"}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-slate-600 line-clamp-2 max-w-xs break-words font-medium">
                        "{rev.message}"
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDelete(rev._id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-sm transition-all"
                        title="Delete Review"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="py-20 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                      <AlertCircle size={24} className="text-purple-400" />
                    </div>
                    <p className="text-[10px] font-black text-purple-300 uppercase tracking-widest">No reviews submitted yet</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageReviews;
