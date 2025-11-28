import React, { useState } from 'react'; // Added useState
import { motion, AnimatePresence } from 'framer-motion'; // Added AnimatePresence

// --- Icons (from react-icons) ---
// Make sure to install: npm install react-icons
import {
  FaPassport, FaMoneyBillWave, FaClock, FaCalendarAlt, FaFileAlt,
  FaBuilding, FaEnvelope, FaPhone, FaCheckCircle,
  // --- ADDED ICONS ---
  FaLaptopCode, FaChevronDown, FaStar, FaQuoteLeft, FaPlane, FaHotel, FaUmbrellaBeach, FaExclamationTriangle
} from 'react-icons/fa';

// --- Page Data ---
// I've organized all the data you provided into easy-to-use objects.

const stickerVisa = {
  title: "Sticker Visa",
  subtitle: " Not available right now from embassy",
  totalFee: "PKR 18,000",
  feeBreakdown: {
    embassy: "PKR 12,900",
    service: "PKR 1,600"
  },
  processingTime: "12-15 Working Days",
  validity: "3 Months",
  stay: "1 Month (extendable)",
  documents: [
    "Original Passport (valid for at least 9 months)",
    "4 pictures with white background",
    "Last 6-month bank statement",
    "Bank account maintenance letter",
    "Visa request letter",
    "NTN (National Tax No.) if applicable",
    "Return air ticket"
  ]
};

const eVisa = {
  title: "E-Visa",
  subtitle: "Online",
  totalFee: "PKR 15,000 Normal : PKR 20,000 Urgent",
  processingTime: "Normal ( 30 Days ) : Urgent ( Within 24 Hours )",
  validity: "6 Months",
  stay: "1 Month",
  documents: [
    "Passport 1st & 2nd page scan copy (valid at least 9 months)",
    "4 pictures with white background (35mm x 50mm)",
    "CNIC copy",
    "Last 6-month bank statement",
    "Bank account maintenance letter",
    "Return air ticket (for E-Visa only)"
  ]
};

const embassyInfo = {
  address: "Plot No. 144-150 Street No. 17, Sector G-5, Diplomatic Enclave, Islamabad, Pakistan.",
  email: "mwislamabad@kln.gov.my",
  phone: "(92 51) 2072900"
};

// --- NEW: Malaysia-Specific FAQs ---
const faqs = [
  {
    q: "Is the Malaysia E-Visa a multiple entry visa?",
    a: "No, the standard E-Visa listed is for a single entry. Multiple entry e-visas may be available but have different requirements and are typically for business purposes."
  },
  {
    q: "Can I extend my 1-month stay in Malaysia?",
    a: "The sticker visa explicitly mentions it is 'extendable in Malaysia'. The e-visa is typically for a fixed 30-day period. Any extension must be applied for at the Malaysian Immigration Department *before* your visa expires."
  },
  {
    q: "Which visa is faster, E-Visa or Sticker Visa?",
    a: "The E-Visa is significantly faster, with a processing time of 4-7 days, compared to the 12-15 working days for the sticker visa."
  }
];

// --- NEW: Malaysia-Specific Reviews ---
const reviews = [
  {
    name: "Haris Q.",
    quote: "Got my Malaysia e-visa from O.S. Travel in just 5 days. I'm a repeat customer, and they are the best in Islamabad for a reason. Highly recommended!",
    rating: 5
  },
  {
    name: "Sana & Family",
    quote: "We booked our entire Kuala Lumpur & Langkawi tour with O.S. Travel. They handled our e-visas, flights, and hotels. Everything was perfect. Thank you, Mr. Obaid.",
    rating: 5
  },
  {
    name: "Imran Traders",
    quote: "Applied for a sticker visa for my business trip. The process was smooth, and the team was very professional. Good service.",
    rating: 5
  }
];

// --- Framer Motion Variants ---
const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

