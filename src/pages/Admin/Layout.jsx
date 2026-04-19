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
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex h-full">
        <Sidebar />
        <div className="flex-1 p-4 pt-10 md:px-10 h-full overflow-y-auto hide-scrollbar">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
