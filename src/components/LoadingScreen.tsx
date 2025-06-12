
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Camera } from 'lucide-react';

const LoadingScreen = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500);

    const redirectTimer = setTimeout(() => {
      if (!isLoading) {
        if (user) {
          navigate('/home');
        } else {
          navigate('/auth');
        }
      }
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearTimeout(redirectTimer);
    };
  }, [user, isLoading, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center overflow-hidden">
      <div className={`text-center transition-all duration-1000 ${showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-60 animate-pulse"></div>
          <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-full">
            <Camera size={48} className="text-white" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          SocialVibe
        </h1>
        
        <p className="text-gray-400 text-lg mb-8">
          Connect, Share, Inspire
        </p>
        
        <div className="flex justify-center">
          <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