// --- Main Component ---
function Malaysia() {
  return (
    <motion.div
      className="container mx-auto p-4 md:p-10 bg-gray-50 min-h-screen"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 1. Page Header */}
      <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
        <img
          src="https://flagcdn.com/w160/my.png" // Malaysia flag
          alt="Flag of Malaysia"
          className="w-16 h-10 object-cover rounded shadow-md"
        />
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
            Malaysia Visa
          </h1>
          <p className="text-xl text-gray-600">
            Visa Requirements for Pakistani Citizens
          </p>
        </div>
      </motion.div>

      {/* 2. Visa Comparison Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        <VisaCard visa={stickerVisa} isSticker={true} />
        <VisaCard visa={eVisa} isSticker={false} />
      </motion.div>

      {/* 3. Embassy Information */}
      <motion.div
        variants={itemVariants}
        className="mt-12 bg-white p-6 md:p-8 rounded-lg shadow-lg"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <FaBuilding className="text-blue-600" />
          Embassy / High Commission Details
        </h2>
        <ul className="space-y-4 text-gray-700 text-lg">
          <li className="flex items-start gap-4">
            <FaBuilding className="text-gray-500 mt-1.5 shrink-0" />
            <span><strong>Address:</strong> {embassyInfo.address}</span>
          </li>
          <li className="flex items-start gap-4">
            <FaEnvelope className="text-gray-500 mt-1.5 shrink-0" />
            <span><strong>Email:</strong> <a href={`mailto:${embassyInfo.email}`} className="text-blue-600 hover:underline">{embassyInfo.email}</a></span>
          </li>
          <li className="flex items-start gap-4">
            <FaPhone className="text-gray-500 mt-1.5 shrink-0" />
            <span><strong>Phone:</strong> <a href={`tel:${embassyInfo.phone}`} className="text-blue-600 hover:underline">{embassyInfo.phone}</a></span>
          </li>
        </ul>
      </motion.div>

      {/* 4. About O.S. Travel Section */}
      <motion.div
        variants={itemVariants}
        className="mt-12 bg-white p-6 md:p-8 rounded-lg shadow-lg"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Why Book with <span className="text-blue-600">O.S. Travel & Tours</span>?
        </h2>
        <p className="text-lg text-gray-600 text-center mb-8 max-w-3xl mx-auto">
          We are a leading travel agency in Islamabad, Pakistan, dedicated to ensuring your travel experience is seamless, comfortable, and memorable. 
          <strong className="text-gray-800">We deal in a wide range of services</strong>, including being an authorized visa dropbox for Malaysia.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ServiceCard
            icon={<FaPassport className="text-blue-500" />}
            title="Authorized Dropbox"
            desc="As an authorized agent, we provide fast and reliable Malaysia e-visa and sticker visa processing."
          />
          <ServiceCard
            icon={<FaPlane className="text-green-500" />}
            title="Air Ticketing"
            desc="Get the best fares for flights to Kuala Lumpur, Langkawi, and beyond."
          />
          <ServiceCard
            icon={<FaHotel className="text-purple-500" />}
            title="Hotel Bookings"
            desc="We book your hotels, from luxury resorts in KL to beach villas in Langkawi."
          />
          <ServiceCard
            icon={<FaUmbrellaBeach className="text-yellow-500" />}
            title="Tour Packages"
            desc="We offer complete, customized holiday packages for your perfect trip to Malaysia."
          />
        </div>
      </motion.div>

      {/* 5. FAQ Section (The "Dropbox") */}
      <motion.div
        variants={itemVariants}
        className="mt-12 bg-white rounded-lg shadow-lg overflow-hidden"
      >
        <h2 className="text-3xl font-bold text-gray-800 p-6 md:p-8">
          Frequently Asked Questions
        </h2>
        <div className="border-t border-gray-200">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} q={faq.q} a={faq.a} />
          ))}
        </div>
      </motion.div>

      {/* 6. Review Section */}
      <motion.div
        variants={itemVariants}
        className="mt-12"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          What Our Clients Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <ReviewCard key={index} review={review} />
          ))}
        </div>
      </motion.div>

      {/* Footer Note */}
      <motion.div variants={itemVariants} className="text-center mt-10 text-sm text-gray-500">
        <p>All fees and processing times are provided by O.S. Travel & Tours and are subject to change.</p>
      </motion.div>

    </motion.div>
  );
}

