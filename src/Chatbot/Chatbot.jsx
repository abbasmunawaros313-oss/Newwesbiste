import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiXMark, // Close icon
  HiPaperAirplane, // Send icon
} from "react-icons/hi2";
import { FaUserCircle } from "react-icons/fa";
// NEW ICON
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";

// --- IMPORT YOUR LOCAL JSON DATA ---
// Make sure the path is correct
import visaData from "../ostravels_visa_data.json";

// --- Bot Knowledge Base --

// Helper function to find a specific country
const findCountry = (query) => {
  const lowerQuery = query.toLowerCase();
  return visaData.find((country) =>
    country.country.toLowerCase().includes(lowerQuery)
  );
};

// Helper function to get countries by region
const getCountriesByRegion = (region) => {
  const regions = {
    // Add more keywords as needed
    asia: [
      "malaysia", "saudi arabia", "singapore", "turkey", "hong kong",
      "kazakhstan", "indonesia", "thailand", "azerbaijan", "china",
      "nepal", "egypt", "vietnam", "tajikistan", "kyrgyzstan",
      "uzbekistan", "philippine", "sri lanka"
    ],
    schengen: [
      "france", "spain", "belgium", "netherlands", "poland",
      "germany", "italy", "hungary", "greece", "czech republic",
      "switzerland", "portugal", "denmark", "sweden", "norway",
    ],
    other: ["united kingdom (uk)", "united states (usa)", "australia", "canada"],
  };

  if (!regions[region]) return [];

  return visaData.filter((country) =>
    regions[region].includes(country.country.toLowerCase())
  );
};

// This new function acts as the bot's "brain"
const getBotResponse = (userText) => {
  const text = userText.toLowerCase().trim();

  // 1. Check for specific keywords (price, time)
  if (text.includes("price") || text.includes("cost") || text.includes("time") || text.includes("how long")) {
    return {
      type: "text",
      content: "For the most up-to-date prices and processing times, please contact an agent directly. They can provide exact details for your specific travel dates.",
      replies: [
        { text: "Contact an Agent", value: "contact" },
        { text: "List All Visas", value: "all_visas" },
      ],
    };
  }

  // 2. Check for regions
  if (text.includes("asia")) {
    const countries = getCountriesByRegion("asia");
    return {
      type: "visaList",
      content: {
        title: "Asian Countries We Service",
        countries: countries,
      },
      replies: [
        { text: "List Schengen Visas", value: "schengen" },
        { text: "Contact Us", value: "contact" },
      ],
    };
  }

  if (text.includes("schengen") || text.includes("europe")) {
    const countries = getCountriesByRegion("schengen");
    return {
      type: "visaList",
      content: {
        title: "Schengen Countries We Service",
        countries: countries,
      },
      replies: [
        { text: "List Asian Visas", value: "asia" },
        { text: "Contact Us", value: "contact" },
      ],
    };
  }
  
  // 3. Check for specific countries
  const country = findCountry(text);
  if (country) {
    return {
      type: "visaInfo",
      content: country,
      replies: [
        { text: "Ask About Price/Time", value: "price" },
        { text: "List All Visas", value: "all_visas" },
      ],
    };
  }

  // 4. General keywords (as before)
  switch (text) {
    case "hello":
    case "hi":
    case "welcome":
      return {
        type: "text",
        content: "Hi there! I'm the O.S Travel bot. You can ask me about visa services for a specific country (e.g., 'Thailand') or a region (e.g., 'Schengen').",
        replies: [
          { text: "Visa Services", value: "all_visas" },
          { text: "Book a Flight", value: "flights" },
          { text: "Contact Us", value: "contact" },
        ],
      };
    case "all_visas":
    case "visa":
      return {
        type: "text",
        content: "We handle E-Visas and complex file processing. Which region are you interested in?",
        replies: [
          { text: "Asian Countries", value: "asia" },
          { text: "Schengen Countries", value: "schengen" },
          { text: "USA/UK/Canada", value: "other_countries" },
        ],
      };
    case "other_countries":
        const countries = getCountriesByRegion("other");
         return {
            type: "visaList",
            content: { title: "File Processing Services", countries: countries },
            replies: [
                { text: "Main Menu", value: "welcome" },
            ],
        };
    case "flights":
      return {
        type: "text",
        content: "We can help you find the best deals on flights worldwide. Please contact us directly for a booking.",
        replies: [
          { text: "See Contact Info", value: "contact" },
          { text: "Main Menu", value: "welcome" },
        ],
      };
    case "contact":
      return {
        type: "text",
        content: "You can reach us at 051-2120700 or email info@ostravels.com. Our team is ready to help!",
        replies: [
          { text: "Ask About Visas", value: "visa" },
          { text: "Main Menu", value: "welcome" },
        ],
      };
    default:
      return {
        type: "text",
        content: "Sorry, I'm not sure about that. Try asking for a specific country (e.g., 'France') or region (e.g., 'Asia').",
        replies: [
          { text: "Visa Services", value: "visa" },
          { text: "Contact Us", value: "contact" },
        ],
      };
  }
};

// --- Child Components for Beautiful Messages ---

// Component for a standard Bot text message
const BotMessage = ({ content }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex justify-start"
  >
    <div className="p-3 rounded-2xl max-w-[80%] bg-gray-200 text-gray-800 rounded-bl-none wrap-break-words">
      {content}
    </div>
  </motion.div>
);

