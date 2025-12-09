import { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logoimg/image.png";

// --- Framer Motion & Icons ---
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa"; // Added User Icons

// --- Auth Imports ---
import { useAuth } from "../Context/AuthContext";
import { signOut } from "../firbase";

// --- Config for Navigation Links ---
const navItems = [
  { name: "Home", to: "/" },
  { name: "About Us", to: "/about" },
  { name: "Visa", to: "/visas", dropdownType: "visa" },
  { name: "File Process", to: "/fileprocessing", dropdownType: "fileProcess" },
  { name: "Contact", to: "/contact" },
  { name: "Haj and Ummrah", to: "/haj" },
];

// --- 1. Simple Nav Link Component ---
const SimpleNavLink = ({ item }) => (
  <NavLink
    to={item.to}
    className={({ isActive }) =>
      `relative group py-2 text-sm xl:text-base ${isActive ? "text-blue-600" : ""}`
    }
  >
    <span>{item.name}</span>
    <span
      className={`absolute left-0 bottom-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full ${
        ({ isActive }) => (isActive ? "w-full" : "w-0")
      }`}
    ></span>
  </NavLink>
);

// --- 2. Visa Dropdown Component ---
const VisaDropdown = () => {
  const [activeCategory, setActiveCategory] = useState("Asia");
  const [countries, setCountries] = useState({ Asia: [], Europe: [], Africa: [] });
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const isActive = location.pathname.startsWith("/visa");

  useEffect(() => {
    const curatedEuropeNames = new Set([
      "Austria", "Belgium", "Bulgaria", "CzechRepublic", "Denmark", "Estonia",
      "Finland", "France", "Germany", "Greece", "Hungary", "Ireland", "Italy",
      "Lithuania", "Netherlands", "Norway", "Poland", "Portugal", "Romania",
      "Spain", "Switzerland", "United Kingdom"
    ]);

    const curatedAsiaNames = new Set([
      "Azerbaijan", "Bahrain", "China", "Cambodia", "Egypt", 
      "Indonesia", "Japan", "Kazakhstan", "Malaysia", "Maldives", "Nepal",
      "Pakistan", "Philippines", "Qatar", "South Korea", "Sri Lanka",
      "Tajikistan", "Thailand", "Turkey", "Vietnam", "Saudi Arabia", "Singapore" ,"Morocco"
    ]);

    const curatedAfricaNames = new Set([
      "Egypt", "Ethiopia", "Kenya", "South Africa", "Zambia", "Uganda", "Sudan"
    ]);

    const fetchCountries = async () => {
      setIsLoading(true);
      try {
        const [asiaRes, europeRes, africaRes] = await Promise.all([
          fetch("https://restcountries.com/v3.1/region/asia?fields=name,flags,cca3"),
          fetch("https://restcountries.com/v3.1/region/europe?fields=name,flags,cca3"),
          fetch("https://restcountries.com/v3.1/region/africa?fields=name,flags,cca3"),
        ]);

        const asiaData = await asiaRes.json();
        const europeData = await europeRes.json();
        const africaData = await africaRes.json();
        const sortByName = (a, b) => a.name.common.localeCompare(b.name.common);

        setCountries({
          Asia: asiaData.filter((c) => curatedAsiaNames.has(c.name.common)).sort(sortByName),
          Europe: europeData.filter((c) => curatedEuropeNames.has(c.name.common)).sort(sortByName),
          Africa: africaData.filter((c) => curatedAfricaNames.has(c.name.common)).sort(sortByName),
        });
      } catch (error) {
        console.error("Failed to fetch country data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCountries();
  }, []);

  const currentList =
    activeCategory === "Asia" ? countries.Asia
    : activeCategory === "Europe" ? countries.Europe
    : countries.Africa;

  return (
    <div className="relative group">
      <div className={`relative group py-2 cursor-pointer text-sm xl:text-base ${isActive ? "text-blue-600" : ""}`}>
        <span>Visa</span>
        <span className={`absolute left-0 bottom-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full ${isActive ? "w-full" : "w-0"}`}></span>
      </div>

      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 pt-2 hidden group-hover:flex bg-white shadow-2xl rounded-lg overflow-hidden z-50 w-[500px] border border-gray-200">
        <div className="w-1/3 bg-gray-50 border-r border-gray-200">
          {["Asia", "Europe", "Africa"].map((region) => (
            <div
              key={region}
              onMouseEnter={() => setActiveCategory(region)}
              className={`p-4 font-semibold cursor-pointer ${
                activeCategory === region ? "bg-white text-blue-600" : "hover:bg-gray-100"
              }`}
            >
              {region}
            </div>
          ))}
        </div>
        <div className="w-2/3 h-80 overflow-y-auto p-2">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">Loading...</div>
          ) : (
            currentList.map((country) => (
              <Link
                key={country.cca3}
                to={`/Countries/${country.name.common.toLowerCase()}`}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100"
              >
                <img src={country.flags.png} alt={country.name.common} className="w-6 h-4 object-cover rounded-sm border border-gray-300" />
                <span className="text-sm font-medium">{country.name.common}</span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// --- 3. File Process Dropdown Component ---
const FileProcessDropdown = () => {
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const isActive = location.pathname.startsWith("/fileprocessing");

  useEffect(() => {
    const fetchCountries = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("https://restcountries.com/v3.1/alpha?codes=USA,CAN,GBR,AUS&fields=name,flags,cca3");
        const data = await res.json();
        setCountries(data.sort((a, b) => a.name.common.localeCompare(b.name.common)));
      } catch (error) {
        console.error("Failed to fetch file process countries:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCountries();
  }, []);

  return (
    <div className="relative group">
      <div className={`relative group py-2 cursor-pointer text-sm xl:text-base ${isActive ? "text-blue-600" : ""}`}>
        <span>File Process</span>
        <span className={`absolute left-0 bottom-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full ${isActive ? "w-full" : "w-0"}`}></span>
      </div>
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 pt-2 hidden group-hover:block bg-white shadow-2xl rounded-lg overflow-hidden z-50 w-64 border border-gray-200">
        <div className="overflow-y-auto p-2">
          {isLoading ? (
            <div className="flex items-center justify-center h-full p-4">Loading...</div>
          ) : (
            countries.map((country) => (
              <Link
                key={country.cca3}
                to={`/Countries/${country.name.common.toLowerCase()}`}
                className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-100"
              >
                <img src={country.flags.png} alt={country.name.common} className="w-6 h-4 object-cover rounded-sm border border-gray-300" />
                <span className="text-sm font-medium">{country.name.common}</span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// --- 4. Main Navbar Component ---
function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Auth Hook
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Logout Handler
  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login"); // Optional: redirect to login or home after logout
      setIsMobileMenuOpen(false); // Close mobile menu if open
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Mobile Menu Animation
  const mobileMenuVariants = {
    hidden: { x: "100%", transition: { type: "tween", duration: 0.3 } },
    visible: { x: 0, transition: { type: "tween", duration: 0.3 } },
  };

  return (
    <>
      <nav className="flex justify-center bg-white shadow w-full font-bold items-center h-20 px-4 md:px-6 relative z-30">
        
        {/* --- DESKTOP NAV (Visible on Large Screens only - lg+) --- */}
        {/* CHANGED: 'md:flex' -> 'lg:flex' to hide on small laptops/tablets */}
        <div className="hidden lg:flex justify-between w-full max-w-7xl items-center">
          <div className="flex gap-8 xl:gap-12 items-center">
            <Link to="/">
              <img src={logo} alt="OS Logo Image" className="w-[120px] h-[50px] object-contain" />
            </Link>
            {/* Nav Items */}
            <div className="flex gap-6 xl:gap-8 items-center cursor-pointer">
              {navItems.map((item) => {
                if (item.dropdownType === "visa") return <VisaDropdown key={item.name} />;
                if (item.dropdownType === "fileProcess") return <FileProcessDropdown key={item.name} />;
                return <SimpleNavLink key={item.name} item={item} />;
              })}
            </div>
          </div>

          {/* Right Side: Auth & Currency */}
          <div className="flex gap-4 xl:gap-6 items-center">
            <button className="cursor-pointer hover:text-blue-600 transition-colors">PKR</button>
            
            {/* --- AUTH CONDITIONAL RENDERING --- */}
            {currentUser ? (
              // Logged In State
              <div className="flex items-center gap-4 pl-4 border-l border-gray-300">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold text-gray-800 flex items-center gap-2">
                    {/* Fallback to email if name isn't set yet */}
                    {currentUser.displayName || "User"} 
                    <FaUserCircle className="text-xl text-blue-600" />
                  </span>
                  <span className="text-[10px] text-gray-500 font-normal">{currentUser.email}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <FaSignOutAlt className="text-xl" />
                </button>
              </div>
            ) : (
              // Logged Out State
              <>
                <Link to="/login">
                  <button className="cursor-pointer hover:text-blue-600 transition-colors text-sm xl:text-base">
                    Sign in
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="cursor-pointer border-blue-900 rounded-xl bg-blue-500 text-white hover:bg-blue-600 px-5 py-2 transition-all duration-300 transform hover:scale-105 text-sm xl:text-base">
                    Create Account
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* --- MOBILE/TABLET HEADER (Visible on Small Laptops & below - lg-) --- */}
        {/* CHANGED: 'md:hidden' -> 'lg:hidden' to show hamburger on small laptops */}
        <div className="flex lg:hidden justify-between items-center w-full">
          <div className="w-8"></div>
          <div className="flex-1 flex justify-center">
            <Link to="/">
              <img src={logo} alt="OS Logo Image" className="w-[100px] h-10 object-contain" />
            </Link>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-3xl z-50 text-gray-800"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <HiOutlineX /> : <HiOutlineMenu />}
          </button>
        </div>
      </nav>

      {/* --- MOBILE MENU OVERLAY --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 lg:hidden bg-white z-20 flex flex-col items-center justify-center gap-6 text-xl"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {/* Mobile Nav Links */}
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  isActive ? "text-blue-600 font-bold" : "text-gray-800 hover:text-blue-600 font-medium"
                }
              >
                {item.name}
              </NavLink>
            ))}

            <hr className="w-3/4 border-gray-200 my-2" />

            {/* --- MOBILE AUTH CONDITIONAL RENDERING --- */}
            <div className="flex flex-col gap-4 items-center w-full px-8">
              {currentUser ? (
                // Mobile Logged In
                <div className="flex flex-col items-center gap-4 bg-gray-50 p-6 rounded-xl w-full">
                   <div className="flex items-center gap-3">
                      <FaUserCircle className="text-3xl text-blue-600" />
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800 text-lg">
                          {currentUser.displayName || "Welcome"}
                        </span>
                        <span className="text-xs text-gray-500">{currentUser.email}</span>
                      </div>
                   </div>
                   
                   <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-500 font-semibold border border-red-200 px-6 py-2 rounded-lg hover:bg-red-50 w-full justify-center"
                   >
                     <FaSignOutAlt /> Logout
                   </button>
                </div>
              ) : (
                // Mobile Logged Out
                <>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="cursor-pointer hover:text-blue-600 transition-colors font-semibold">
                      Sign in
                    </button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                    <button className="cursor-pointer rounded-xl bg-blue-500 text-white hover:bg-blue-600 px-6 py-3 transition-all duration-300 w-full font-bold shadow-lg">
                      Create Account
                    </button>
                  </Link>
                </>
              )}

              <button className="cursor-pointer text-base text-gray-500 mt-2">PKR</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;