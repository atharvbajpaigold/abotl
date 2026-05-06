import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const role = localStorage.getItem('role');
    const user = (() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } })();
    const id = user?._id || user?.id || null;
    if (role === 'student' && id) navigate(`/student/page/${id}`, { replace: true });
    if (role === 'teacher' && id) navigate(`/teacher/page/${id}`, { replace: true });
  }, [navigate]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AtharvABOTL
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link to="/courses" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">Courses</Link>
              <Link to="/videos" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">Videos</Link>
              <Link to="/chat" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">Chat</Link>
            </div>
            <div className="flex space-x-3">
              <Link to="/student/login" className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:shadow-md hover:bg-gray-50 transition-all duration-200">
                Student Login
              </Link>
              <Link to="/teacher/login" className="px-6 py-2 text-sm font-medium bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full hover:shadow-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200">
                Teacher Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 bg-clip-text text-transparent leading-tight">
                Learn Together, 
                <span className="block text-transparent bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text">Grow Forever</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Connect with expert teachers, watch engaging videos like YouTube, share like Instagram, and chat in real-time. Your all-in-one learning platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/student/register" className="px-10 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg font-semibold rounded-2xl hover:shadow-2xl hover:from-purple-700 hover:to-blue-700 transform hover:-translate-y-1 transition-all duration-300">
                  Start Learning Free
                </Link>
                <Link to="/teacher/register" className="px-10 py-4 border-2 border-emerald-600 text-emerald-600 text-lg font-semibold rounded-2xl hover:bg-emerald-600 hover:text-white transition-all duration-300">
                  Teach & Earn Now
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-purple-400/30 to-blue-400/30 rounded-2xl p-6 text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="text-white font-semibold text-lg">10K+</h3>
                    <p className="text-white/80 text-sm">Courses</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-400/30 to-emerald-400/30 rounded-2xl p-6 text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-white font-semibold text-lg">50K+</h3>
                    <p className="text-white/80 text-sm">Students</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Everything You Need</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Learn, teach, connect, and grow with our all-in-one platform</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group text-center p-8 rounded-3xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Live Videos</h3>
              <p className="text-gray-600">YouTube-style streaming for live classes and recorded lessons</p>
            </div>
            <div className="group text-center p-8 rounded-3xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Chat Rooms</h3>
              <p className="text-gray-600">Real-time Group Chat between teachers and students</p>
            </div>
            <div className="group text-center p-8 rounded-3xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Post Content</h3>
              <p className="text-gray-600">Teachers Post, Student Watch, Student Learn</p>
            </div>
            <div className="group text-center p-8 rounded-3xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Earn Money</h3>
              <p className="text-gray-600">Teachers post, videos, and chat</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Learning?</h2>
          <p className="text-xl mb-10 opacity-90">Join 50K+ students and 5K+ teachers already building the future of education</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
            <div className="flex bg-white/20 backdrop-blur-xl rounded-2xl p-1">
              <Link to="/student/register" className="m-3 flex-1 px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-purple-600 transition-all duration-200">
                Student Signup
              </Link>
              <Link to="/teacher/register" className="m-3 flex-1 px-8 py-4 bg-transparent border-2 border-white test-purple-600 font-semibold rounded-xl hover:bg-white hover:text-purple-600 transition-all duration-200">
                Teacher's Signup
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4 block">
                AtharvABOTL
              </Link>
              <p className="text-gray-400 text-sm">Your all-in-one platform for learning, teaching, and connecting.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Students</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/courses" className="hover:text-white transition-colors">Courses</Link></li>
                <li><Link to="/videos" className="hover:text-white transition-colors">Video Library</Link></li>
                <li><Link to="/chat" className="hover:text-white transition-colors">Study Groups</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Teachers</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/teach" className="hover:text-white transition-colors">Start Teaching</Link></li>
                <li><Link to="/upload" className="hover:text-white transition-colors">Upload Videos</Link></li>
                <li><Link to="/earnings" className="hover:text-white transition-colors">Earnings</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
            © 2025 EduVerse. All rights removed logic.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
