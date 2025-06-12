
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Post } from '../types/Post';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  currentUserId: string;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike, currentUserId }) => {
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(false);
  const isLiked = post.likedBy.includes(currentUserId);

  const handleUserClick = () => {
    navigate(`/profile/${post.userId}`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div 
          className="flex items-center space-x-3 cursor-pointer"
          onClick={handleUserClick}
        >
          <Avatar className="w-10 h-10">
            <AvatarImage src={post.userAvatar} alt={post.username} />
            <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              {post.username[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-white font-semibold">{post.username}</p>
            <p className="text-gray-400 text-sm">
              {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
            </p>
          </div>
        </div>
        
        <button className="text-gray-400 hover:text-white p-2">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Media */}
      <div className="relative">
        {post.mediaType === 'image' ? (
          <img
            src={post.mediaUrl}
            alt={post.title}
            className="w-full h-auto max-h-96 object-cover"
          />
        ) : (
          <video
            src={post.mediaUrl}
            className="w-full h-auto max-h-96 object-cover"
            controls
          />
        )}
      </div>

      {/* Actions */}
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onLike(post.id)}
              className={`flex items-center space-x-1 transition-colors ${
                isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
              }`}
            >
              <Heart 
                size={24} 
                className={isLiked ? 'fill-current' : ''} 
              />
              <span className="text-sm">{post.likes}</span>
            </button>
            
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors"
            >
              <MessageCircle size={24} />
              <span className="text-sm">{post.comments.length}</span>
            </button>
            
            <button
              onClick={handleShare}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Share2 size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-white font-semibold">{post.title}</h3>
          <p className="text-gray-300">{post.description}</p>
          
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-800 text-purple-400 px-2 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-gray-800">
            <div className="space-y-3">
              {post.comments.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
              ) : (
                post.comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={comment.userAvatar} alt={comment.username} />
                      <AvatarFallback className="bg-gray-700 text-white text-xs">
                        {comment.username[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="text-white font-semibold">{comment.username}</span>
                        <span className="text-gray-300 ml-2">{comment.content}</span>
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PostCard;
