import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [ErrorMessage, setErrorMessage] = useState()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [rememberMe, setRememberMe] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Login submitted:', formData);

        try {
            const response = await fetch(`http://localhost:9000/api/login`, {
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

            localStorage.setItem("Email", formData.email);

            const nameFetch = await fetch("http://localhost:9000/api/allusers", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!nameFetch.ok) {
                throw new Error("Failed to fetch user data");
            }

            const users = await nameFetch.json();
            // console.log(users)

            users.forEach((element) => {
                if (element["user"]["email"] === formData.email) {
                    localStorage.setItem("Fullname", element["user"]["Fullname"]);
                    localStorage.setItem("Username", element["user"]["Username"]);
                }
            });

            navigate("/chat");
        } catch (error) {
            setErrorMessage(error.message);
        }


    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center " style={{
            backgroundImage: "url(https://m.media-amazon.com/images/I/61gRT29sSSL.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
        }} >
            <div className='h-screen w-full bg-gradient-to-r from-gray-950 to-gray-800/60  flex justify-around items-center'>
                <div className="w-full h-fit max-w-md space-y-8 bg-gray-800 p-8 rounded-xl backdrop-blur-lg ">
                    {/* Logo and Header */}
                    <div className="flex items-center space-x-2 mb-8">
                        <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                        <span className="text-white text-xl">XENEFER</span>
                    </div>

                    {/* Main Content */}
                    <div className="space-y-6">
                        <div>
                            <p className="text-gray-400 text-sm">WELCOME BACK</p>
                            <h1 className="text-4xl font-bold text-white mt-2">
                                Login to your account<span className="text-blue-500">.</span>
                            </h1>
                            <p className="text-gray-400 mt-4">
                                New Here?{' '}
                                <a href="#" onClick={(e) => { e.preventDefault(); navigate("/signup") }} className="text-blue-500 hover:text-blue-400">
                                    Create an Account
                                </a>
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email Field */}
                            <div className="space-y-1">
                                <label htmlFor="email" className="text-sm text-gray-300">Email address</label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your email"
                                />
                            </div>

                            {/* Password Field */}
                            <div className="space-y-1">
                                <div className="flex justify-between">
                                    <label htmlFor="password" className="text-sm text-gray-300">Password</label>
                                    <a href="#" className="text-sm text-blue-500 hover:text-blue-400">Forgot password?</a>
                                </div>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 text-gray-400"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me Checkbox */}
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500 bg-gray-700"
                                />
                                <label htmlFor="remember" className="ml-2 text-sm text-gray-300">
                                    Remember me
                                </label>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mt-6"
                            >
                                Log in
                            </button>

                            {/* Social Login */}
                            <div className="mt-6">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-600"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
                                    >
                                        <span>Google</span>
                                    </button>
                                    <button
                                        type="button"
                                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
                                    >
                                        <span>GitHub</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                {/* <div className='text-white w-full max-w-md rounded-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center'
                    style={{
                        backgroundImage: "url(https://i.pinimg.com/736x/c9/01/d6/c901d66c7e1ddcc4293df9c03949decb.jpg)",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover"
                    }}>
                </div> */}
                <div className='flex items-center justify-center'>
                    
                    <div className='w-fit h-fit bg-black rounded-lg p-3'>

                        <div class="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center"
                            style={{
                                backgroundImage: "url(https://i.pinimg.com/736x/c9/01/d6/c901d66c7e1ddcc4293df9c03949decb.jpg)",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "cover"
                            }}>
                            Welcome!!
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Login;