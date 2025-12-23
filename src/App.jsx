import { Routes, Route } from 'react-router-dom';
import './index.css';
import ScrollToTop from './StateManagement/ScrollToTop';

// --- Auth Imports ---
import { AuthProvider } from './Context/AuthContext';
import RequireAuth from './Context/RequireAuht';

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
import AlfaPayment from './Components/AlfaPayment';
import PaymentReturn from './Pages/PaymentReturn';

function App() {
  return (
    <>
      <AuthProvider>
        <ScrollToTop />
        <Navbar />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/fileprocessing" element={<FilePorocessing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/visas" element={<Visas />} />
          <Route path="/haj" element={<HajandUmmrah />} />
          <Route path="/countries/:country" element={<CountryPage />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Package & Purchase Routes */}
          <Route path="/packages" element={<Packages />} />
          <Route 
            path="/purchase" 
            element={
              <RequireAuth>
                <HandlePurchase />
              </RequireAuth>
            } 
          />
          
          {/* Payment Flow Routes */}
          <Route path="/paypage" element={<AlfaPayment />} />
          
          {/* IMPORTANT: Bank Alfalah redirects here after payment */}
          <Route path="/payment-return" element={<PaymentReturn />} />
          
          {/* Final confirmation page (after PaymentReturn processes everything) */}
          <Route path="/bookingconfirmation" element={<BookingConfirmation />} />
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
