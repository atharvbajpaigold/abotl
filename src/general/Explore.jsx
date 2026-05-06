import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Explore = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [likedVideos, setLikedVideos] = useState(new Set());

  const categories = ['All', 'Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'History', 'Geography', 'English'];

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://backend-six-pi-62.vercel.app/api/teacher/videos', {
        withCredentials: true
      });
      setVideos(res.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast.error('Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (videoId, isCurrentlyLiked) => {
    try {
      const action = isCurrentlyLiked ? 'unlike' : 'like';
      const res = await axios.post(
        `https://backend-six-pi-62.vercel.app/api/teacher/videos/${videoId}/like`, 
        { action },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Update the video in the state
      setVideos(prevVideos => 
        prevVideos.map(video => 
          video._id === videoId 
            ? { ...video, likes: res.data.likes }
            : video
        )
      );
      
      // Toggle the liked state
      if (isCurrentlyLiked) {
        setLikedVideos(prev => {
          const newSet = new Set(prev);
          newSet.delete(videoId);
          return newSet;
        });
        toast.success('Video unliked');
      } else {
        setLikedVideos(prev => new Set(prev).add(videoId));
        toast.success('Video liked!');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to toggle like');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-md border-b border-white/10 sticky top-0 z-50 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4 w-full sm:w-auto">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center text-white/80 hover:text-white font-semibold transition-colors group mr-4"
              >
                <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden sm:inline">Home</span>
              </button>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Explore
              </h1>
              <div className="text-sm text-gray-400 bg-black/30 px-4 py-2 rounded-full">
                {filteredVideos.length} videos
              </div>
            </div>
            <div className="relative w-full sm:max-w-md">
              <input
                type="text"
                placeholder="Search videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-3 bg-black/50 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 transition-all duration-300"
              />
              <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Categories */}
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/25'
                  : 'bg-white/10 hover:bg-white/20 text-gray-300 border border-white/20 hover:border-white/40'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
          {filteredVideos.map((video) => (
            <div
              key={video._id}
              className="group bg-black/40 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 hover:border-emerald-400/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/25"
            >
              {/* Thumbnail */}
              <div 
                className="relative h-48 md:h-52 overflow-hidden bg-gradient-to-r from-gray-800 to-gray-900 cursor-pointer"
                onClick={() => window.open(video.videoURL, '_blank')}
              >
                <img
                  src={video.thumbnailURL || '/default-thumbnail.jpg'}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-emerald-500/90 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-2xl">
                    <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Video Info */}
              <div className="p-6 space-y-3">
                <h3 className="font-bold text-xl line-clamp-2 leading-tight group-hover:text-emerald-400 transition-colors">
                  {video.title}
                </h3>
                
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                  <span>{video.category}</span>
                </div>
                
                <p className="text-sm text-gray-400 line-clamp-2">{video.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(video._id, likedVideos.has(video._id));
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                        likedVideos.has(video._id)
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/50 hover:bg-emerald-500/30'
                          : 'bg-white/10 text-gray-400 hover:bg-white/20 border border-white/20'
                      }`}
                    >
                      <svg className="w-5 h-5" fill={likedVideos.has(video._id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span className="font-semibold">{video.likes || 0}</span>
                    </button>
                    {video.createdAt && (
                      <span className="text-xs text-gray-500">
                        {formatDate(video.createdAt)}
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-semibold text-emerald-400">
                    {video.teacher?.username || 'Unknown Teacher'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-32">
            <div className="w-32 h-32 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <svg className="w-20 h-20 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 11a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-300 mb-4">No videos found</h2>
            <p className="text-xl text-gray-500 max-w-md mx-auto">
              Try adjusting your search terms or category filters to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
