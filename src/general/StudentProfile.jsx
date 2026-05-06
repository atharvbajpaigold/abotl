import React, { useState, useEffect } from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const StudentProfile = () => {
  const navigate = useNavigate()
  const [studentData, setStudentData] = useState({
    username: '',
    email: '',
    password: '',
    profileImage: ''
  });
  
  const [editedData, setEditedData] = useState({
    username: '',
    email: '',
    password: '',
    profileImage: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.post('https://backend-six-pi-62.vercel.app/api/auth/student/profile', {}, {
        withCredentials: true
      });
      
      const data = res.data;
      setStudentData(data);
      setEditedData({
        username: data.username || '',
        email: data.email || '',
        password: '', 
        profileImage: data.profileImage || data.imageURL || ''
      });
      setImagePreview(data.profileImage || data.imageURL || '');
      setImageFile(null);
      console.log('Profile fetched:', data);
    } catch (error) {
      console.error('Error fetching profile:', error.response?.data || error.message);
      alert('Error loading profile: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Save edited data
  const saveProfile = async () => {
    try {
      setSaving(true);
      
      const formData = new FormData();
      formData.append('username', editedData.username);
      formData.append('email', editedData.email);
      
      if (editedData.password && editedData.password.trim() !== '') {
        formData.append('password', editedData.password);
      }
      
      if (imageFile) {
        formData.append('profileImage', imageFile);
      }

          const res = await axios.put('https://backend-six-pi-62.vercel.app/api/auth/student/profile', formData, {
        withCredentials: true,
        headers: {
         'Content-Type': 'multipart/form-data'
        }
      });
      
      const updatedData = {
        username: res.data.username || editedData.username,
        email: res.data.email || editedData.email,
        password: '',
        profileImage: res.data.profileImage || res.data.imageURL || ''
      };
      
      setStudentData(updatedData);
      setEditedData(updatedData);
      setImagePreview(updatedData.profileImage);
      setImageFile(null);
      setIsEditing(false);
      alert('Profile updated successfully!')
      
    } catch (error) {
      console.error('Error saving profile:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message;
      alert('Error saving profile: ' + errorMessage);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleEditToggle = () => {
    if (isEditing) {
      saveProfile();
    } else {
      setIsEditing(true);
      setEditedData({
        username: studentData.username || '',
        email: studentData.email || '',
        password: '',
        profileImage: studentData.profileImage || ''
      });
      setImageFile(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      setImageFile(file);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmMessage = 'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.';
    if (!window.confirm(confirmMessage)) return;
    
    // Double confirmation
    const doubleConfirm = window.prompt('Type "DELETE" to confirm account deletion:');
    if (doubleConfirm !== 'DELETE') {
      toast.info('Account deletion cancelled');
      return;
    }

    try {
      await axios.delete('https://backend-six-pi-62.vercel.app/api/auth/student/profile', {
        withCredentials: true
      });

      // Clear cookies
      try {
        Cookies.remove('token', { path: '/', sameSite: 'lax' });
      } catch (e) {
        console.warn('Cookie removal failed', e);
      }

      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('role');

      toast.success('Account deleted successfully');
      navigate('/', { replace: true });
      window.location.reload();
    } catch (error) {
      console.error('Error deleting account:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message;
      toast.error('Error deleting account: ' + errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl p-12 shadow-2xl text-center">
          <div className="text-2xl text-gray-600">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100 py-12 px-4">
      {/* Delete Account Button - Fixed at Top Right */}
      <div className="fixed top-4 right-4 sm:right-6 z-50">
        <button 
          onClick={handleDeleteAccount}
          className="group relative px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-2xl text-xs sm:text-sm shadow-xl hover:from-red-600 hover:to-red-700 hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 transition-all duration-200 overflow-hidden transform z-10"
          title="Delete Account"
        >
          <span className="flex items-center space-x-1.5 sm:space-x-2">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span className="hidden sm:inline">Delete Account</span>
            <span className="sm:hidden">Delete</span>
          </span>
          
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </button>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Navigation Buttons */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <button 
            onClick={() => {
              const user = JSON.parse(localStorage.getItem('user')) || {};
              const id = user._id || user.id;
              if (id) {
                navigate(`/student/page/${id}`);
              } else {
                navigate('/');
              }
            }}
            className="inline-flex items-center text-purple-600 font-semibold hover:text-purple-700 transition-colors group"
          >
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Back to Dashboard</span>
            <span className="sm:hidden">Dashboard</span>
          </button>
          <span className="text-gray-400 hidden sm:inline">|</span>
          <button 
            onClick={() => navigate('/')}
            className="inline-flex items-center text-purple-600 font-semibold hover:text-purple-700 transition-colors group"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="hidden sm:inline">Home</span>
            <span className="sm:hidden">Home</span>
          </button>
        </div>

        {/* Header */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl mb-8 ">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Profile {editedData.username || ''} (aka nalla)
            </h1>
            <button 
              className={`px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center gap-3 shadow-lg ${
                isEditing || saving
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white' 
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
              } ${saving ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-2xl hover:-translate-y-1'}`}
              onClick={handleEditToggle}
              disabled={saving}
            >
              {saving ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                isEditing ? 'Save Changes' : 'Edit Profile'
              )}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Image Section */}
          <div className="bg-white rounded-3xl p-10 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Profile Picture</h2>
            
            <div className="flex flex-col items-center gap-6">
              <div className="relative w-48 h-48 rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-purple-400/20 to-pink-400/20 border-4 border-purple-100">
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-400 font-semibold text-xl">No Image</span>
                  </div>
                )}
              </div>
              
              {isEditing && (
                <div className="w-full">
                  <input
                    type="file"
                    name="profileImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-2xl file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-purple-500 file:to-pink-500 file:text-white hover:file:from-purple-600 hover:file:to-pink-600 file:shadow-lg cursor-pointer transition-all"
                  />
                </div>
              )}
              
              {!isEditing && studentData.profileImage && (
                <p className="text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-xl truncate max-w-full">
                  {studentData.profileImage}
                </p>
              )}
            </div>
          </div>

          {/* Credentials Section */}
          <div className="bg-white rounded-3xl p-10 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Account Details</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Username</label>
                <input 
                  type="text" 
                  name="username"
                  value={editedData.username || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-6 py-4 rounded-2xl border-2 text-lg font-medium transition-all duration-300 ${
                    isEditing
                      ? 'border-purple-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 shadow-lg hover:shadow-xl'
                      : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 cursor-not-allowed'
                  }`}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Email</label>
                <input 
                  type="email"
                  name="email"
                  value={editedData.email || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-6 py-4 rounded-2xl border-2 text-lg font-medium transition-all duration-300 ${
                    isEditing
                      ? 'border-purple-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 shadow-lg hover:shadow-xl'
                      : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 cursor-not-allowed'
                  }`}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">New Password (optional)</label>
                <input 
                  type="password"
                  name="password"
                  value={editedData.password || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Leave empty to keep current"
                  className={`w-full px-6 py-4 rounded-2xl border-2 text-lg font-medium transition-all duration-300 ${
                    isEditing
                      ? 'border-pink-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 shadow-lg hover:shadow-xl'
                      : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 cursor-not-allowed'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
