import React from "react";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import AllRooms from "./pages/AllRooms";
import RoomDetailes from "./pages/RoomDetailes";
import Booking from "./pages/Booking";
import Footer from "./components/Footer";
import MyBooking from "./pages/MyBooking";
import Layout from "./pages/hotelOwner/Layout";
import Dashboard from "./pages/hotelOwner/Dashboard";
import AddRoom from "./pages/hotelOwner/AddRoom";
import ListRoom from "./pages/hotelOwner/ListRoom";
import UpdateRoom from "./pages/hotelOwner/UpdateRoom";
import AdminLayout from "./pages/Admin/Layout";
import AdminDashboard from "./pages/Admin/dashboard";
import AdminUsers from "./pages/Admin/Users";
import AdminRooms from "./pages/Admin/Rooms";
import AdminBookings from "./pages/Admin/Bookings";
import AdminRoomDetail from "./pages/Admin/RoomDetail";
import Login from "./components/Login";
import Signup from "./components/Signup";
import About from "./pages/About";

const App = () => {
  const pathname = useLocation().pathname;
  const isOwnerPath = pathname.includes("owner");
  const isAdminPath = pathname.includes("admin");

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {!isOwnerPath && !isAdminPath && <Navbar />}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/rooms" element={<AllRooms />} />
          <Route path="/rooms/:id" element={<RoomDetailes />} />
          <Route path="/booking/:id" element={<Booking />} />
          <Route path="/my-booking" element={<MyBooking />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/owner" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="add-room" element={<AddRoom />} />
            <Route path="list-room" element={<ListRoom />} />
            <Route path="update-room/:id" element={<UpdateRoom />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="rooms" element={<AdminRooms />} />
            <Route path="rooms/:id" element={<AdminRoomDetail />} />
            <Route path="bookings" element={<AdminBookings />} />
          </Route>
        </Routes>
      </div>
      {!isOwnerPath && !isAdminPath && <Footer />}
    </div>
  );
};

export default App;
