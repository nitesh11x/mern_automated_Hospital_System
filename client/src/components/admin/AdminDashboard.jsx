import React, { useMemo, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getDashboardStatsThunk } from "../../redux/slices/admin.slice";
import { useNavigate, Link } from "react-router-dom";
import DoctorManage from "../doctor/DoctorManage";
import PatientManage from "../patient/PatientManage";
import ShowAppointments from "../appointment/ShowAppointments";
import { io } from "socket.io-client";
import {
  AlertTriangle,
  MapPin,
  PhoneCall,
  X,
  Siren,
  UserPlus,
  Stethoscope,
  Lock,
  Users,
  Calendar,
  Star,
  Activity,
  LogOut,
  LayoutDashboard,
  UserCog,
  RefreshCcw,
  FileEdit,
  UserCheck,
  ClipboardList,
  TrendingUp,
  Award,
  PlusCircle,
  ArrowRight,
} from "lucide-react";
import ManageReviews from "./ManageReviews";
import ManageEmergency from "./ManageEmergency";
import { updateEmergencyStatusThunk } from "../../redux/slices/emergency.slice";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { toast } from "react-hot-toast";
import ShowMedicine from "../medicine/ShowMedicine";

const COLORS = {
  primary: "#8B5CF6",
  primaryDark: "#7C3AED",
  primaryLight: "#A78BFA",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  purple: "#A855F7",
  indigo: "#6366F1",
};

