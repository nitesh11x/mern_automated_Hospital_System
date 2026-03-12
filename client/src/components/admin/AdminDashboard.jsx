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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
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
  ChevronRight,
  HeartPulse,
  LogOut,
  LayoutDashboard,
  Settings,
  UserCog,
  UserMinus,
  RefreshCcw,
  FileEdit,
  UserCheck,
  ClipboardList,
  Database,
} from "lucide-react";
import { changeOtpFlagThunk } from "../../redux/slices/otp.slice";
import { toast } from "react-hot-toast";

const COLORS = {
  primary: "#4F46E5",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
};

const PIE_COLORS = [COLORS.success, COLORS.warning, COLORS.primary, COLORS.danger];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("dashboard");

  // --- REDUX STATE ---
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

  const weeklyActivity = [
    { day: "Mon", apps: 40 },
    { day: "Tue", apps: 55 },
    { day: "Wed", apps: 48 },
    { day: "Thu", apps: 70 },
    { day: "Fri", apps: 62 },
    { day: "Sat", apps: 30 },
    { day: "Sun", apps: 15 },
  ];
  const chartData = useMemo(
    () => [
      {
        name: "Approved",
        value:
          appointments?.filter((r) => r.status === "Approved").length || 0,
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

  const changeOtpFlagHandle = async () => {
    try {
      await dispatch(changeOtpFlagThunk(!bypassOtp)).unwrap();
      toast.success("Success True");
    } catch (error) {
      toast.error("Success True");
      console.error("Failed to update OTP flag", error);
    }
  };
  //   const changeOtpFlagHandle = async () => {
  //     await dispatch(changeOtpFlagThunk(!bypassOtp));
  //     console.log(bypassOtp);
  //   };

  if (!isAdminAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans">
      {/* --- LEFT NAVIGATION --- */}
      <aside className="w-64 bg-slate-900 text-slate-400 hidden lg:flex flex-col p-4 pt-16 sticky top-0 h-screen">
        <div className="px-2 pt-4 mb-10">
          <h2 className="text-xl font-black text-white tracking-tighter uppercase">
            MED<span className="text-indigo-500">OS</span>
          </h2>
          <p className="text-[9px] font-bold text-slate-500 tracking-[0.3em]">
            ADMINISTRATOR v2.1
          </p>
        </div>
        <nav className="flex-1 space-y-1">
          <SidebarBtn
            icon={<LayoutDashboard size={18} />}
            label="Operational Hub"
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
          />
          <SidebarBtn
            icon={<Stethoscope size={18} />}
            label="Medical Faculty"
            active={activeTab === "doctors"}
            onClick={() => setActiveTab("doctors")}
          />
          <SidebarBtn
            icon={<Users size={18} />}
            label="Patient Registry"
            active={activeTab === "patients"}
            onClick={() => setActiveTab("patients")}
          />
          <SidebarBtn
            icon={<Calendar size={18} />}
            label="Appointments"
            active={activeTab === "appointments"}
            onClick={() => setActiveTab("appointments")}
          />
        </nav>
        <div className="pt-4 border-t border-slate-800">
          <button className="flex items-center gap-4 p-3 hover:text-white transition-all text-xs font-bold uppercase tracking-widest">
            <LogOut size={18} /> Exit System
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-6 lg:p-10">
        <div className="max-w-7xl mx-auto">
          {/* TOP HEADER */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-black text-slate-900 pt-10 uppercase tracking-tighter">
                {activeTab === "dashboard"
                  ? "Command Dashboard"
                  : activeTab === "doctors"
                    ? "Medical Faculty"
                    : activeTab === "patients"
                      ? "Patient Registry"
                      : "Appointments Overview"}
              </h1>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                Enterprise Facility Management Overview
              </p>
            </div>
            <div className="flex items-center gap-3 bg-white p-2 border border-slate-200 rounded shadow-sm">
              <ShieldCheck size={16} className="text-emerald-500" />
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                Security: Tier 1 Authorized
              </span>
              <span>
                <button
                  onClick={changeOtpFlagHandle}
                  className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-bold uppercase rounded"
                >
                  {bypassOtp ? "Disable OTP" : "Enable OTP"}
                </button>
              </span>
            </div>
          </div>

          {activeTab === "dashboard" && (
            <>
              {/* QUICK ACTION BUTTON GRID */}
              <div className="grid grid-cols-1 xl:grid-cols-4 w-full gap-6 mb-10">
                <ActionCard title="Admin Control" icon={<Lock />}>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <GridBtn
                      icon={<UserPlus />}
                      label="Register Admin"
                      to="/admin/register"
                      color="bg-indigo-600"
                    />
                    <GridBtn
                      icon={<UserCog />}
                      label="Edit My Profile"
                      to={`/admin/profile/${admin?.[0]?._id}`}
                      color="bg-slate-700"
                    />
                    <GridBtn
                      icon={<RefreshCcw />}
                      label="Update Status"
                      to="/admin/status"
                      color="bg-slate-700"
                    />
                    <GridBtn
                      icon={<UserMinus />}
                      label="Delete Admin"
                      to="/admin/manage"
                      color="bg-rose-600"
                    />
                  </div>
                </ActionCard>

                {/* Patient Management Group */}
                <ActionCard title="Patient Operations" icon={<Users />}>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <GridBtn
                      icon={<PlusCircleIcon />}
                      label="New Admission"
                      to="/patient/register"
                      color="bg-emerald-600"
                    />
                    <GridBtn
                      icon={<ClipboardList />}
                      label="Manage All"
                      onClick={() => setActiveTab("patients")}
                      color="bg-slate-700"
                    />
                    <GridBtn
                      icon={<UserCheck />}
                      label="Triage Status"
                      onClick={() => setActiveTab("appointments")}
                      color="bg-slate-700"
                    />
                    <GridBtn
                      icon={<FileEdit />}
                      label="Clinical Records"
                      to="/patient/records"
                      color="bg-slate-700"
                    />
                  </div>
                </ActionCard>
                <ActionCard title="Patient Operations" icon={<Users />}>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <GridBtn
                      icon={<PlusCircleIcon />}
                      label="New Admission"
                      to="/patient/register"
                      color="bg-emerald-600"
                    />
                    <GridBtn
                      icon={<ClipboardList />}
                      label="Manage All"
                      onClick={() => setActiveTab("patients")}
                      color="bg-slate-700"
                    />
                    <GridBtn
                      icon={<UserCheck />}
                      label="Triage Status"
                      onClick={() => setActiveTab("appointments")}
                      color="bg-slate-700"
                    />
                    <GridBtn
                      icon={<FileEdit />}
                      label="Clinical Records"
                      to="/patient/records"
                      color="bg-slate-700"
                    />
                  </div>
                </ActionCard>
                <ActionCard title="Patient Operations" icon={<Users />}>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <GridBtn
                      icon={<PlusCircleIcon />}
                      label="New Admission"
                      to="/patient/register"
                      color="bg-emerald-600"
                    />
                    <GridBtn
                      icon={<ClipboardList />}
                      label="Manage All"
                      onClick={() => setActiveTab("patients")}
                      color="bg-slate-700"
                    />
                    <GridBtn
                      icon={<UserCheck />}
                      label="Triage Status"
                      onClick={() => setActiveTab("appointments")}
                      color="bg-slate-700"
                    />
                    <GridBtn
                      icon={<FileEdit />}
                      label="Clinical Records"
                      to="/patient/records"
                      color="bg-slate-700"
                    />
                  </div>
                </ActionCard>

                {/* System & Analytics Group */}
                {/* <ActionCard title="Facility Metrics" icon={<Activity />}>
                  <div className="h-30 w-full mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyActivity}>
                        <Bar
                          dataKey="apps"
                          fill="#CBD5E1"
                          radius={[2, 2, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <button
                    onClick={() => navigate("/reviews")}
                    className="w-full mt-4 py-2 bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest rounded flex items-center justify-center gap-2 hover:bg-amber-600 transition-colors"
                  >
                    <Star size={14} /> Manage Reviews & Feedback
                  </button>
                </ActionCard> */}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* APPOINTMENT ANALYTICS */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                      Appointment Throughput
                    </h3>
                    <div className="flex gap-4">
                      <div className="text-right">
                        <p className="text-lg font-black text-slate-900 leading-none">
                          {stats?.totalPatients || 0}
                        </p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                          Active Admissions
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-slate-900 leading-none">
                          {stats?.totalDoctors || 0}
                        </p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                          Medical Faculty
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-slate-900 leading-none">
                          {stats?.totalAppointments || 0}
                        </p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                          Total Schedules
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-slate-900 leading-none">
                          ₹{stats?.totalRevenue || 0}
                        </p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                          Revenue
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="h-75">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          innerRadius={80}
                          outerRadius={110}
                          paddingAngle={8}
                          dataKey="value"
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
                            fontSize: "10px",
                            fontWeight: "bold",
                            borderRadius: "0px",
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
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* REAL-TIME STAFF LIST */}
                <div className="bg-white border border-slate-200 rounded p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900">
                      Medical Faculty
                    </h3>
                    <button
                      onClick={() => setActiveTab("doctors")}
                      className="text-[9px] font-black text-indigo-600 uppercase hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-4">
                    {(doctors || [1, 2, 3, 4, 5]).slice(0, 5).map((doc, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs uppercase">
                            {doc.firstName?.charAt(0) || "D"}
                          </div>
                          <div>
                            <p className="text-[11px] font-black text-slate-900 uppercase">
                              Dr. {doc.lastName || "Physician"}
                            </p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">
                              {doc.department || "General"}
                            </p>
                          </div>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => navigate("/user/doctor/register")}
                    className="w-full mt-6 py-3 border-2 border-dashed border-slate-200 text-slate-400 hover:border-indigo-400 hover:text-indigo-600 text-[10px] font-black uppercase tracking-widest transition-all rounded"
                  >
                    + Induct New Medical Staff
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

const ActionCard = ({ title, icon, children }) => (
  <div className="bg-white border border-slate-200 p-6 rounded shadow-sm relative overflow-hidden group">
    <div className="flex items-center gap-3 mb-2">
      <span className="text-indigo-600">
        {React.cloneElement(icon, { size: 18 })}
      </span>
      <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900">
        {title}
      </h3>
    </div>
    {children}
  </div>
);

const GridBtn = ({ icon, label, to, onClick, color }) => {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`${color} p-3 rounded text-white flex flex-col items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-md shadow-slate-200 w-full`}
      >
        {React.cloneElement(icon, { size: 18, strokeWidth: 2.5 })}
        <span className="text-[9px] font-black uppercase tracking-tighter text-center leading-tight">
          {label}
        </span>
      </button>
    );
  }
  return (
    <a
      href={to}
      className={`${color} p-3 rounded text-white flex flex-col items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-md shadow-slate-200 w-full`}
    >
      {React.cloneElement(icon, { size: 18, strokeWidth: 2.5 })}
      <span className="text-[9px] font-black uppercase tracking-tighter text-center leading-tight">
        {label}
      </span>
    </a>
  );
};

const SidebarBtn = ({ icon, label, active = false, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3 rounded transition-all text-xs font-bold uppercase tracking-widest ${active
      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20"
      : "hover:bg-slate-800 hover:text-white"
      }`}
  >
    {icon}
    <span className="hidden lg:inline">{label}</span>
  </button>
);

const PlusCircleIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

export default AdminDashboard;
