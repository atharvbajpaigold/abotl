import React from 'react';
import { Link,useLocation,useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

const StudentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user || JSON.parse(localStorage.getItem('user')) || {};
  
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
      await axios.post('https://backend-six-pi-62.vercel.app/auth/student/logout', {}, { withCredentials: true });
    } catch (err) {
      console.warn('Logout request failed', err);
    }
    
    try { 
      Cookies.remove('token', { path: '/', sameSite: 'lax' }); 
    } catch (e) { /* ignore */ }
    
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/', { replace: true });
    window.location.reload();
    toast.success('Logged out successfully!');
    
    
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100">
      {/* Navigation Buttons - Fixed at Top */}
      <div className="fixed top-4 left-4 right-4 sm:right-6 z-50 flex items-center justify-between gap-4">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-2xl text-xs sm:text-sm shadow-xl hover:from-purple-600 hover:to-pink-600 hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 transition-all duration-200 group"
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
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10"></div>
        
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            {/* Large Profile Image */}
            <div className="flex-shrink-0">
              <div className="relative group">
                <img 
                  className="w-32 h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 rounded-3xl ring-8 ring-purple-200/50 shadow-2xl object-cover hover:scale-105 hover:ring-purple-300/70 transition-all duration-500 cursor-pointer"
                  src={user?.imageURL || '/default-avatar.png'} 
                  alt="Profile" 
                />
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-indigo-500/30 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl animate-pulse opacity-70"></div>
              </div>
            </div>

            {/* Welcome Text */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-4 leading-tight">
                Welcome back, {user.username || user?.email || 'Student'}!
              </h1>
              <p className="text-xl text-gray-700 font-medium">Your personalized learning dashboard</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Increased top padding to account for fixed logout */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Main Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Explore Videos Button */}
          <Link to="/explore" className="group" onClick={(e) => handleProtectedNav(e, '/explore', 'student', 'Explore Videos')}>
            <div className="bg-white rounded-3xl p-10 shadow-2xl hover:shadow-3xl hover:-translate-y-3 transition-all duration-300 text-center h-full flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m6 0h6m-6 0v6m0-6V6a2 2 0 116 0v6a2 2 0 01-2 2h-1" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Explore Videos</h3>
              <p className="text-gray-600 mb-6">Discover courses from top teachers</p>
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-2xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg">
                Start Exploring
              </div>
            </div>
          </Link>

          {/* Video Chat Button */}
          <Link to="/chat" className="group" onClick={(e) => handleProtectedNav(e, '/video-chat', null, 'Live Chat')}>
            <div className="bg-white rounded-3xl p-10 shadow-2xl hover:shadow-3xl hover:-translate-y-3 transition-all duration-300 text-center h-full flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Chat</h3>
              <p className="text-gray-600 mb-6">Join live Chat with teachers</p>
              <div className="bg-gradient-to-r from-pink-500 to-indigo-500 text-white px-8 py-3 rounded-2xl font-semibold hover:from-pink-600 hover:to-indigo-600 transition-all shadow-lg">
                Join Live Chat
              </div>
            </div>
          </Link>

          {/* Personal Account Button */}
          <Link to="/profile" className="group" onClick={(e) => handleProtectedNav(e, '/profile', null, 'My Account')}>
            <div className="bg-white rounded-3xl p-10 shadow-2xl hover:shadow-3xl hover:-translate-y-3 transition-all duration-300 text-center h-full flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">My Account</h3>
              <p className="text-gray-600 mb-6">Manage profile and settings</p>
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-3 rounded-2xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg">
                View Profile
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentPage;
