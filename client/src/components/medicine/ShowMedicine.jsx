import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllMedicineThunk, addMedicineThunk } from "../../redux/slices/medicine.slice";
import { Search, Edit3, Trash2, AlertCircle, ChevronLeft, ChevronRight, Plus, X, Pill, Box, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

const ShowMedicine = () => {
    const dispatch = useDispatch();
    const { medicines, loading, error } = useSelector((state) => state.medicine);

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [adding, setAdding] = useState(false);
    const [formData, setFormData] = useState({ medicineName: "", avaliableStock: "" });

    useEffect(() => {
        dispatch(getAllMedicineThunk());
    }, [dispatch]);

    const filteredMedicines = useMemo(() => {
        return (medicines || []).filter((med) =>
            med.medicineName.toLowerCase().includes(search.toLowerCase())
        );
    }, [medicines, search]);

    const totalPages = Math.ceil(filteredMedicines.length / itemsPerPage);
    const currentData = filteredMedicines.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddNew = async (e) => {
        e.preventDefault();
        setAdding(true);
        const result = await dispatch(addMedicineThunk(formData));
        setAdding(false);

        if (addMedicineThunk.fulfilled.match(result)) {
            setIsModalOpen(false);
            setFormData({ medicineName: "", avaliableStock: "" });
            dispatch(getAllMedicineThunk());
            toast.success("medicine added successfully")
        }
    };

    return (
        <section className="p-4 md:p-8 bg-linear-to-br from-indigo-50 via-white to-purple-50 min-h-screen relative">
            <div className="max-w-7xl mx-auto bg-white/90 backdrop-blur-md border border-indigo-100 p-6 rounded-sm shadow-2xl">

                {/* --- HEADER SECTION --- */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
                    <div className="w-full md:w-auto">
                        <h1 className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Medicine Inventory
                        </h1>
                        <p className="text-gray-500 text-sm">Manage and track your pharmacy stock levels.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3 items-center">
                        <div className="relative w-full sm:w-64">
                            <input
                                type="text"
                                placeholder="Search medicines..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                                className="w-full pl-10 pr-4 py-2 bg-white border border-indigo-200 rounded-sm outline-none focus:ring-2 focus:ring-purple-400 transition-all shadow-sm"
                            />
                            <Search className="absolute left-3 top-2.5 text-indigo-400 w-5 h-5" />
                        </div>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2 rounded-sm shadow-lg shadow-indigo-200 transition-all duration-300 active:scale-95 font-medium"
                        >
                            <Plus size={18} /> Add New
                        </button>
                    </div>
                </div>

                {/* --- STATUS MESSAGES --- */}
                {loading && !isModalOpen && (
                    <div className="flex justify-center py-10">
                        <Loader2 className="animate-spin text-indigo-600" size={40} />
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-sm mb-6 flex items-center gap-2 border border-red-100">
                        <AlertCircle size={20} /> {error}
                    </div>
                )}

                {/* --- TABLE --- */}
                <div className="overflow-hidden rounded-sm border border-indigo-50 shadow-sm overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-200">
                        <thead>
                            <tr className="bg-linear-to-r from-indigo-600 to-purple-600 text-white">
                                <th className="p-4 font-semibold text-sm">#</th>
                                <th className="p-4 font-semibold text-sm">Medicine Name</th>
                                <th className="p-4 font-semibold text-sm">Stock Level</th>
                                <th className="p-4 font-semibold text-sm text-center">Status</th>
                                <th className="p-4 font-semibold text-sm text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-indigo-50">
                            {currentData.length > 0 ? (
                                currentData.map((med, index) => (
                                    <tr key={med._id} className="hover:bg-indigo-50/50 transition-colors group">
                                        <td className="p-4 text-gray-500 font-medium">
                                            {String((currentPage - 1) * itemsPerPage + index + 1).padStart(2, '0')}
                                        </td>
                                        <td className="p-4 font-bold text-gray-700 group-hover:text-indigo-700 transition-colors">
                                            {med.medicineName}
                                        </td>
                                        <td className="p-4 text-gray-600 font-mono">
                                            {med.avaliableStock} units
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-wider ${med.avaliableStock > 10
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : med.avaliableStock > 0
                                                        ? "bg-amber-100 text-amber-700"
                                                        : "bg-rose-100 text-rose-700"
                                                }`}>
                                                {med.avaliableStock > 10 ? "In Stock" : med.avaliableStock > 0 ? "Low Stock" : "Out of Stock"}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-center gap-2">
                                                <button className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-sm border border-indigo-100 bg-white transition-colors">
                                                    <Edit3 size={16} />
                                                </button>
                                                <button className="p-2 text-rose-600 hover:bg-rose-100 rounded-sm border border-rose-100 bg-white transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                                <button className="px-3 py-1 text-xs font-bold text-purple-600 border border-purple-200 bg-purple-50 hover:bg-purple-600 hover:text-white rounded-sm transition-all uppercase">
                                                    Mark Out
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-10 text-center text-gray-400 italic">
                                        No medicines found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* --- PAGINATION SECTION --- */}
                {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
                        <span className="text-sm text-gray-500 font-medium">
                            Page <span className="text-indigo-600">{currentPage}</span> of {totalPages}
                        </span>

                        <div className="flex items-center gap-1">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((p) => p - 1)}
                                className="p-2 rounded-sm bg-white border border-indigo-100 text-indigo-600 disabled:opacity-30 hover:bg-indigo-50 transition-all shadow-sm"
                            >
                                <ChevronLeft size={20} />
                            </button>

                            <div className="flex gap-1 mx-2">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-10 h-10 rounded-sm font-bold transition-all ${currentPage === i + 1
                                                ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-200"
                                                : "bg-white text-gray-600 hover:bg-indigo-50 border border-indigo-50"
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((p) => p + 1)}
                                className="p-2 rounded-sm bg-white border border-indigo-100 text-indigo-600 disabled:opacity-30 hover:bg-indigo-50 transition-all shadow-sm"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* --- ADD MEDICINE POPUP (MODAL) --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-indigo-900/40 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsModalOpen(false)}
                    ></div>

                    <div className="relative bg-white w-full max-w-md rounded-sm shadow-2xl p-8 animate-in fade-in zoom-in duration-300">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-100 text-indigo-600 rounded-sm mb-3">
                                <Pill size={28} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Add New Medicine</h2>
                            <p className="text-gray-500 text-sm">Fill in the details to update inventory</p>
                        </div>

                        <form onSubmit={handleAddNew} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase ml-1 mb-1">Medicine Name</label>
                                <div className="relative">
                                    <input
                                        required
                                        name="medicineName"
                                        value={formData.medicineName}
                                        onChange={handleInputChange}
                                        type="text"
                                        placeholder="Enter name..."
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-sm outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition-all"
                                    />
                                    <Pill className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase ml-1 mb-1">Initial Stock</label>
                                <div className="relative">
                                    <input
                                        required
                                        name="avaliableStock"
                                        value={formData.avaliableStock}
                                        onChange={handleInputChange}
                                        type="number"
                                        placeholder="Quantity..."
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-sm outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition-all"
                                    />
                                    <Box className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={adding}
                                className="w-full mt-4 bg-linear-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-sm font-bold shadow-lg hover:shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {adding ? <Loader2 className="animate-spin" size={20} /> : "Save to Inventory"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
};

export default ShowMedicine;