
import { BrowserRouter, Routes,Route } from "react-router-dom";
import "./App.css";
import Navbar from "./layout/Navbar";
import About from "./pages/About";
import Turfs from "./pages/Turfs";
import BookTurf from "./pages/TurfBook";
import Contact from "./pages/Contact";
import Home from "./pages/HomePage/Home";
import Register from "./features/auth/component/Register";
import Login from "./features/auth/component/Login";

function App() {
  return(
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
    </Routes>

    </BrowserRouter>
  ) 
}

export default App;
