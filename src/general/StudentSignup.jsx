import React,{useState, useEffect} from 'react';
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const StudentSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    profilePicture: null
  });
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
      const payload = new FormData();
      payload.append('username', formData.username);
      payload.append('email', formData.email);
      payload.append('password', formData.password);
      if (formData.profilePicture) payload.append('profilePicture', formData.profilePicture);
          const res = await axios.post('https://backend-six-pi-62.vercel.app/api/auth/student/register', payload, { withCredentials: true });
      // persist user data if backend returns it (support `userData` or `useData` keys)
      const user = res.data?.userData || res.data?.useData || null;
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('role', 'student');
      }
      toast.success(res.data?.message || JSON.stringify(res.data) || 'Account created');
      const id = res.data?.message || user?._id || user?.id || null;
      if (id) {
        navigate(`/student/page/${id}`, { state: { user }, replace: true });
      } else {
        // fallback to home if no id returned
        navigate('/', { replace: true });
      }
      setFormData({ username: '', email: '', password: '', profilePicture: null });
    } catch (err) {
      console.error('Student signup error:', err);
      toast.error(err.response?.data?.error || err.response?.data?.message || err.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Join as Student
          </h1>
          <p className="text-gray-600">Start your learning journey today</p>
        </div>
        <form className="space-y-6" onSubmit={(e) => handleSubmit(e)}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input 
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              type="text" 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
              placeholder="John Doe" 
              value={formData.username}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input 
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              type="email" 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
              placeholder="your@email.com" 
              value={formData.email}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input 
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              type="password" 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
              placeholder="••••••••" 
              value={formData.password}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFormData({...formData, profilePicture: e.target.files[0] || null})}
              className="w-full border border-gray-300 rounded-xl m-2 p-2 gap-2"
            />
          </div>
          <button type='submit' className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-200">
            Create Account
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account? 
            <Link to="/student/login" className="text-purple-600 font-semibold ml-1 hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentSignup;