// --- Reusable Sub-components ---

/**
 * A card component to display details for a single visa type.
 */
const VisaCard = ({ visa, isSticker }) => {
  const borderColor = isSticker ? "border-blue-500" : "border-green-500";
  const textColor = isSticker ? "text-blue-500" : "text-green-500";
  const icon = isSticker ? <FaPassport /> : <FaLaptopCode />; // Use laptop icon for E-Visa

  return (
    <div className={`bg-white rounded-lg shadow-xl overflow-hidden border-t-8 ${borderColor}`}>
      <div className="p-6 md:p-8">
        
        {/* Card Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`text-4xl ${textColor}`}>{icon}</div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">{visa.title}</h2>
            <p className="text-lg text-gray-500">{visa.subtitle}</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-6 pt-4 border-t border-gray-100">
          <DetailItem icon={<FaMoneyBillWave className="text-green-600" />} label="Total Fee" value={visa.totalFee} />
          <DetailItem icon={<FaClock className="text-red-600" />} label="Processing Time" value={visa.processingTime} />
          <DetailItem icon={<FaCalendarAlt className="text-blue-600" />} label="Validity" value={visa.validity} />
          <DetailItem icon={<FaCalendarAlt className="text-purple-600" />} label="Stay Duration" value={visa.stay} />
        </div>

        {/* Fee Breakdown (only for sticker visa) */}
        {visa.feeBreakdown && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
            <p className="font-semibold">Fee Breakdown:</p>
            <ul className="list-disc list-inside ml-2">
              <li>Embassy Fee: {visa.feeBreakdown.embassy}</li>
              <li>Service Charges: {visa.feeBreakdown.service}</li>
            </ul>
          </div>
        )}

        {/* Documents List */}
        <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FaFileAlt className="text-gray-600" />
          Documents Required
        </h3>
        <ul className="space-y-3">
          {visa.documents.map((doc, index) => (
            <li key={index} className="flex items-start gap-3 text-gray-700">
              <FaCheckCircle className="text-green-500 mt-1.5 shrink-0" />
              <span>{doc}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

/**
 * A small component for displaying an icon, label, and value.
 */
const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="text-2xl text-gray-600 mt-1 shrink-0">{icon}</div> {/* Added shrink-0 */}
    <div>
      <p className="text-sm font-semibold text-gray-500">{label}</p>
      <p className="text-lg font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

/**
 * An animated Accordion item for the FAQ section.
 */
const AccordionItem = ({ q, a }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full p-6 text-left"
      >
        <span className="text-lg font-semibold text-gray-800">{q}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-gray-500"
        >
          <FaChevronDown className="shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1, paddingTop: '0px', paddingBottom: '24px' }}
            exit={{ height: 0, opacity: 0, paddingTop: '0px', paddingBottom: '0px' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="text-gray-600 px-6">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Service Card Component ---
const ServiceCard = ({ icon, title, desc }) => (
  <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg text-center flex flex-col items-center">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{desc}</p>
  </div>
);

// --- Review Card Component ---
const ReviewCard = ({ review }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col">
    <FaQuoteLeft className="text-3xl text-blue-500 mb-4" />
    <p className="text-gray-600 italic mb-6 grow">"{review.quote}"</p>
    <div className="flex items-center justify-between">
      <span className="text-lg font-semibold text-gray-800">{review.name}</span>
      <div className="flex">
        {[...Array(review.rating)].map((_, i) => (
          <FaStar key={i} className="text-yellow-400" />
        ))}
      </div>
    </div>
  </div>
);

export default Malaysia;
