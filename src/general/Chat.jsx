import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Chat = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);

  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const userRole = localStorage.getItem('role');
  const userId = user ? (user._id || user.id || (user._doc && user._doc._id) || null) : null;

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Verify authentication
  useEffect(() => {
    if (!userRole || !userId) {
      toast.error('Please login first');
      navigate('/');
    }
  }, [userRole, userId, navigate]);

  // Fetch conversations
  useEffect(() => {
    if (userRole && userId) {
      fetchConversations();
      const interval = setInterval(fetchConversations, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval);
    }
  }, [userRole, userId]);

  const fetchConversations = async () => {
    try {
      const response = await axios.get(
        `https://backend-six-pi-62.vercel.app/api/chat/conversations`,
        { withCredentials: true }
      );
      setConversations(response.data.conversations);

      // Calculate unread count
      const totalUnread = response.data.conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
      setUnreadCount(totalUnread);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  // Fetch messages for selected conversation
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000); // Refresh every 3 seconds
      return () => clearInterval(interval);
    }
  }, [selectedConversation]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `https://backend-six-pi-62.vercel.app/api/chat/messages/${selectedConversation.conversationId}`,
        { withCredentials: true }
      );
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      setLoading(true);

      await axios.post(
        `https://backend-six-pi-62.vercel.app/api/chat/send`,
        {
          recipientId: selectedConversation.conversationId,
          recipientModel: selectedConversation.model,
          message: newMessage
        },
        { withCredentials: true }
      );

      setNewMessage('');
      messageInputRef.current?.focus();
      await fetchMessages();
      await fetchConversations();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error sending message');
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-xl border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Messages
            </h1>
            {unreadCount > 0 && (
              <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                {unreadCount}
              </div>
            )}
          </div>
          <div className="text-white/60 text-sm">
            Logged in as <span className="text-emerald-400 font-semibold">{user.username}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-4 max-w-7xl mx-auto w-full p-4">
        {/* Conversations List */}
        <div className="w-80 flex flex-col gap-4">
          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
            />
            <svg className="absolute right-3 top-3 w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Conversations Container */}
          <div className="flex-1 overflow-y-auto bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-2 space-y-2">
            {filteredConversations.length === 0 ? (
              <div className="flex items-center justify-center h-full text-white/50 text-center p-4">
                <div>
                  <svg className="w-12 h-12 mx-auto mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p>No conversations yet</p>
                </div>
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.conversationId?.toString()}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`p-3 rounded-xl cursor-pointer transition-all transform hover:scale-105 ${
                    selectedConversation?.conversationId?.toString() === conversation.conversationId?.toString()
                      ? 'bg-gradient-to-r from-emerald-500/50 to-teal-500/50 border border-emerald-400 shadow-lg shadow-emerald-500/20'
                      : 'bg-white/10 hover:bg-white/20 border border-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">{conversation.name}</p>
                      <p className="text-xs text-white/50 truncate">{conversation.lastMessage}</p>
                    </div>
                    {conversation.unreadCount > 0 && (
                      <div className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                        {conversation.unreadCount}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-white/40 mt-2">
                    {new Date(conversation.lastMessageTime).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-b border-white/10 p-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedConversation.name}</h2>
                  <p className="text-xs text-white/50 capitalize">{selectedConversation.model}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-white/60">Active</span>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-white/40">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const isSender = userId && (msg.sender?.toString() === userId.toString() || msg.sender === userId);
                    return (
                      <div
                        key={msg._id || idx}
                        className={`flex ${isSender ? 'justify-end' : 'justify-start'} animate-fadeInUp`}
                      >
                        <div
                          className={`max-w-xs px-5 py-3 rounded-2xl ${
                            isSender
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-br-none shadow-lg shadow-emerald-500/30'
                              : 'bg-white/10 text-white/90 rounded-bl-none border border-white/20 shadow-lg shadow-white/5'
                          }`}
                        >
                          <p className="text-sm break-words">{msg.message}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(msg.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="border-t border-white/10 p-4 bg-black/20">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <input
                    ref={messageInputRef}
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !newMessage.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-emerald-500/30 active:scale-95"
                  >
                    {loading ? (
                      <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5.951-1.429 5.951 1.429a1 1 0 001.169-1.409l-7-14z" />
                      </svg>
                    )}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-white/40">
              <svg className="w-20 h-20 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-lg font-semibold">Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.3s ease-out;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.3);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Chat;
