import { useState, useEffect } from "react";
// UPDATED: Added NavLink for active state and useLocation for dropdown active state
import { Link, NavLink, useLocation } from "react-router-dom";
import logo from "../assets/logoimg/image.png";

// UPDATED: Added framer-motion imports
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";

// --- Config for Navigation Links ---
const navItems = [
  { name: "Home", to: "/" },
  { name: "About Us", to: "/about" },
  { name: "Visa", to: "/visas", dropdownType: "visa" },
  { name: "File Process", to: "/fileprocessing", dropdownType: "fileProcess" },
  { name: "Contact", to: "/contact" },
  { name: "Haj and Ummrah", to: "/haj" },
 
];


// --- 1. Simple Nav Link Component (for desktop) ---
// UPDATED: Now uses NavLink to automatically handle active class
const SimpleNavLink = ({ item }) => (
  <NavLink
    to={item.to}
    // This applies 'text-blue-600' if the link is active
    className={({ isActive }) =>
      `relative group py-2 ${isActive ? "text-blue-600" : ""}`
    }
  >
    <span>{item.name}</span>
    <span
      className={`absolute left-0 bottom-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full ${
        // Also show underline if active
        // UPDATED: Corrected className logic for NavLink
        ({ isActive }) => (isActive ? "w-full" : "w-0")
      }`}
    ></span>
  </NavLink>
);

// --- 2. Visa Dropdown Component (for desktop) ---
// THIS IS THE UPDATED COMPONENT
const VisaDropdown = () => {
  // UPDATED: Added "Africa" to state
  const [activeCategory, setActiveCategory] = useState("Asia");
  const [countries, setCountries] = useState({ Asia: [], Europe: [], Africa: [] });
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const isActive = location.pathname.startsWith("/visa");

  useEffect(() => {
    // --- UPDATED: Using your curated lists ---
    // Using Sets for fast lookup. Typos have been corrected.
    const curatedEuropeNames = new Set([
      "Austria", "Belgium", "Bulgaria", "CzechRepublic", "Denmark", "Estonia",
      "Finland", "France", "Germany", "Greece", "Hungary", "Ireland", "Italy",
      "Lithuania", "Netherlands", "Norway", "Poland", "Portugal", "Romania",
      "Spain", "Switzerland", "United Kingdom" // UK is part of Europe fetch
    ]);

    const curatedAsiaNames = new Set([
      "Azerbaijan", "Bahrain", "China", "Cambodia", "Egypt", // Egypt is in your Asia & Africa list
      "Indonesia", "Japan", "Kazakhstan", "Malaysia", "Maldives", "Nepal",
      "Pakistan", "Philippines", "Qatar", "South Korea", "Sri Lanka",
      "Tajikistan", "Thailand", "Turkey", "Vietnam", "Saudi Arabia", "Singapore" ,"Morocco" // Corrected from "Sudia Arabia"
    ]);

    const curatedAfricaNames = new Set([
      "Egypt", "Ethiopia", "Kenya", "South Africa", "Zambia", "Uganda", "Sudan"
      // Note: Your list had "Sudia Arabia", I mapped it to "Saudi Arabia" in the Asia list.
      // If "Sudia Arabia" was meant to be "Sudan", I've added "Sudan" here.
    ]);
    // --- End of Update ---

    const fetchCountries = async () => {
      setIsLoading(true);
      try {
        // UPDATED: Added fetch for Africa
        const [asiaRes, europeRes, africaRes] = await Promise.all([
          fetch("https://restcountries.com/v3.1/region/asia?fields=name,flags,cca3"),
          fetch("https://restcountries.com/v3.1/region/europe?fields=name,flags,cca3"),
          fetch("https://restcountries.com/v3.1/region/africa?fields=name,flags,cca3"),
        ]);

        const asiaData = await asiaRes.json();
        const europeData = await europeRes.json();
        const africaData = await africaRes.json(); // Get Africa data
        const sortByName = (a, b) => a.name.common.localeCompare(b.name.common);

        // --- UPDATED: Filtering based on your curated lists ---
        const filteredAsia = asiaData.filter((c) => curatedAsiaNames.has(c.name.common));
        const filteredEurope = europeData.filter((c) => curatedEuropeNames.has(c.name.common));
        const filteredAfrica = africaData.filter((c) => curatedAfricaNames.has(c.name.common));
        // --- End of Update ---

        // UPDATED: Add Africa to state
        setCountries({
          Asia: filteredAsia.sort(sortByName),
          Europe: filteredEurope.sort(sortByName),
          Africa: filteredAfrica.sort(sortByName),
        });
      } catch (error) {
        console.error("Failed to fetch country data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCountries();
  }, []);

  // UPDATED: Helper variable to get the correct list
  const currentList =
    activeCategory === "Asia"
      ? countries.Asia
      : activeCategory === "Europe"
      ? countries.Europe
      : countries.Africa;

  return (
    <div className="relative group">
      <div className={`relative group py-2 cursor-pointer ${isActive ? "text-blue-600" : ""}`}>
        <span>Visa</span>
        <span
          className={`absolute left-0 bottom-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full ${
            isActive ? "w-full" : "w-0"
          }`}
        ></span>
      </div>

      <div
        className="absolute top-full left-1/2 -translate-x-1/2 mt-0 pt-2
                       hidden group-hover:flex bg-white shadow-2xl rounded-lg
                       overflow-hidden z-50 w-[500px] border border-gray-200"
      >
        <div className="w-1/3 bg-gray-50 border-r border-gray-200">
          <div
            onMouseEnter={() => setActiveCategory("Asia")}
            className={`p-4 font-semibold cursor-pointer ${
              activeCategory === "Asia" ? "bg-white text-blue-600" : "hover:bg-gray-100"
            }`}
          >
            Asia
          </div>
          <div
            onMouseEnter={() => setActiveCategory("Europe")}
            className={`p-4 font-semibold cursor-pointer ${
              activeCategory === "Europe" ? "bg-white text-blue-600" : "hover:bg-gray-100"
            }`}
          >
            Europe
          </div>
          {/* --- UPDATED: Added Africa Tab --- */}
          <div
            onMouseEnter={() => setActiveCategory("Africa")}
            className={`p-4 font-semibold cursor-pointer ${
              activeCategory === "Africa" ? "bg-white text-blue-600" : "hover:bg-gray-100"
            }`}
          >
            Africa
          </div>
          {/* --- End of Update --- */}
        </div>

        <div className="w-2/3 h-80 overflow-y-auto p-2">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">Loading...</div>
          ) : (
            // UPDATED: Use the currentList variable
            currentList.map((country) => (
              <Link
                key={country.cca3}
                to={`/Countries/${country.name.common.toLowerCase()}`}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100"
              >
                <img
                  src={country.flags.png}
                  alt={`${country.name.common} flag`}
                  className="w-6 h-4 object-cover rounded-sm border border-gray-300"
                />
                <span className="text-sm font-medium">{country.name.common}</span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
// --- END OF UPDATED COMPONENT ---


// --- 3. File Process Dropdown Component ---
const FileProcessDropdown = () => {
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // UPDATED: useLocation to check if the current path starts with /process
  const location = useLocation();
  const isActive = location.pathname.startsWith("/fileprocessing"); // Corrected path

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
      {/* UPDATED: Applies active class to the "File Process" trigger */}
      <div className={`relative group py-2 cursor-pointer ${isActive ? "text-blue-600" : ""}`}>
        <span>File Process</span>
        <span
          className={`absolute left-0 bottom-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full ${
            isActive ? "w-full" : "w-0"
          }`}
        ></span>
      </div>

      {/* Dropdown menu */}
      <div
        className="absolute top-full left-1/2 -translate-x-1/2 mt-0 pt-2
                       hidden group-hover:block bg-white shadow-2xl rounded-lg
                       overflow-hidden z-50 w-64 border border-gray-200"
      >
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
                <img
                  src={country.flags.png}
                  alt={`${country.name.common} flag`}
                  className="w-6 h-4 object-cover rounded-sm border border-gray-300"
                />
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

  // --- Framer Motion Animation Variants ---
  const mobileMenuVariants = {
    hidden: {
      x: "100%", // Start off-screen to the right
      transition: {
        type: "tween",
        duration: 0.3,
      },
    },
    visible: {
      x: 0, // Animate to on-screen
      transition: {
        type: "tween",
        duration: 0.3,
      },
    },
  };

  return (
    <>
      <nav className="flex justify-center bg-white shadow w-full font-bold items-center h-20 px-6 relative z-30">
        {/* --- DESKTOP NAV --- */}
        <div className="hidden md:flex justify-between w-full max-w-7xl items-center">
          <div className="flex gap-12 items-center">
            <Link to="/">
              <img src={logo} alt="OS Logo Image" className="w-[120px] h-[50px] object-contain" />
            </Link>
            <div className="flex gap-8 items-center cursor-pointer">
              {navItems.map((item) => {
                if (item.dropdownType === "visa") {
                  return <VisaDropdown key={item.name} />;
                }
                if (item.dropdownType === "fileProcess") {
                  return <FileProcessDropdown key={item.name} />;
                }
                return <SimpleNavLink key={item.name} item={item} />;
              })}
            </div>
          </div>
          <div className="flex gap-6 items-center">
            <button className="cursor-pointer hover:text-blue-600 transition-colors">PKR</button>
         <Link to="/login">   <button className="cursor-pointer hover:text-blue-600 transition-colors">Sign in</button></Link>
        <Link to="/signup">     <button className="cursor-pointer border-blue-900 rounded-xl bg-blue-500 text-white hover:bg-blue-600 px-5 py-2 transition-all duration-300 transform hover:scale-105"> 
              Create Account
            </button> </Link>
          </div>
        </div>

        {/* --- MOBILE NAV --- */}
        <div className="flex md:hidden justify-between items-center w-full">
          <div className="w-8"></div>
          <div className="flex-1 flex justify-center">
            <Link to="/">
              <img src={logo} alt="OS Logo Image" className="w-[100px] h-10 object-contain" />
            </Link>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-3xl z-50"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <HiOutlineX /> : <HiOutlineMenu />}
          </button>
        </div>
      </nav>

      {/* --- MOBILE MENU OVERLAY (with Framer Motion) --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 md:hidden bg-white z-20
                       flex flex-col items-center justify-center gap-8 text-2xl "
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
                onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
                // UPDATED: Apply active class
                className={({ isActive }) =>
                  isActive ? "text-blue-600" : "hover:text-blue-600"
                }
              >
                {item.name}
              </NavLink>
            ))}

            {/* Mobile Buttons */}
            <hr className="w-3/4 border-gray-200" />
            <div className="flex flex-col gap-6 items-center w-full px-8">
             <Link to="/login"><button className="cursor-pointer hover:text-blue-600 transition-colors">Sign in</button></Link>
            <Link to="/signup">  <button className="cursor-pointer rounded-xl bg-blue-500 text-white hover:bg-blue-600 px-6 py-3 transition-all duration-300 w-full">
                Create Account
              </button></Link>
              <button className="cursor-pointer text-lg">PKR</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
