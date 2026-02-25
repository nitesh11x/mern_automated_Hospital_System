import React from "react";
import { useSelector } from "react-redux";
import AdminSidebar from "./AdminSidebar";
import AdminHero from "./AdminHero";

const AdminDashboard = () => {
  const { isAdminAuthenticated } = useSelector((state) => state.admin);

  if (!isAdminAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] pt-16">
      {/* 1. RENDER SIDEBAR */}
      <AdminSidebar />

      {/* 2. RENDER HERO CONTENT */}
      <main className="flex-1 p-4 lg:p-8">
        <AdminHero />
      </main>
    </div>
  );
};

export default AdminDashboard;