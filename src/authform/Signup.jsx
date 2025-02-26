import React, { useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast , ToastContainer} from 'react-toastify';

function Signup() {
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [message, setMessage] = useState('');
  const [role, setRole] = useState('user'); // Default role is 'user'

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    setMessage('');

    const payload = {
      name,
      email,
      password,
      role, 
    };

    try {
      const response = await axios.post('https://quizand-form-backend.vercel.app/api/signup', payload);
      setMessage(response.data.success ? `Success: ${response.data.message}` : `Error: ${response.data.message}`);
      toast.success("You're Signup Successfully")
      setTimeout(() => {
        navigate('/');
      }, 1000);
    
    } catch (error) {
      toast.error('You Can"t Signup Now');
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-500">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-2xl rounded-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800">Sign Up</h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Name</label>
            <input
              ref={nameRef}
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
            <input
              ref={emailRef}
              type="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
            <input
              ref={passwordRef}
              type="password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-200 transform hover:scale-105 mt-4"
            >
              Sign Up
       </button>
          </div>
          <button onClick={() => navigate('/')} className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-200 transform hover:scale-105 mt-4">
            Login
          </button>
          {message && (
            <div className={`mt-4 text-center ${message.startsWith('Success') ? 'text-green-500' : 'text-red-500'}`}>
              {message}
            </div>
          )}
        </form>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Signup;
