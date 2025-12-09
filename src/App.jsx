import { Routes, Route } from 'react-router-dom';
import './index.css';
import ScrollToTop from './StateManagement/ScrollToTop';

// --- Auth Imports ---
import { AuthProvider } from './Context/AuthContext'; // 1. Provider
import RequireAuth from './Context/RequireAuht';   // 2. Route Protector

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
import Packages from './Pages/Packages';
import HandlePurchase from './Pages/HandlePurchase';
import BookingConfirmation from './Pages/BookingConfirmation';

function App() {
  return (
    <>
      {/* 3. Wrap everything in AuthProvider so the user state is available globally */}
      <AuthProvider>
      
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
          
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path="/packages" element={<Packages />} />

          {/* 4. PROTECTED ROUTE: /purchase */}
          {/* If they are not logged in, they will be sent to Login, then back here */}
          <Route 
            path="/purchase" 
            element={
              <RequireAuth>
                <HandlePurchase />
              </RequireAuth>
            } 
          />

          <Route path="/bookingconfirmation" element={<BookingConfirmation />} />

          {/* Country Routes */}
          <Route path="/countries/:country" element={<CountryPage />} />
         
        </Routes>
        
        <Footer/>
        <Chatbot/>
        <Sidefloat/>
        <Whatsapp/>
        
      </AuthProvider>
    </>
  );
}

export default App;