const PIE_COLORS = [
  COLORS.success,
  COLORS.warning,
  COLORS.primary,
  COLORS.danger,
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [emergencyAlert, setEmergencyAlert] = useState(null);
  const [socket, setSocket] = useState(null);

  const { isAdminAuthenticated, admin, stats } = useSelector(
    (state) => state.admin,
  );
  const { patients } = useSelector((state) => state.patient);
  const { doctors } = useSelector((state) => state.doctor);
  const { appointments } = useSelector((state) => state.appointment);

  useEffect(() => {
    if (!isAdminAuthenticated) return;

    dispatch(getDashboardStatsThunk());

    const SOCKET_SERVER_URL = import.meta.env.VITE_APP_SOCKET_URL || "http://localhost:1111";
    const newSocket = io(SOCKET_SERVER_URL, { withCredentials: true });
    setSocket(newSocket);
    newSocket.emit("join_admin_room");

    newSocket.on("emergency_alert", (data) => {
      setEmergencyAlert(data?.emergency || null);
      if (data?.emergency?.patientName) {
        toast.error(`🚨 EMERGENCY: ${data.emergency.patientName} needs help!`, {
          duration: 10000,
        });
      } else {
        toast.error("🚨 Emergency alert received!", { duration: 10000 });
      }
    });

    return () => {
      newSocket.off("emergency_alert");
      newSocket.disconnect();
    };
  }, [dispatch, isAdminAuthenticated]);

  const chartData = useMemo(
    () => [
      {
        name: "Approved",
        value: appointments?.filter((r) => r.status === "Approved").length || 0,
      },
      {
        name: "Pending",
        value: appointments?.filter((r) => r.status === "Pending").length || 0,
      },
      {
        name: "Completed",
        value: appointments?.filter((r) => r.status === "Completed").length || 0,
      },
      {
        name: "Cancelled",
        value: appointments?.filter((r) => r.status === "Cancelled").length || 0,
      },
    ],
    [appointments],
  );

  if (!isAdminAuthenticated) return null;

  const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-sm p-6 border border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300 group">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-purple-600">
            {title}
          </p>
          <p className="text-3xl font-black text-gray-800 mt-2">{value}</p>
        </div>

        <div
          className={`h-12 w-12 rounded-sm bg-linear-to-br ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
        >
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-linear-to-br from-purple-50 via-white to-indigo-50 font-sans">
      <aside className="w-72 bg-linear-to-b pt-18 from-purple-900 via-purple-800 to-indigo-900 text-purple-200 hidden lg:flex flex-col p-6 sticky top-0 h-screen shadow-2xl">
        <div className="px-2 pt-4" />

        <nav className="flex-1 space-y-2">
          <SidebarBtn
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
          />
          <SidebarBtn
            icon={<Stethoscope size={20} />}
            label="Medical"
            active={activeTab === "doctors"}
            onClick={() => setActiveTab("doctors")}
          />
          <SidebarBtn
            icon={<Users size={20} />}
            label="Patient"
            active={activeTab === "patients"}
            onClick={() => setActiveTab("patients")}
          />
          <SidebarBtn
            icon={<Calendar size={20} />}
            label="Appointments"
            active={activeTab === "appointments"}
            onClick={() => setActiveTab("appointments")}
          />
          <SidebarBtn
            icon={<Star size={20} />}
            label="Reviews"
            active={activeTab === "reviews"}
            onClick={() => setActiveTab("reviews")}
          />
          <SidebarBtn
            icon={<Calendar size={20} />}
            label="Medicines"
            active={activeTab === "medicines"}
            onClick={() => setActiveTab("medicines")}
          />
          <SidebarBtn
            icon={<Calendar size={20} />}
            label="Faculty"
            active={activeTab === "faculty"}
            onClick={() => setActiveTab("faculty")}
          />
          <SidebarBtn
            icon={<Siren size={20} />}
            label="Emergency"
            active={activeTab === "emergency"}
            onClick={() => setActiveTab("emergency")}
          />
          <SidebarBtn
            icon={<Calendar size={20} />}
            label="Settings"
            active={activeTab === "setting"}
            onClick={() => setActiveTab("setting")}
          />
        </nav>

        <div className="pt-6 mt-6 border-t border-purple-700/50">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 p-3 hover:bg-purple-800/50 rounded-sm transition-all text-xs font-bold uppercase tracking-widest w-full group"
          >
            <LogOut size={18} className="group-hover:text-purple-300" />
            <span className="group-hover:text-white">Exit System</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end pt-6 mb-8 flex-wrap gap-4" />

          {activeTab === "dashboard" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
                <StatCard
                  title="Total Patients"
                  value={patients?.length || 0}
                  icon={<Users size={24} className="text-white" />}
                  color="from-emerald-500 to-emerald-600"
                />
                <StatCard
                  title="Total Doctors"
                  value={doctors?.length || stats?.totalDoctors || 0}
                  icon={<Stethoscope size={24} className="text-white" />}
                  color="from-purple-500 to-indigo-500"
                />
                <StatCard
                  title="Total Appointments"
                  value={appointments?.length || stats?.totalAppointments || 0}
                  icon={<Calendar size={24} className="text-white" />}
                  color="from-blue-500 to-indigo-500"
                />
                <StatCard
                  title="Total Revenue"
                  value={`₹${(stats?.totalRevenue || 0).toLocaleString()}`}
                  icon={<TrendingUp size={24} className="text-white" />}
                  color="from-amber-500 to-orange-500"
                />
              </div>

              <div className="flex flex-wrap gap-3 mb-8">
                <SmallBtn
                  icon={<UserPlus size={16} />}
                  label="Add Patient"
                  to="/register-x"
                />
                <SmallBtn
                  icon={<Stethoscope size={16} />}
                  label="Add Doctor"
                  to="/doctor/register"
                />
                <SmallBtn
                  icon={<Users size={16} />}
                  label="Patients"
                  onClick={() => setActiveTab("patients")}
                />
                <SmallBtn
                  icon={<Calendar size={16} />}
                  label="Create New Appointment"
                  to="/appointment/create"
                />
                <SmallBtn
                  icon={<Calendar size={16} />}
                  label="Appointments"
                  onClick={() => setActiveTab("appointments")}
                />
                <SmallBtn
                  icon={<Siren size={16} />}
                  label="Emergency"
                  onClick={() => setActiveTab("emergency")}
                />
                <SmallBtn
                  icon={<RefreshCcw size={16} />}
                  label="Update Status"
                  to="/admin/status"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-sm border border-purple-100 p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                    <h3 className="text-xs font-black uppercase tracking-wider text-purple-600 flex items-center gap-2">
                      <Activity size={14} />
                      Appointments Overview
                    </h3>
                    <div className="flex gap-6">
                      <div className="text-center">
                        <p className="text-xl font-black text-purple-700">
                          {patients?.length || stats?.totalPatients || 0}
                        </p>
                        <p className="text-[9px] font-bold text-purple-400 uppercase">
                          Patients
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-black text-purple-700">
                          {doctors?.length || stats?.totalDoctors || 0}
                        </p>
                        <p className="text-[9px] font-bold text-purple-400 uppercase">
                          Doctors
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-black text-purple-700">
                          {appointments?.length || stats?.totalAppointments || 0}
                        </p>
                        <p className="text-[9px] font-bold text-purple-400 uppercase">
                          Appointments
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          innerRadius={70}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                          stroke="white"
                          strokeWidth={2}
                        >
                          {chartData.map((entry, index) => (
                            <Cell
                              key={index}
                              fill={PIE_COLORS[index % PIE_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            fontSize: "11px",
                            fontWeight: "bold",
                            borderRadius: "12px",
                            border: "none",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            background: "white",
                          }}
                        />
                        <Legend
                          verticalAlign="bottom"
                          wrapperStyle={{
                            fontSize: "10px",
                            textTransform: "uppercase",
                            fontWeight: "bold",
                            paddingTop: "20px",
                          }}
                          iconType="circle"
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white rounded-sm border border-purple-100 p-6 shadow-xl">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xs font-black uppercase tracking-wider text-purple-700 flex items-center gap-2">
                      <Award size={14} />
                      Elite Medical Faculty
                    </h3>
                    <button
                      onClick={() => setActiveTab("doctors")}
                      className="text-[9px] font-black text-purple-600 hover:text-purple-800 uppercase flex items-center gap-1 transition-colors"
                    >
                      View All <ArrowRight size={10} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(doctors || []).slice(0, 5).map((doc, i) => (
                      <div
                        key={doc?._id || i}
                        className="flex items-center justify-between p-3 bg-linear-to-r from-purple-50 to-indigo-50 rounded-sm hover:shadow-md transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-sm bg-linear-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                            {doc?.firstName?.charAt(0) || "D"}
                          </div>
                          <div>
                            <p className="text-sm font-black text-gray-800 group-hover:text-purple-700 transition-colors">
                              Dr. {doc?.firstName || "Physician"}{" "}
                              {doc?.lastName || ""}
                            </p>
                            <p className="text-[10px] font-semibold text-purple-500 uppercase">
                              {doc?.department || "General Medicine"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-sm bg-emerald-500 animate-pulse" />
                          <span className="text-[8px] font-bold text-emerald-600">
                            Active
                          </span>
                        </div>
                      </div>
                    ))}

                    {(!doctors || doctors.length === 0) && (
                      <div className="text-center py-8 text-gray-400">
                        <Stethoscope size={32} className="mx-auto mb-2 opacity-50" />
                        <p className="text-xs">No doctors registered</p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => navigate("/user/doctor/register")}
                    className="w-full mt-6 py-3 border-2 border-dashed border-purple-200 text-purple-500 hover:border-purple-400 hover:text-purple-700 text-[10px] font-black uppercase tracking-wider transition-all rounded-sm flex items-center justify-center gap-2"
                  >
                    <PlusCircle size={14} /> Induct New Medical Staff
                  </button>
                </div>
              </div>
            </>
          )}


          {activeTab === "doctors" && (
            <div className="-mx-6 -mt-10">
              <DoctorManage isEmbedded />
            </div>
          )}

          {activeTab === "patients" && (
            <div className="-mx-6 -mt-10">
              <PatientManage isEmbedded />
            </div>
          )}

          {activeTab === "appointments" && (
            <div className="-mx-6 -mt-10">
              <ShowAppointments isEmbedded />
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="-mx-6 -mt-10 p-6">
              <ManageReviews />
            </div>
          )}

          {activeTab === "medicines" && (
            <div className="-mx-6 -mt-10">
              <ShowMedicine isEmbedded />
            </div>
          )}

          {activeTab === "faculty" && (
            <div className="-mx-6 -mt-10 p-6">
              <div className="bg-white rounded-sm border border-purple-100 p-6 shadow-lg">
                <h3 className="text-sm font-black uppercase tracking-wider text-gray-800">
                  Faculty
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  Use the Medical tab to manage doctors and faculty records.
                </p>
              </div>
            </div>
          )}

          {activeTab === "emergency" && (
            <div className="-mx-6 -mt-10">
              <ManageEmergency socket={socket} />
            </div>
          )}

          {activeTab === "setting" && (
            <div className="-mx-6 -mt-10 p-6">
              <div className="bg-white rounded-sm border border-purple-100 p-6 shadow-lg">
                <h3 className="text-sm font-black uppercase tracking-wider text-gray-800">
                  Settings
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  Dashboard settings area can be connected here.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {emergencyAlert && (
        <div className="fixed inset-0 bg-indigo-950/90 backdrop-blur-xl z-5000 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm shadow-2xl w-full max-w-2xl overflow-hidden border-4 border-purple-500 animate-in zoom-in-95 duration-200">
            <div className="bg-purple-600 p-8 flex justify-between items-center text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
              <div className="relative z-10 flex items-center gap-6">
                <div className="w-16 h-16 bg-white rounded-sm flex items-center justify-center text-purple-600 shadow-xl animate-pulse">
                  <AlertTriangle size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter">
                    Emergency SOS Received
                  </h2>
                  <p className="text-xs font-bold text-purple-100 uppercase tracking-widest mt-1">
                    Priority 1: Immediate Dispatch Required
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEmergencyAlert(null)}
                className="relative z-10 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-slate-400">
                      Patient Identity
                    </p>
                    <p className="text-xl font-black text-slate-800">
                      {emergencyAlert?.patientName}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-slate-400">
                      Contact Number
                    </p>
                    <p className="text-lg font-bold text-indigo-600 flex items-center gap-2">
                      <PhoneCall size={16} /> {emergencyAlert?.phone}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-slate-400">
                      Time Reported
                    </p>
                    <p className="text-lg font-bold text-slate-800">
                      {emergencyAlert?.createdAt
                        ? new Date(emergencyAlert.createdAt).toLocaleTimeString()
                        : "N/A"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-slate-400">
                      Alert Severity
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500 animate-ping"></div>
                      <p className="text-lg font-black text-purple-600 uppercase">
                        Critical
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-6 rounded-sm space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-purple-600" />
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                    Reported Location
                  </p>
                </div>
                <p className="text-sm font-bold text-slate-700 leading-relaxed italic border-l-4 border-purple-500 pl-4 bg-white p-4">
                  {emergencyAlert?.address || "Live GPS Coordinates: View Map below"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${emergencyAlert?.location?.lat},${emergencyAlert?.location?.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-slate-900 text-white py-4 rounded-sm font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl"
                >
                  <MapPin size={18} /> Open In Google Maps
                </a>
                <button
                  onClick={async () => {
                    try {
                      await dispatch(
                        updateEmergencyStatusThunk({
                          id: emergencyAlert?._id,
                          status: "Dispatched",
                        }),
                      ).unwrap();
                      toast.success("Ambulance Dispatched Immediately!");
                      setEmergencyAlert(null);
                      setActiveTab("emergency");
                    } catch (error) {
                      toast.error("Dispatch failed. Please try manual override.");
                    }
                  }}
                  className="w-full bg-linear-to-r from-purple-600 via-purple-700 to-indigo-700 text-white py-4 rounded-sm font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:shadow-xl hover:scale-[1.02] transition-all"
                >
                  <Siren size={20} className="animate-pulse" /> Send Ambulance Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ActionCard = ({ title, icon, children, gradient }) => (
  <div className="bg-white rounded-sm border border-purple-100 p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
    <div className="flex items-center gap-3 mb-3">
      <div
        className={`h-8 w-8 rounded-sm bg-linear-to-br ${gradient} flex items-center justify-center shadow-md`}
      >
        {React.cloneElement(icon, { size: 16, className: "text-white" })}
      </div>
      <h3 className="text-xs font-black uppercase tracking-wider text-gray-800">
        {title}
      </h3>
    </div>
    {children}
  </div>
);

const GridBtn = ({ icon, label, to, onClick, color }) => {
  const baseClass =
    `bg-linear-to-br ${color} p-3 rounded-sm text-white flex flex-col items-center justify-center gap-2 hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg w-full group`;

  if (to) {
    return (
      <Link to={to} className={baseClass}>
        {React.cloneElement(icon, {
          size: 18,
          strokeWidth: 2,
          className: "group-hover:scale-110 transition-transform",
        })}
        <span className="text-[9px] font-black uppercase tracking-tighter text-center leading-tight">
          {label}
        </span>
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={baseClass}>
      {React.cloneElement(icon, {
        size: 18,
        strokeWidth: 2,
        className: "group-hover:scale-110 transition-transform",
      })}
      <span className="text-[9px] font-black uppercase tracking-tighter text-center leading-tight">
        {label}
      </span>
    </button>
  );
};

const SmallBtn = ({ icon, label, to, onClick }) => {
  const baseClass =
    "flex items-center gap-2 px-4 py-2 bg-white border border-purple-200 rounded-sm shadow-sm hover:shadow-md hover:bg-purple-50 transition-all text-xs font-semibold text-purple-700";

  if (to) {
    return (
      <Link to={to} className={baseClass}>
        {icon}
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={baseClass}>
      {icon}
      <span>{label}</span>
    </button>
  );
};

const SidebarBtn = ({ icon, label, active = false, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-all duration-200 text-xs font-bold uppercase tracking-wider group ${active
      ? "bg-linear-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
      : "text-purple-200 hover:bg-purple-800/50 hover:text-white"
      }`}
  >
    <span className={active ? "text-white" : "text-purple-300 group-hover:text-white"}>
      {React.cloneElement(icon, { size: 18 })}
    </span>
    <span>{label}</span>
  </button>
);

export default AdminDashboard;