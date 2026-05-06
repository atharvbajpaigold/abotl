import React, { useState, useEffect } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
const TeacherLogin = () => {
  const [userData, setUserData] = useState({ email: '', password: '' });
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
      const res = await axios.post('https://backend-six-pi-62.vercel.app/api/auth/teacher/login', userData, { withCredentials: true });
      // persist returned user data if provided
      if (res.data?.userData) {
        localStorage.setItem('user', JSON.stringify(res.data.userData));
        localStorage.setItem('role', 'teacher');
      }
      toast.success(res.data?.message || JSON.stringify(res.data) || 'Login successful');
      navigate(`/teacher/page/${res.data.message}`);
      setUserData({ email: '', password: '' });
    } catch (err) {
      console.error('Teacher login error:', err);
      toast.error(err.response?.data?.error || err.response?.data?.message || err.message || 'Login failed');
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Teacher Login
          </h1>
          <p className="text-gray-600">Welcome back! Access your teaching dashboard</p>
        </div>
        <form className="space-y-6" onSubmit={(e)=>handleSubmit(e)}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input 
              onChange={(e)=>setUserData({...userData,email:e.target.value})}
              type="email" 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent" 
              placeholder="your@email.com" 
              required
              value={userData.email}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent" 
              placeholder="••••••••" 
              required
              onChange={(e)=>setUserData({...userData,password:e.target.value})}
              value={userData.password}
            />
          </div>
          <button type='submit' className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200">
            Sign In
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account? 
            <Link to="/teacher/register" className="text-emerald-600 font-semibold ml-1 hover:underline">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeacherLogin;
