


import React, { useState } from 'react';
import { Eye, EyeOff, Copy } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const MainCompo = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Fullname: '',
    Username: '',
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Form submitted:", formData);

    try {
      const response = await fetch(`http://localhost:9000/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to register");
      }

      const result = await response.json();
      console.log(result);

      if (result.message === "Username already taken" || result.message === "User already exists") {
        throw new Error(result.message);
        setErrorMessage(result.message)
      } else {
        localStorage.setItem("Email", formData.email);

        const nameFetch = await fetch("http://localhost:9000/api/allusers", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const users = await nameFetch.json();
        // console.log(users)

        users.forEach((element) => {
          if (element["user"]["email"] === formData.email) {
            localStorage.setItem("Fullname", element["user"]["Fullname"]);
            localStorage.setItem("Username", element["user"]["Username"]);
          }
        });

        navigate("/chat");
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center" style={{
      backgroundImage: "url(https://m.media-amazon.com/images/I/61gRT29sSSL.jpg)",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }} >
      <div className='h-screen w-full bg-gradient-to-r from-gray-950 to-gray-800/60  flex justify-around items-center '>

        <div className="w-full max-w-md space-y-8 h-fit bg-gray-800 p-8 rounded-xl">
          {/* Logo and Header */}
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
            <span className="text-white text-xl">XENEFER</span>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-white mt-2">
                Create new account<span className="text-blue-500">.</span>
              </h1>
              <p className="text-gray-400 mt-4">
                Already A Member?{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigate("/login"); }} className="text-blue-500 hover:text-blue-400">
                  Login
                </a>

              </p>
            </div>
            <div className='text-red-500 flex justify-center'>
              {ErrorMessage}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Fields */}
              <div className="gap-4">
                <div className="relative">
                  <input
                    type="text"
                    name="Fullname"
                    value={formData.Fullname}
                    onChange={handleInputChange}
                    placeholder="Full name"
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Copy className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
                </div>
              </div>

              <div className=" gap-4">
                <div className="relative">
                  <input
                    type="text"
                    name="Username"
                    value={formData.Username}
                    onChange={handleInputChange}
                    placeholder="User name"
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Copy className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
                </div>
              </div>

              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Copy className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="flex space-x-4 mt-8">
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex-1"
                >
                  Create account
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainCompo;