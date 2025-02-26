import React, { useState } from 'react';

const AskLock = ({setActivationIcon,ActivationIcon}) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  
  // You can change this password to whatever you need
  const correctPassword = 'secret123';
  const maxAttempts = 3;
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password === correctPassword) {
      setIsAuthenticated(true);
      setError('');
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= maxAttempts) {
        setError(`Too many failed attempts (${newAttempts}/${maxAttempts}). Please try again later.`);
      } else {
        setError(`Incorrect password. ${maxAttempts - newAttempts} attempts remaining.`);
      }
      
      setPassword('');
    }
    const pass=await fetch("http://localhost:9000/api/login",{
        method:"POST",
        headers:{
            "Content-Type": "application/json",
        },
        body:JSON.stringify({email:localStorage.getItem("Email"),password:password})
    })
    const data=await pass.json()
    // console.log(data.message)
    if(data.message!=="Invalid Password"){
        setActivationIcon("locked")
        setIsAuthenticated(true)
    }
  };
  
  if (isAuthenticated) {
    return (
      <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Access Granted</h2>
          <p className="mb-4">Welcome to the protected area!</p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            onClick={() => setIsAuthenticated(false)}
          >
            Logout
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center">Protected Area</h2>
      <p className="mb-4 text-center text-gray-600">Please enter the password to continue</p>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter password"
            disabled={attempts >= maxAttempts}
            required
          />
        </div>
        
        {error && !isAuthenticated && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          disabled={attempts >= maxAttempts}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AskLock;