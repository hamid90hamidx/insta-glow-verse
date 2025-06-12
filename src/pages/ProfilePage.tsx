
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Post } from '../types/Post';
import { Grid3X3, Heart, MessageCircle } from 'lucide-react';

const ProfilePage = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [profileUser, setProfileUser] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // Load user posts
    const storedPosts = localStorage.getItem('socialapp_posts');
    if (storedPosts) {
      const allPosts = JSON.parse(storedPosts);
      const filteredPosts = allPosts.filter((post: Post) => post.userId === userId);
      setUserPosts(filteredPosts);
      
      // Set profile user info
      if (filteredPosts.length > 0) {
        setProfileUser({
          id: filteredPosts[0].userId,
          username: filteredPosts[0].username,
          avatar: filteredPosts[0].userAvatar
        });
      } else if (userId === user.id) {
        setProfileUser(user);
      }
    }
  }, [userId, user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="max-w-4xl mx-auto pt-20 pb-8 px-4">
        {/* Profile Header */}
        <div className="flex items-center space-x-8 mb-8">
          <Avatar className="w-32 h-32">
            <AvatarImage src={profileUser?.avatar} alt={profileUser?.username} />
            <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-4xl">
              {profileUser?.username?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-4">{profileUser?.username}</h1>
            <div className="flex space-x-8 mb-4">
              <div className="text-center">
                <div className="text-xl font-bold text-white">{userPosts.length}</div>
                <div className="text-gray-400 text-sm">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">0</div>
                <div className="text-gray-400 text-sm">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">0</div>
                <div className="text-gray-400 text-sm">Following</div>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <Grid3X3 size={16} className="text-gray-400" />
            <span className="text-gray-400 text-sm uppercase tracking-wide">Posts</span>
          </div>
          
          {userPosts.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Grid3X3 size={24} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Posts Yet</h3>
              <p className="text-gray-400">
                {userId === user.id ? "Share your first post!" : "This user hasn't posted anything yet."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1 md:gap-4">
              {userPosts.map((post) => (
                <Card 
                  key={post.id} 
                  className="bg-gray-900 border-gray-800 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity aspect-square"
                >
                  <CardContent className="p-0 relative h-full">
                    {post.mediaType === 'image' ? (
                      <img
                        src={post.mediaUrl}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={post.mediaUrl}
                        className="w-full h-full object-cover"
                      />
                    )}
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                      <div className="flex items-center space-x-1 text-white">
                        <Heart size={20} />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-white">
                        <MessageCircle size={20} />
                        <span>{post.comments.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
