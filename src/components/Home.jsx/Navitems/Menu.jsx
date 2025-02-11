import React from "react";
import { motion } from "framer-motion";

export default function Menu({ isVisible, onClose }) {
  // Animation variants for Framer Motion
  const menuVariants = {
    hidden: { x: "100%" },
    visible: { x: 0 },
  };

  return (
    <motion.div
      className={`fixed top-0 right-0 h-full w-64 bg-gray-700 text-white flex flex-col items-center p-4 shadow-lg`}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={menuVariants}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="self-end text-2xl font-bold text-white mb-4"
      >
        ✕
      </button>
      <a
        href="#"
        className="text-lg p-2 hover:bg-gray-600 w-full text-center"
      >
        Home
      </a>
      <a
        href="#"
        className="text-lg p-2 hover:bg-gray-600 w-full text-center"
      >
        About
      </a>
      <a
        href="#"
        className="text-lg p-2 hover:bg-gray-600 w-full text-center"
      >
        Services
      </a>
      <a
        href="#"
        className="text-lg p-2 hover:bg-gray-600 w-full text-center"
      >
        Contact
      </a>
    </motion.div>
  );
}
