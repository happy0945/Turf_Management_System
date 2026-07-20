
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./layout/Navbar";
import About from "./pages/About";
import Turfs from "./pages/Turfs";
import BookTurf from "./pages/TurfBook";
import Contact from "./pages/Contact";
import Home from "./pages/HomePage/Home";
import Register from "./features/auth/component/Register";
import Login from "./features/auth/component/Login";
import AdminDashboard from "./pages/AdminDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import ProfilePage from "./pages/ProfilePage";
import { turfCatalogData } from "./pages/HomePage/turfCatalogData";

function App() {
  useEffect(() => {
    // 1. Initialize Turfs Database
    if (!localStorage.getItem("turfCatalogData")) {
      localStorage.setItem("turfCatalogData", JSON.stringify(turfCatalogData));
    }

    // 2. Initialize default users
    const defaultUsers = [
      {
        username: "Super Admin",
        email: "admin@turf.com",
        password: "admin123",
        contactNumber: "1234567890",
        role: "admin",
        status: "Verified",
      },
      {
        username: "Nikhil Soni (Owner)",
        email: "owner@turf.com",
        password: "owner123",
        contactNumber: "9876543210",
        role: "owner",
        status: "Verified",
        ownedTurfId: 1,
        businessName: "Greenfield Sports LLC",
        businessAddress: "New York, USA",
        licenseNumber: "LIC-12345",
      },
    ];

    const existingUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    if (existingUsers.length === 0) {
      localStorage.setItem("registeredUsers", JSON.stringify(defaultUsers));
    } else {
      const hasAdmin = existingUsers.some((u: any) => u.email === "admin@turf.com");
      const hasOwner = existingUsers.some((u: any) => u.email === "owner@turf.com");
      const updatedUsers = [...existingUsers];
      if (!hasAdmin) updatedUsers.push(defaultUsers[0]);
      if (!hasOwner) updatedUsers.push(defaultUsers[1]);
      localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));
    }

    // 3. Initialize default Bookings
    if (!localStorage.getItem("bookings")) {
      const defaultBookings = [
        {
          reference: "THB-481920",
          turfId: 1,
          turfName: "Greenfield Cricket Ground",
          date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
          slotTime: "08:00 AM - 10:00 AM",
          playerName: "Rohan Sharma",
          playerEmail: "rohan@gmail.com",
          playerPhone: "9829384910",
          amount: 100,
          status: "Confirmed",
          paymentMethod: "UPI",
          timestamp: new Date().toISOString(),
        },
        {
          reference: "THB-932185",
          turfId: 1,
          turfName: "Greenfield Cricket Ground",
          date: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
          slotTime: "04:00 PM - 06:00 PM",
          playerName: "Alice Smith",
          playerEmail: "alice@email.com",
          playerPhone: "9001827364",
          amount: 100,
          status: "Confirmed",
          paymentMethod: "Card",
          timestamp: new Date().toISOString(),
        },
        {
          reference: "THB-721849",
          turfId: 2,
          turfName: "Sunnyvale Sports Complex",
          date: new Date().toISOString().split("T")[0],
          slotTime: "06:00 PM - 08:00 PM",
          playerName: "Vikram Singh",
          playerEmail: "vikram@gmail.com",
          playerPhone: "8887776665",
          amount: 80,
          status: "Confirmed",
          paymentMethod: "UPI",
          timestamp: new Date().toISOString(),
        },
      ];
      localStorage.setItem("bookings", JSON.stringify(defaultBookings));
    }
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/turfs" element={<Turfs />} />
        <Route path="/book-turf" element={<BookTurf />} />
        <Route path="/contacts" element={<Contact />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/owner" element={<OwnerDashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
