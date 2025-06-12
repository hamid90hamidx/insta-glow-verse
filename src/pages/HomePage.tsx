
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import PostCard from '../components/PostCard';
import { Post, Comment } from '../types/Post';
import { useToast } from '@/hooks/use-toast';

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // Load posts from localStorage
    const storedPosts = localStorage.getItem('socialapp_posts');
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    }
  }, [user, navigate]);

  const handleLike = (postId: string) => {
    const updatedPosts = posts.map(post => {
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
    
    setPosts(updatedPosts);
    localStorage.setItem('socialapp_posts', JSON.stringify(updatedPosts));
  };

  const handleDelete = (postId: string) => {
    const updatedPosts = posts.filter(post => post.id !== postId);
    setPosts(updatedPosts);
    localStorage.setItem('socialapp_posts', JSON.stringify(updatedPosts));
    
    toast({
      title: "Post deleted",
      description: "Your post has been deleted successfully.",
    });
  };

  const handleAddComment = (postId: string, comment: Comment) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, comment]
        };
      }
      return post;
    });
    
    setPosts(updatedPosts);
    localStorage.setItem('socialapp_posts', JSON.stringify(updatedPosts));
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="max-w-2xl mx-auto pt-20 pb-8 px-4">
        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
              <p className="text-gray-400 mb-6">Start sharing your moments with the community!</p>
              <button
                onClick={() => navigate('/upload')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Create First Post
              </button>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                onLike={handleLike}
                onDelete={handleDelete}
                onAddComment={handleAddComment}
                currentUserId={user.id}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
