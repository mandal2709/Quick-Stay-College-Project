import React from "react";
import Navbar from "../../components/hotelOwner/Navbar";
import Sidebar from "../../components/Admin/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const navigate = useNavigate();

  // Simple access guard: only allow users with role "admin" to access admin pages.
  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user || user !== "admin") {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <div className="flex flex-1 flex-col lg:flex-row">
        <Sidebar />
        <div className="hide-scrollbar flex-1 overflow-y-auto p-4 pt-6 md:px-8 lg:px-10 lg:pt-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
