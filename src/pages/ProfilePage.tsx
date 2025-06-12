
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import PostModal from '../components/PostModal';
import CommentDrawer from '../components/CommentDrawer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Post, Comment } from '../types/Post';
import { Grid3X3, Heart, MessageCircle, Camera, UserPlus, UserMinus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProfilePage = () => {
  const { userId } = useParams();
  const { user, getUserById, followUser, unfollowUser, updateAvatar } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [profileUser, setProfileUser] = useState<any>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);

  const isOwnProfile = userId === user?.id;
  const isFollowing = user?.following.includes(userId || '') || false;

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // Get user info
    const targetUser = getUserById(userId || '');
    if (targetUser || isOwnProfile) {
      setProfileUser(isOwnProfile ? user : targetUser);
    }

    // Load user posts
    const storedPosts = localStorage.getItem('socialapp_posts');
    if (storedPosts) {
      const allPosts = JSON.parse(storedPosts);
      const filteredPosts = allPosts.filter((post: Post) => post.userId === userId);
      setUserPosts(filteredPosts);
    }
  }, [userId, user, navigate, getUserById, isOwnProfile]);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && isOwnProfile) {
      setIsAvatarUploading(true);
      // Simulate upload - in real app, upload to cloud service
      const fakeUrl = URL.createObjectURL(file);
      setTimeout(() => {
        updateAvatar(fakeUrl);
        setIsAvatarUploading(false);
        toast({
          title: "Avatar updated!",
          description: "Your profile picture has been updated.",
        });
      }, 1000);
    }
  };

  const handleFollow = () => {
    if (!userId) return;
    
    if (isFollowing) {
      unfollowUser(userId);
      toast({
        title: "Unfollowed",
        description: `You unfollowed ${profileUser?.username}`,
      });
    } else {
      followUser(userId);
      toast({
        title: "Following",
        description: `You are now following ${profileUser?.username}`,
      });
    }
  };

  const handleLike = (postId: string) => {
    const updatedPosts = userPosts.map(post => {
      if (post.id === postId) {
        const isLiked = post.likedBy.includes(user!.id);
        return {
          ...post,
          likes: isLiked ? post.likes - 1 : post.likes + 1,
          likedBy: isLiked 
            ? post.likedBy.filter(id => id !== user!.id)
            : [...post.likedBy, user!.id]
        };
      }
      return post;
    });
    
    setUserPosts(updatedPosts);
    
    // Update main posts storage
    const allPosts = JSON.parse(localStorage.getItem('socialapp_posts') || '[]');
    const updatedAllPosts = allPosts.map((post: Post) => {
      const updatedPost = updatedPosts.find(p => p.id === post.id);
      return updatedPost || post;
    });
    localStorage.setItem('socialapp_posts', JSON.stringify(updatedAllPosts));
  };

  const handleDelete = (postId: string) => {
    const updatedPosts = userPosts.filter(post => post.id !== postId);
    setUserPosts(updatedPosts);
    
    // Update main posts storage
    const allPosts = JSON.parse(localStorage.getItem('socialapp_posts') || '[]');
    const updatedAllPosts = allPosts.filter((post: Post) => post.id !== postId);
    localStorage.setItem('socialapp_posts', JSON.stringify(updatedAllPosts));
    
    setSelectedPost(null);
    toast({
      title: "Post deleted",
      description: "Your post has been deleted successfully.",
    });
  };

  const handleAddComment = (postId: string, comment: Comment) => {
    const updatedPosts = userPosts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, comment]
        };
      }
      return post;
    });
    
    setUserPosts(updatedPosts);
    
    // Update main posts storage
    const allPosts = JSON.parse(localStorage.getItem('socialapp_posts') || '[]');
    const updatedAllPosts = allPosts.map((post: Post) => {
      const updatedPost = updatedPosts.find(p => p.id === post.id);
      return updatedPost || post;
    });
    localStorage.setItem('socialapp_posts', JSON.stringify(updatedAllPosts));
    
    // Update selected post if it's open
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost({
        ...selectedPost,
        comments: [...selectedPost.comments, comment]
      });
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="max-w-4xl mx-auto pt-20 pb-8 px-4">
        {/* Profile Header */}
        <div className="flex items-center space-x-8 mb-8">
          <div className="relative">
            <Avatar className="w-32 h-32">
              <AvatarImage src={profileUser?.avatar} alt={profileUser?.username} />
              <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-4xl">
                {profileUser?.username?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            {isOwnProfile && (
              <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-purple-600 p-2 rounded-full cursor-pointer hover:bg-purple-700 transition-colors">
                <Camera size={16} className="text-white" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={isAvatarUploading}
                />
              </label>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-4">
              <h1 className="text-3xl font-bold text-white">{profileUser?.username}</h1>
              
              {!isOwnProfile && (
                <Button
                  onClick={handleFollow}
                  variant={isFollowing ? "outline" : "default"}
                  className={isFollowing 
                    ? "border-gray-600 text-gray-300 hover:bg-gray-800" 
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                  }
                >
                  {isFollowing ? (
                    <>
                      <UserMinus size={16} className="mr-2" />
                      Unfollow
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} className="mr-2" />
                      Follow
                    </>
                  )}
                </Button>
              )}
            </div>
            
            <div className="flex space-x-8 mb-4">
              <div className="text-center">
                <div className="text-xl font-bold text-white">{userPosts.length}</div>
                <div className="text-gray-400 text-sm">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">{profileUser?.followers?.length || 0}</div>
                <div className="text-gray-400 text-sm">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">{profileUser?.following?.length || 0}</div>
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
                {isOwnProfile ? "Share your first post!" : "This user hasn't posted anything yet."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1 md:gap-4">
              {userPosts.map((post) => (
                <Card 
                  key={post.id} 
                  className="bg-gray-900 border-gray-800 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity aspect-square"
                  onClick={() => setSelectedPost(post)}
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

      {/* Post Modal */}
      {selectedPost && (
        <PostModal
          isOpen={!!selectedPost}
          onClose={() => setSelectedPost(null)}
          post={selectedPost}
          onLike={handleLike}
          onDelete={isOwnProfile ? handleDelete : undefined}
          onComment={() => setShowComments(true)}
          currentUserId={user.id}
        />
      )}

      {/* Comment Drawer */}
      {selectedPost && (
        <CommentDrawer
          isOpen={showComments}
          onClose={() => setShowComments(false)}
          post={selectedPost}
          onAddComment={handleAddComment}
        />
      )}
    </div>
  );
};

export default ProfilePage;
