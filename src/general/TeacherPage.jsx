import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

const TeacherPage = () => {
  const location = useLocation();
  const user = location.state?.user || JSON.parse(localStorage.getItem('user')) || {};
  const navigate = useNavigate();
  
  const isAuthenticated = () => !!localStorage.getItem('role');
  
  const handleProtectedNav = (e, path, roleNeeded, featureName = 'this feature') => {
    if (!isAuthenticated()) {
      e.preventDefault();
      toast.info(`You must sign in to access "${featureName}". Please sign in or sign up to continue.`);
      return;
    }
    if (roleNeeded) {
      const role = localStorage.getItem('role');
      if (role !== roleNeeded) {
        e.preventDefault();
        toast.info(`You must sign in as a ${roleNeeded} to access "${featureName}". Please sign up or switch accounts.`);
        return;
      }
    }
  }

  const handleLogout = async () => {
    if (!window.confirm('Are you sure you want to logout?')) return;
    
    try {
      await axios.post('https://backend-six-pi-62.vercel.app/api/auth/teacher/logout', {}, { withCredentials: true });
    } catch (err) {
      console.warn('Logout request failed', err);
    }
    
    try { 
      Cookies.remove('token', { path: '/', sameSite: 'lax' }); 
    } catch (e) { /* ignore */ }
    
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    
    toast.success('Logged out successfully!');
    navigate('/', { replace: true });
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100">
      {/* Navigation Buttons - Fixed at Top */}
      <div className="fixed top-4 left-4 right-4 sm:right-6 z-50 flex items-center justify-between gap-4">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-2xl text-xs sm:text-sm shadow-xl hover:from-emerald-600 hover:to-teal-600 hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 transition-all duration-200 group"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="hidden sm:inline">Home</span>
        </button>
        <button 
          onClick={handleLogout}
          className="group relative px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-2xl text-xs sm:text-sm shadow-xl hover:from-red-600 hover:to-red-700 hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 transition-all duration-200 overflow-hidden transform z-10"
          title="Logout"
        >
          <span className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </span>
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </button>
      </div>

      {/* Hero Section with Large Profile Image */}
      <div className="relative pt-24 pb-16">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-teal-600/10"></div>
        
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            {/* Large Profile Image */}
            <div className="flex-shrink-0">
              <div className="relative group">
                <img 
                  className="w-32 h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 rounded-3xl ring-8 ring-emerald-200/50 shadow-2xl object-cover hover:scale-105 hover:ring-emerald-300/70 transition-all duration-500 cursor-pointer"
                  src={user?.imageURL || '/default-avatar.png'} 
                  alt="Profile" 
                />
                <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/30 via-teal-500/30 to-green-500/30 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-3xl animate-pulse opacity-70"></div>
              </div>
            </div>

            {/* Welcome Text */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent mb-4 leading-tight">
                Welcome back, {user.username || user?.email || 'Teacher'}!
              </h1>
              <p className="text-xl text-gray-700 font-medium">Your teaching dashboard</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - 4 Cards Grid (Original Layout) */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Upload Videos Button */}
          <Link to="/video" className="group" onClick={(e) => handleProtectedNav(e, '/video', 'teacher', 'Upload Videos')}>
            <div className="bg-white rounded-3xl p-10 shadow-2xl hover:shadow-3xl hover:-translate-y-3 transition-all duration-300 text-center h-full flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Upload Videos</h3>
              <p className="text-gray-600 mb-6">Share your teaching content with students</p>
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-3 rounded-2xl font-semibold hover:from-teal-600 hover:to-green-600 transition-all shadow-lg">
                Upload Now
              </div>
            </div>
          </Link>

          {/* Explore Videos Button */}
          <Link to="/explore" className="group" onClick={(e) => handleProtectedNav(e, '/explore', null, 'Explore Videos')}>
            <div className="bg-white rounded-3xl p-10 shadow-2xl hover:shadow-3xl hover:-translate-y-3 transition-all duration-300 text-center h-full flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-gradient-to-r from-teal-500 to-green-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m6 0h6m-6 0v6m0-6V6a2 2 0 116 0v6a2 2 0 01-2 2h-1" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Explore Videos</h3>
              <p className="text-gray-600 mb-6">Browse student content & analytics</p>
              <div className="bg-gradient-to-r from-teal-500 to-green-500 text-white px-8 py-3 rounded-2xl font-semibold hover:from-teal-600 hover:to-green-600 transition-all shadow-lg">
                View Videos
              </div>
            </div>
          </Link>

          {/* Live Chat Button */}
          <Link to="/chat" className="group" onClick={(e) => handleProtectedNav(e, '/chat', 'teacher', 'Start Video Chat')}>
            <div className="bg-white rounded-3xl p-10 shadow-2xl hover:shadow-3xl hover:-translate-y-3 transition-all duration-300 text-center h-full flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Live Chat</h3>
              <p className="text-gray-600 mb-6">Begin live teaching session</p>
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-3 rounded-2xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg">
                Start Session
              </div>
            </div>
          </Link>

          {/* Profile Button */}
          <Link to="/profile" className="group" onClick={(e) => handleProtectedNav(e, '/profile', null, 'My Account')}>
            <div className="bg-white rounded-3xl p-10 shadow-2xl hover:shadow-3xl hover:-translate-y-3 transition-all duration-300 text-center h-full flex flex-col items-center justify-center md:col-span-2 lg:col-span-1">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">My Account</h3>
              <p className="text-gray-600 mb-6">Manage profile and earnings</p>
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg">
                View Profile
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TeacherPage;
