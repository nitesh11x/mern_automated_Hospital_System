import React, { useMemo, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getDashboardStatsThunk } from "../../redux/slices/admin.slice";
import { useNavigate } from "react-router-dom";
import DoctorManage from "../doctor/DoctorManage";
import PatientManage from "../patient/PatientManage";
import ShowAppointments from "../appointment/ShowAppointments";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import {
  UserPlus,
  Stethoscope,
  Lock,
  Users,
  Calendar,
  Star,
  ShieldCheck,
  Activity,
  LogOut,
  LayoutDashboard,
  UserCog,
  UserMinus,
  RefreshCcw,
  FileEdit,
  UserCheck,
  ClipboardList,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  PlusCircle,
  ArrowRight,
} from "lucide-react";
import { changeOtpFlagThunk } from "../../redux/slices/otp.slice";
import { toast } from "react-hot-toast";

const COLORS = {
  primary: "#8B5CF6",
  primaryDark: "#7C3AED",
  primaryLight: "#A78BFA",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  purple: "#A855F7",
  indigo: "#8B5CF6",
  indigo: "#6366F1",
};

const PIE_COLORS = [COLORS.success, COLORS.warning, COLORS.primary, COLORS.danger];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("dashboard");

  const { isAdminAuthenticated, admin, stats } = useSelector(
    (state) => state.admin,
  );
  const { patients } = useSelector((state) => state.patient);
  const { doctors } = useSelector((state) => state.doctor);
  const { appointments } = useSelector((state) => state.appointment);
  const { bypassOtp } = useSelector((state) => state.otp);

  useEffect(() => {
    if (isAdminAuthenticated) {
      dispatch(getDashboardStatsThunk());
    }
  }, [dispatch, isAdminAuthenticated]);

  const chartData = useMemo(
    () => [
      { name: "Approved", value: appointments?.filter((r) => r.status === "Approved").length || 0 },
      { name: "Pending", value: appointments?.filter((r) => r.status === "Pending").length || 0 },
      { name: "Completed", value: appointments?.filter((r) => r.status === "Completed").length || 0 },
      { name: "Cancelled", value: appointments?.filter((r) => r.status === "Cancelled").length || 0 },
    ],
    [appointments],
  );

  const changeOtpFlagHandle = async () => {
    try {
      await dispatch(changeOtpFlagThunk(!bypassOtp)).unwrap();
      toast.success(bypassOtp ? "OTP Security Enabled" : "OTP Bypass Mode Activated");
    } catch (error) {
      toast.error("Failed to update security settings");
      console.error("Failed to update OTP flag", error);
    }
  };

  if (!isAdminAuthenticated) return null;

  const StatCard = ({ title, value, icon, trend, trendValue, color }) => (
    <div className="bg-white rounded-sm p-6 border border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300 group">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-purple-600">{title}</p>
          <p className="text-3xl font-black text-gray-800">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 text-xs">
              <TrendingUp size={12} className={trend === "up" ? "text-green-500" : "text-red-500"} />
              <span className={trend === "up" ? "text-green-600" : "text-red-600"}>{trendValue}</span>
            </div>
          )}
        </div>
        <div className={`h-12 w-12 rounded-sm bg-linear-to-br ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-linear-to-br from-purple-50 via-white to-indigo-50 font-sans">
      {/* --- LEFT NAVIGATION --- */}
      <aside className="w-72 bg-linear-to-b pt-18 from-purple-900 via-purple-800 to-indigo-900 text-purple-200 hidden lg:flex flex-col p-6 sticky top-0 h-screen shadow-2xl">
        <div className="px-2 pt-4 mb-12">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-10 w-10 rounded-sm bg-linear-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg">
              <Stethoscope size={20} className="text-white" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              New<span className="text-purple-300">Care</span>
            </h2>
          </div>
          <p className="text-[10px] font-bold text-purple-300 tracking-[0.2em] uppercase mt-2">
            ADMINISTRATOR PORTAL
          </p>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarBtn
            icon={<LayoutDashboard size={20} />}
            label="Operational Hub"
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
          />
          <SidebarBtn
            icon={<Stethoscope size={20} />}
            label="Medical Faculty"
            active={activeTab === "doctors"}
            onClick={() => setActiveTab("doctors")}
          />
          <SidebarBtn
            icon={<Users size={20} />}
            label="Patient Registry"
            active={activeTab === "patients"}
            onClick={() => setActiveTab("patients")}
          />
          <SidebarBtn
            icon={<Calendar size={20} />}
            label="Appointments"
            active={activeTab === "appointments"}
            onClick={() => setActiveTab("appointments")}
          />
        </nav>

        <div className="pt-6 mt-6 border-t border-purple-700/50">
          <button className="flex items-center gap-3 p-3 hover:bg-purple-800/50 rounded-sm transition-all text-xs font-bold uppercase tracking-widest w-full group">
            <LogOut size={18} className="group-hover:text-purple-300" />
            <span className="group-hover:text-white">Exit System</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* TOP HEADER */}
          <div className="flex justify-between items-end pt-4 mb-8 flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-black bg-linear-to-r from-purple-700 via-purple-600 to-indigo-600 bg-clip-text text-transparent pt-6">
                {activeTab === "dashboard"
                  ? "Dashboard"
                  : activeTab === "doctors"
                    ? "Medical Faculty"
                    : activeTab === "patients"
                      ? "Patient Registry"
                      : "Appointments Overview"}
              </h1>
              <p className="text-purple-500 text-[11px] font-semibold uppercase tracking-wider mt-2 flex items-center gap-2">
                <Activity size={12} />
                Enterprise Healthcare Management System
              </p>
            </div>
            <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm p-2 px-4 rounded-sm border border-purple-200 shadow-md">
              <ShieldCheck size={16} className="text-emerald-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                Security: Tier 1 Authorized
              </span>
              <button
                onClick={changeOtpFlagHandle}
                className={`px-4 py-1.5 rounded-sm text-white text-[10px] font-bold uppercase transition-all shadow-md ${bypassOtp
                  ? "bg-amber-500 hover:bg-amber-600"
                  : "bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  }`}
              >
                {bypassOtp ? "🔓 Disable OTP" : "🔒 Enable OTP"}
              </button>
            </div>
          </div>

          {activeTab === "dashboard" && (
            <>
              {/* STATS CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-6 mb-4">
                <StatCard
                  title="Active Admissions"
                  value={stats?.totalPatients || 0}
                  icon={<Users size={24} className="text-white" />}
                  trend="up"
                  trendValue="+12% vs last month"
                  color="from-emerald-500 to-emerald-600"
                />
                <StatCard
                  title="Medical Faculty"
                  value={stats?.totalDoctors || 0}
                  icon={<Stethoscope size={24} className="text-white" />}
                  trend="up"
                  trendValue="+4 new this quarter"
                  color="from-purple-500 to-indigo-500"
                />
                <StatCard
                  title="Total Appointments"
                  value={stats?.totalAppointments || 0}
                  icon={<Calendar size={24} className="text-white" />}
                  trend="up"
                  trendValue="+18% capacity"
                  color="from-blue-500 to-indigo-500"
                />
                <StatCard
                  title="Total Revenue"
                  value={`₹${(stats?.totalRevenue || 0).toLocaleString()}`}
                  icon={<TrendingUp size={24} className="text-white" />}
                  trend="up"
                  trendValue="+22% YoY"
                  color="from-amber-500 to-orange-500"
                />
              </div>

              {/* QUICK ACTION BUTTON GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                <ActionCard title="Quic Links" icon={<Lock size={18} />} gradient="from-purple-500 to-indigo-500">
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <GridBtn icon={<UserPlus />} label="Register Admin" to="/admin/register" color="from-purple-600 to-indigo-600" />
                    <GridBtn icon={<RefreshCcw />} label="Update Status" to="/admin/status" color="from-gray-700 to-gray-800" />
                    <GridBtn icon={<UserPlus />} label="Add Doctor" to="/doctor/register" color="from-purple-600 to-indigo-700" />
                    <GridBtn icon={<UserCog />} label="Edit Profile" to={`/admin/profile/${admin?.[0]?._id}`} color="from-gray-700 to-gray-800" />
                    <GridBtn icon={<UserPlus />} label="Add Patient" to="/patient/register" color="from-purple-600 to-indigo-700" />
                  </div>
                </ActionCard>

                <ActionCard title="Patient Operations" icon={<Users size={18} />} gradient="from-emerald-500 to-teal-500">
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <GridBtn icon={<PlusCircle />} label="New Admission" to="/patient/register" color="from-emerald-600 to-emerald-700" />
                    <GridBtn icon={<ClipboardList />} label="Manage All" onClick={() => setActiveTab("patients")} color="from-gray-700 to-gray-800" />
                    <GridBtn icon={<UserCheck />} label="Triage Status" onClick={() => setActiveTab("appointments")} color="from-gray-700 to-gray-800" />
                    <GridBtn icon={<FileEdit />} label="Clinical Records" to="/patient/records" color="from-gray-700 to-gray-800" />
                  </div>
                </ActionCard>

                <ActionCard title="Analytics Hub" icon={<TrendingUp size={18} />} gradient="from-amber-500 to-orange-500">
                  <div className="space-y-3 mt-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-sm">
                      <span className="text-xs font-bold uppercase">Revenue Growth</span>
                      <span className="text-lg font-black text-green-600">+22%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-sm">
                      <span className="text-xs font-bold uppercase">Patient Satisfaction</span>
                      <span className="text-lg font-black text-purple-600">4.8/5</span>
                    </div>
                    <button
                      onClick={() => navigate("/reviews")}
                      className="w-full py-2.5 bg-linear-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                    >
                      <Star size={14} /> Manage Reviews & Feedback
                    </button>
                  </div>
                </ActionCard>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* APPOINTMENT ANALYTICS */}
                <div className="lg:col-span-2 bg-white rounded-sm border border-purple-100 p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                    <h3 className="text-xs font-black uppercase tracking-wider text-purple-600 flex items-center gap-2">
                      <Activity size={14} />
                      Appointment Throughput Analytics
                    </h3>
                    <div className="flex gap-6">
                      <div className="text-center">
                        <p className="text-xl font-black text-purple-700">{stats?.totalPatients || 0}</p>
                        <p className="text-[9px] font-bold text-purple-400 uppercase">Active</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-black text-purple-700">{stats?.totalDoctors || 0}</p>
                        <p className="text-[9px] font-bold text-purple-400 uppercase">Faculty</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-black text-purple-700">{stats?.totalAppointments || 0}</p>
                        <p className="text-[9px] font-bold text-purple-400 uppercase">Schedules</p>
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
                            <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
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

                {/* REAL-TIME STAFF LIST */}
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
                        key={i}
                        className="flex items-center justify-between p-3 bg-linear-to-r from-purple-50 to-indigo-50 rounded-sm hover:shadow-md transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-sm bg-linear-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                            {doc.firstName?.charAt(0) || "D"}
                          </div>
                          <div>
                            <p className="text-sm font-black text-gray-800 group-hover:text-purple-700 transition-colors">
                              Dr. {doc.firstName || "Physician"} {doc.lastName || ""}
                            </p>
                            <p className="text-[10px] font-semibold text-purple-500 uppercase">
                              {doc.department || "General Medicine"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-sm bg-emerald-500 animate-pulse" />
                          <span className="text-[8px] font-bold text-emerald-600">Active</span>
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
        </div>
      </main>
    </div>
  );
};

// --- INTERNAL COMPONENTS ---
const ActionCard = ({ title, icon, children, gradient }) => (
  <div className="bg-white rounded-sm border border-purple-100 p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
    <div className="flex items-center gap-3 mb-3">
      <div className={`h-8 w-8 rounded-sm bg-linear-to-br ${gradient} flex items-center justify-center shadow-md`}>
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
  const Component = onClick ? 'button' : 'a';
  const props = onClick ? { onClick } : { href: to };

  return (
    <Component
      {...props}
      className={`bg-linear-to-br ${color} p-3 rounded-sm text-white flex flex-col items-center justify-center gap-2 hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg w-full group`}
    >
      {React.cloneElement(icon, { size: 18, strokeWidth: 2, className: "group-hover:scale-110 transition-transform" })}
      <span className="text-[9px] font-black uppercase tracking-tighter text-center leading-tight">
        {label}
      </span>
    </Component>
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