// Component for a User's message
const UserMessage = ({ content }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex justify-end"
  >
    <div className="p-3 rounded-2xl max-w-[80%] bg-blue-600 text-white rounded-br-none wrap-break-words">
      {content}
    </div>
  </motion.div>
);

// NEW: Component for a "beautiful" Visa Card response
const BotVisaCard = ({ content }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex justify-start"
  >
    <div className="rounded-2xl max-w-[80%] bg-white shadow-md border border-gray-200 rounded-bl-none overflow-hidden">
      <div className="p-3">
        <h4 className="font-bold text-gray-900 mb-1">{content.country} Visa</h4>
        <p className="text-sm text-gray-600 mb-3">{content.snippet}</p>
        <a
          href={content.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-blue-600 hover:underline"
        >
          Learn More &rarr;
        </a>
      </div>
    </div>
  </motion.div>
);

// NEW: Component for a list of visas
const BotVisaList = ({ content }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex justify-start"
  >
    <div className="p-3 rounded-2xl max-w-[80%] bg-gray-200 text-gray-800 rounded-bl-none wrap-break-words">
      <h4 className="font-bold text-gray-900 mb-2">{content.title}</h4>
      <ul className="list-disc list-inside text-sm text-gray-700">
        {content.countries.map((c) => (
          <li key={c.country}>{c.country}</li>
        ))}
      </ul>
    </div>
  </motion.div>
);

// --- Main Chatbot Component ---
function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  // UPDATED: Message state now handles different types of content
  const [messages, setMessages] = useState([]); // { sender, type, content, replies }
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const chatEndRef = useRef(null);

  // Effect to load the welcome message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsTyping(true);
      setTimeout(() => {
        const welcomeMsg = getBotResponse("hello");
        setMessages([
          { sender: "bot", type: welcomeMsg.type, content: welcomeMsg.content },
        ]);
        setIsTyping(false);
      }, 1000);
    }
  }, [isOpen]); // Only runs when isOpen changes

  // Effect to auto-scroll to the bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // --- Handles sending a message (from input OR quick reply) ---
  const handleSendMessage = (text, value) => {
    const userText = text || value;
    if (!userText) return;

    // 1. Add user message
    setMessages((prev) => [
      ...prev,
      { sender: "user", type: "text", content: userText },
    ]);
    setIsTyping(true);
    setInputValue("");

    // 2. Get bot response
    const responseKey = value || text;
    const response = getBotResponse(responseKey);

    // 3. Add bot's response after a delay
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          type: response.type,
          content: response.content,
          replies: response.replies,
        },
      ]);
    }, 1200);
  };

  // Handles the form submission (pressing Enter or clicking Send)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() === "") return;
    handleSendMessage(inputValue, null);
  };

  // Get quick replies from the *last* bot message
  const lastMessage = messages[messages.length - 1];
  const quickReplies =
    lastMessage?.sender === "bot" && lastMessage.replies
      ? lastMessage.replies
      : [];

  // --- Animation Variants ---
  const windowVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    exit: {
      opacity: 0,
      y: 50,
      scale: 0.8,
      transition: { duration: 0.15 },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 260, damping: 20 },
    },
  };

  return (
    <>
      {/* 1. Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={windowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-24 right-6 w-[350px] h-[500px] bg-white rounded-xl shadow-2xl flex flex-col z-50 border border-gray-200"
          >
            {/* Header */}
            <header className="bg-blue-600 text-white p-4 flex justify-between items-center rounded-t-xl shadow-md">
              <div className="flex items-center gap-3">
                <FaUserCircle className="text-2xl" />
                <h3 className="font-bold text-lg">O.S Travel Bot</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-2xl hover:text-blue-100 transition-colors"
                aria-label="Close chat"
              >
                <HiXMark />
              </button>
            </header>

            {/* Message Area */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
              {messages.map((msg, index) => {
                // RENDER a different component based on message type
                if (msg.sender === "user") {
                  return <UserMessage key={index} content={msg.content} />;
                }
                switch (msg.type) {
                  case "text":
                    return <BotMessage key={index} content={msg.content} />;
                  case "visaInfo":
                    return <BotVisaCard key={index} content={msg.content} />;
                  case "visaList":
                    return <BotVisaList key={index} content={msg.content} />;
                  default:
                    return null;
                }
              })}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="p-3 rounded-2xl bg-gray-200 text-gray-800 rounded-bl-none">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
                    </div>
                  </div>
                </div>
              )}
              {/* This empty div is a ref to auto-scroll to */}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Replies Area */}
            {quickReplies.length > 0 && (
              <div className="p-3 border-t border-gray-200 bg-white">
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply) => (
                    <motion.button
                      key={reply.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSendMessage(reply.text, reply.value)}
                      className="bg-blue-100 text-blue-700 font-semibold py-1.5 px-4 rounded-full text-sm cursor-pointer hover:bg-blue-200"
                    >
                      {reply.text}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form */}
            <form
              onSubmit={handleSubmit}
              className="p-3 border-t border-gray-200 bg-white rounded-b-xl flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shrink-0 hover:bg-blue-700 transition-colors"
                aria-label="Send message"
              >
                <HiPaperAirplane className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Chat Toggle Button (NEW ICON) */}
      <motion.button
        variants={buttonVariants}
        initial="hidden"
        animate="visible"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center text-3xl z-40"
        aria-label="Open chat"
      >
        <IoChatbubbleEllipsesSharp />
      </motion.button>
    </>
  );
}

export default Chatbot;