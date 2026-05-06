import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

// API base URL - should be moved to environment variable in production
const API_BASE_URL = 'https://backend-six-pi-62.vercel.app';

const Video = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: null,
    video: null,
    category: '',
    visibility: 'public'
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewThumbnail, setPreviewThumbnail] = useState(null);

  const categories = ['Mathematics', 'Science', 'English', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'History', 'Geography'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'thumbnail') {
        if (file.type.startsWith('image/')) {
          setFormData(prev => ({ ...prev, thumbnail: file }));
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviewThumbnail(reader.result);
          };
          reader.readAsDataURL(file);
        } else {
          toast.error('Please select a valid image file for thumbnail');
        }
      } else if (type === 'video') {
        if (file.type.startsWith('video/') && file.size < 500 * 1024 * 1024) { // 500MB limit
          setFormData(prev => ({ ...prev, video: file }));
        } else {
          toast.error('Please select a video file under 500MB');
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    
    if (!formData.video) {
      toast.error('Please select a video file');
      return;
    }
    
    if (!formData.thumbnail) {
      toast.error('Please select a thumbnail image');
      return;
    }

    const uploadData = new FormData();
    uploadData.append('title', formData.title);
    uploadData.append('description', formData.description);
    uploadData.append('category', formData.category);
    uploadData.append('visibility', formData.visibility);
    uploadData.append('thumbnail', formData.thumbnail);
    uploadData.append('video', formData.video);

    try {
      setUploading(true);
      const res = await axios.post(`${API_BASE_URL}/api/teacher/upload-video`, uploadData, {
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });

      toast.success('Video uploaded successfully!');
      const user = JSON.parse(localStorage.getItem('user')) || {};
      const id = user._id || user.id;
      if (id) {
        navigate(`/teacher/page/${id}`);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 py-20">
      {/* Back to Home Button */}
      <div className="max-w-4xl mx-auto px-6 mb-8">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-semibold transition-colors group"
        >
          <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">Back to Home</span>
          <span className="sm:hidden">Home</span>
        </button>
      </div>

      {/* Header */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent mb-6 leading-tight">
            Upload New Video
          </h1>
          <p className="text-xl text-gray-700 font-medium max-w-2xl mx-auto">
            Share your knowledge with students worldwide
          </p>
        </div>

        {/* Upload Form */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-emerald-200/50 max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title & Basic Info Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Video Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 bg-white/50 backdrop-blur-sm text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                  placeholder="Enter a compelling video title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 bg-white/50 backdrop-blur-sm text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Description</label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 bg-white/50 backdrop-blur-sm text-lg resize-vertical transition-all duration-300 shadow-lg hover:shadow-xl"
                placeholder="Describe what students will learn from this video..."
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              

              {/* Thumbnail Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-6 flex items-center gap-2 ">
                  <span>Video Thumbnail *</span>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
                    Recommended: 1280x720
                  </span>
                </label>
                
                <div className="space-y-4">
                  {/* Preview */}
                  {previewThumbnail && (
                    <div className="relative group">
                      <img
                        src={previewThumbnail}
                        alt="Thumbnail preview"
                        className="w-full max-w-md max-h-48 object-cover rounded-2xl shadow-xl ring-4 ring-emerald-200/50"
                      />
                      <div className="absolute inset-0 bg-emerald-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">✅ Preview</span>
                      </div>
                    </div>
                  )}
                  
                  {/* File Input */}
                  <label className="block p-8 border-2 border-dashed border-gray-300 rounded-2xl text-center hover:border-emerald-400 hover:bg-emerald-50/50 transition-all duration-300 cursor-pointer group bg-white/50 backdrop-blur-sm shadow-lg hover:shadow-xl">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-400 group-hover:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-lg font-semibold text-gray-700 group-hover:text-emerald-600 mb-1">
                      {formData.thumbnail ? formData.thumbnail.name : 'Choose Thumbnail Image'}
                    </p>
                    <p className="text-sm text-gray-500">PNG, JPG or WebP (max 5MB)</p>
                    <input
                      type="file"
                      name="thumbnail"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'thumbnail')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Video Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-6 flex items-center gap-2">
                <span>Upload Video *</span>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
                  Max 500MB
                </span>
              </label>
              
              <label className="block p-12 border-2 border-dashed border-gray-300 rounded-2xl text-center hover:border-emerald-400 hover:bg-emerald-50/50 transition-all duration-300 cursor-pointer group bg-white/50 backdrop-blur-sm shadow-xl hover:shadow-2xl">
                <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-xl font-bold text-gray-800 group-hover:text-emerald-600 mb-2 transition-colors">
                  {formData.video ? formData.video.name : 'Select Video File'}
                </p>
                <p className="text-sm text-gray-500">MP4, MOV, AVI (max 500MB)</p>
                <input
                  type="file"
                  name="video"
                  accept="video/*"
                  onChange={(e) => handleFileChange(e, 'video')}
                  className="hidden"
                />
              </label>
            </div>

            {/* Progress Bar */}
            {uploadProgress > 0 && (
              <div className="md:col-span-2">
                <div className="bg-gray-200 rounded-full h-3 mb-2">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full shadow-lg transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm font-medium text-emerald-700">{uploadProgress}% uploaded</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-8">
              <button
                type="submit"
                disabled={uploading}
                className={`w-full py-8 px-12 rounded-3xl font-bold text-xl shadow-2xl transition-all duration-300 transform flex items-center justify-center gap-4 group ${
                  uploading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:via-teal-700 hover:to-green-700 hover:shadow-3xl hover:-translate-y-1 active:translate-y-0'
                } text-white`}
              >
                {uploading ? (
                  <>
                    <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <svg className="w-8 h-8 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} stroke="currentColor" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Publish Video
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Video;
