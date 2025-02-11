import React, { useState } from "react";
import Menu from "./Menu";
import { motion } from "framer-motion";

export default function Navbar() {
    const [showOptions, setShowOptions] = useState(false);

    const toggleMenu = () => {
        setShowOptions((prev) => !prev);
    };

    return (
        <div>
            <nav className="text-white">
                <header
                    className="bg-[#141218] site-navbar flex justify-between pr-16 pl-16 p-5"
                    role="banner"
                >
                    {/* Left Section */}
                    <div className="container1 text-xl flex gap-5 items-center max-md:hidden">
                        <h1 className="hover:cursor-pointer hover:text-blue-500">spend</h1>
                        <h1 className="hover:cursor-pointer hover:text-blue-500">save</h1>
                        <h1 className="hover:cursor-pointer hover:text-blue-500">invest</h1>
                        <h1 className="hover:cursor-pointer hover:text-blue-500">
                            advance
                        </h1>
                    </div>

                    {/* Logo Section */}
                    <div className="container2 text-3xl font-bold flex gap-5 items-center">
                        XENEFER
                    </div>

                    {/* Right Section */}
                    <div className="container3 text-xl flex gap-5 items-center">
                        <h1 className="hover:cursor-pointer hover:text-blue-500 max-md:hidden">
                            About
                        </h1>
                        <h1 className="hover:cursor-pointer hover:text-blue-500 max-md:hidden">
                            Help
                        </h1>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <button className="bg-white font-semibold text-black rounded-full p-2 flex items-center max-md:hidden">
                                <h1>sign up</h1>
                            </button>
                        </motion.button>
                    </div>

                    {/* Hamburger Menu Button */}
                    <button
                        className="text-white text-4xl block md:hidden fixed top-0 right-0 p-4"
                        onClick={toggleMenu}
                    >
                        ☰
                    </button>
                </header>
            </nav>
            <Menu isVisible={showOptions} onClose={() => setShowOptions(false)} />
        </div>
    );
}
