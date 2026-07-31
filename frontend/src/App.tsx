import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Navbar from "./layouts/Navbar";
import About from "./features/about/pages/About";
import AdminDashboard from "./features/admin/pages/AdminDashboard";
import Contact from "./features/contact/pages/Contact";
import Home from "./features/home/page/Home";
import OwnerDashboard from "./features/owner/pages/OwnerDashboard";
import ProfilePage from "./features/profile/pages/ProfilePage";
import BookTurf from "./features/booking/pages/TurfBook";
import Turfs from "./features/turf/pages/Turfs";
import TurfDetail from "./features/turf/pages/TurfDetail";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/turfs" element={<Turfs />} />
          <Route path="/turf/:id" element={<TurfDetail />} />
          <Route path="/book-turf" element={<BookTurf />} />
          <Route path="/contacts" element={<Contact />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/owner" element={<OwnerDashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
