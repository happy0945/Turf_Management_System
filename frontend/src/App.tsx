
import { BrowserRouter, Routes,Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import Turfs from "./pages/Turfs";
import BookTurf from "./pages/TurfBook";
import Contact from "./pages/Contact";
import Home from "./pages/HomePage/Home";

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
    </Routes>

    </BrowserRouter>
  ) 
}

export default App;
