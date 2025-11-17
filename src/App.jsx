import { Routes, Route } from 'react-router-dom';
import './index.css';
import Navbar from './Components/Navbar';
import Home from './Pages/Home';
import About from './Pages/About';
import FilePorocessing from './Pages/FilePorocessing';
import Contact from "./Pages/Contact"
import Visas from './Pages/Visas';
import Footer from './Components/Footer';
import Chatbot from './Chatbot/Chatbot';
import CountryPage from './Pages/Countrypage';
import Whatsapp from './Chatbot/Whatsapp';
import Sidefloat from './Components/Sidefloat';
import HajandUmmrah from './Pages/HajandUmmrah';
import Login from './Authentication/Login';
import Signup from './Authentication/Signup';


function App() {
  return (
    <>
      {/* Navbar stays visible on every page */}
      <Navbar />

      {/* Route-based pages */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/fileprocessing" element={<FilePorocessing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/visas" element={<Visas />} />
        <Route path="/haj" element={<HajandUmmrah />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />


        {/* Country Routes */}
        <Route path="/countries/:country" element={<CountryPage />} />
        {/* Example static routes for UK and USA */}
       
      </Routes>
      <Footer/>
      <Chatbot/>
      <Sidefloat/>
      <Whatsapp/>
    </>
  );
}

export default App;
