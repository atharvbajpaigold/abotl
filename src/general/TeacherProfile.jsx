import React, { useState, useEffect } from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const TeacherProfile = () => {
  const navigate = useNavigate()
  const [teacherData, setTeacherData] = useState({
    username: '',
    email: '',
    password: '',
    profileImage: '',
    subjects: []
  });
  
  const [editedData, setEditedData] = useState({
    username: '',
    email: '',
    password: '',
    profileImage: '',
    subjects: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [newSubject, setNewSubject] = useState('');
  const [videos, setVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(false);

  const availableSubjects = ['Mathematics', 'Science', 'English', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'History', 'Geography', 'Art', 'Music', 'Physical Education'];

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.post('https://backend-six-pi-62.vercel.app/api/auth/teacher/profile', {}, {
        withCredentials: true
      });
      
      const data = res.data;
      setTeacherData({
        username: data.username || '',
        email: data.email || '',
        password: '',
        profileImage: data.profileImage || data.imageURL || '',
        subjects: data.subjects || []
      });
      setEditedData({
        username: data.username || '',
        email: data.email || '',
        password: '',
        profileImage: data.profileImage || data.imageURL || '',
        subjects: data.subjects || []
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
      formData.append('subjects', JSON.stringify(editedData.subjects));
      
      if (editedData.password && editedData.password.trim() !== '') {
        formData.append('password', editedData.password);
      }
      
      if (imageFile) {
        formData.append('profileImage', imageFile);
      }

      const res = await axios.put('https://backend-six-pi-62.vercel.app/api/auth/teacher/profile', formData, {
        withCredentials: true
      });
      
      const updatedData = {
        username: res.data.username || editedData.username,
        email: res.data.email || editedData.email,
        password: '',
        profileImage: res.data.profileImage || res.data.imageURL || '',
        subjects: res.data.subjects || editedData.subjects
      };
      
      setTeacherData(updatedData);
      setEditedData(updatedData);
      setImagePreview(updatedData.profileImage);
      setImageFile(null);
      setIsEditing(false);
      console.log('Profile updated successfully:', res.data);
      alert('Profile updated successfully!');
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
    fetchVideos();
  }, []);

  // Fetch teacher's videos
  const fetchVideos = async () => {
    try {
      setLoadingVideos(true);
      const res = await axios.get('https://backend-six-pi-62.vercel.app/api/teacher/my-videos', {
        withCredentials: true
      });
      setVideos(res.data);
    } catch (error) {
      console.error('Error fetching videos:', error.response?.data || error.message);
    } finally {
      setLoadingVideos(false);
    }
  };

  // Delete a video
  const handleDeleteVideo = async (videoId, videoTitle) => {
    const confirmMessage = `Are you sure you want to delete "${videoTitle}"? This action cannot be undone.`;
    if (!window.confirm(confirmMessage)) return;
    
    try {
      await axios.delete(`https://backend-six-pi-62.vercel.app/api/teacher/videos/${videoId}`, {
        withCredentials: true
      });
      
      toast.success('Video deleted successfully');
      // Refresh videos list
      fetchVideos();
    } catch (error) {
      console.error('Error deleting video:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message;
      toast.error('Error deleting video: ' + errorMessage);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      saveProfile();
    } else {
      setIsEditing(true);
      setEditedData({
        username: teacherData.username || '',
        email: teacherData.email || '',
        password: '',
        profileImage: teacherData.profileImage || '',
        subjects: [...(teacherData.subjects || [])]
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

  const handleAddSubject = () => {
    if (newSubject.trim() && !editedData.subjects.includes(newSubject.trim())) {
      setEditedData({
        ...editedData,
        subjects: [...editedData.subjects, newSubject.trim()]
      });
      setNewSubject('');
    }
  };

  const handleRemoveSubject = (subjectToRemove) => {
    setEditedData({
      ...editedData,
      subjects: editedData.subjects.filter(sub => sub !== subjectToRemove)
    });
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
      await axios.delete('https://backend-six-pi-62.vercel.app/api/auth/teacher/profile', {
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
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl p-12 shadow-2xl text-center">
          <div className="text-2xl text-gray-600">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 py-12 px-4">
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
                navigate(`/teacher/page/${id}`);
              } else {
                navigate('/');
              }
            }}
            className="inline-flex items-center text-emerald-600 font-semibold hover:text-emerald-700 transition-colors group"
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
            className="inline-flex items-center text-emerald-600 font-semibold hover:text-emerald-700 transition-colors group"
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Profile {editedData.username || ''}
            </h1>
            <button 
              className={`px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center gap-3 shadow-lg ${
                isEditing || saving
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white' 
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white'
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
              <div className="relative w-48 h-48 rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-emerald-400/20 to-teal-400/20 border-4 border-emerald-100">
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
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-2xl file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-emerald-500 file:to-teal-500 file:text-white hover:file:from-emerald-600 hover:file:to-teal-600 file:shadow-lg cursor-pointer transition-all"
                  />
                </div>
              )}
              
              {!isEditing && teacherData.profileImage && (
                <p className="text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-xl truncate max-w-full">
                  {teacherData.profileImage}
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
                      ? 'border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 shadow-lg hover:shadow-xl'
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
                      ? 'border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 shadow-lg hover:shadow-xl'
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
                      ? 'border-teal-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 shadow-lg hover:shadow-xl'
                      : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 cursor-not-allowed'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Subjects Section */}
        <div className="bg-white rounded-3xl p-10 shadow-2xl mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Subjects</h2>
          
          {isEditing ? (
            <div className="space-y-6">
              {/* Current Subjects */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Your Subjects</label>
                <div className="flex flex-wrap gap-3 mb-4">
                  {editedData.subjects.map((subject, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold flex items-center gap-2"
                    >
                      {subject}
                      <button
                        onClick={() => handleRemoveSubject(subject)}
                        className="hover:text-red-200 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                  {editedData.subjects.length === 0 && (
                    <span className="text-gray-400 italic">No subjects added yet</span>
                  )}
                </div>
              </div>

              {/* Add Subject */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Add Subject</label>
                <div className="flex gap-3">
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="flex-1 px-6 py-4 rounded-2xl border-2 border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 text-lg font-medium transition-all duration-300 shadow-lg"
                  >
                    <option value="">Select a subject</option>
                    {availableSubjects
                      .filter(sub => !editedData.subjects.includes(sub))
                      .map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddSubject}
                    disabled={!newSubject.trim()}
                    className="px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {teacherData.subjects && teacherData.subjects.length > 0 ? (
                teacherData.subjects.map((subject, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold"
                  >
                    {subject}
                  </span>
                ))
              ) : (
                <span className="text-gray-400 italic">No subjects added yet</span>
              )}
            </div>
          )}
        </div>

        {/* Videos Section */}
        <div className="bg-white rounded-3xl p-10 shadow-2xl mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">My Videos</h2>
          
          {loadingVideos ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">Loading videos...</p>
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 text-lg">No videos uploaded yet</p>
              <p className="text-gray-400 text-sm mt-2">Upload your first video to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {videos.map((video) => (
                <div
                  key={video._id}
                  className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200 hover:border-emerald-300 transition-all duration-300 group"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-800 mb-2 truncate group-hover:text-emerald-600 transition-colors">
                      {video.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full font-medium">
                        {video.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {video.likes || 0} likes
                      </span>
                      {video.createdAt && (
                        <span className="text-gray-500">
                          {new Date(video.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <a
                      href={video.videoURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-all shadow-lg hover:shadow-xl"
                    >
                      View
                    </a>
                    <button
                      onClick={() => handleDeleteVideo(video._id, video.title)}
                      className="px-4 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;

