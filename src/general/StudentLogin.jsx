import React, { useState, useEffect } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
const StudentLogin = () => {
  const [userData, setUserData] = useState({ username: '', password: '' });
  const navigate = useNavigate();
  useEffect(() => {
    const role = localStorage.getItem('role');
    const user = (() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } })();
    const id = user?._id || user?.id || null;
    if (role === 'student' && id) navigate(`/student/page/${id}`, { replace: true });
    if (role === 'teacher' && id) navigate(`/teacher/page/${id}`, { replace: true });
  }, [navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://backend-six-pi-62.vercel.app/api/auth/student/login', userData, { withCredentials: true });
        toast.success(res.data?.message || JSON.stringify(res.data) || 'Login successful');
        // persist user info returned by backend for use across pages
        if (res.data?.userData) {
          localStorage.setItem('user', JSON.stringify(res.data.userData));
          localStorage.setItem('role', 'student');
        }
      navigate(`/student/page/${res.data.message}`, { user: res.data.userData });
      setUserData({ username: '', password: '' });
    } catch (err) {
      console.error('Student login error:', err);
      toast.error(err.response?.data?.error || err.response?.data?.message || err.message || 'Login failed');
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Student Login
          </h1>
          <p className="text-gray-600">Continue learning with your favorite teachers</p>
        </div>
        <form className="space-y-6" onSubmit={(e) => handleSubmit(e)}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              onChange={(e) => setUserData(prev => ({ ...prev, username: e.target.value }))}
              type="text" 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
              placeholder="your username" 
              required
              value={userData.username}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input 
              onChange={(e) => setUserData(prev => ({ ...prev, password: e.target.value }))}
              type="password" 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
              placeholder="••••••••" 
              required
              value={userData.password}
            />
          </div>
          <button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-200">
            Sign In
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            New student? 
            <Link to="/student/register" className="text-purple-600 font-semibold ml-1 hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
