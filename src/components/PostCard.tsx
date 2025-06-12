
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Share2, MoreHorizontal, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Post, Comment } from '../types/Post';
import { formatDistanceToNow } from 'date-fns';
import CommentDrawer from './CommentDrawer';

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onDelete?: (postId: string) => void;
  onAddComment: (postId: string, comment: Comment) => void;
  currentUserId: string;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onDelete, onAddComment, currentUserId }) => {
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(false);
  const isLiked = post.likedBy.includes(currentUserId);
  const canDelete = post.userId === currentUserId;

  const handleUserClick = () => {
    navigate(`/profile/${post.userId}`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.description,
        url: window.location.href,
      }).catch(() => {
        navigator.clipboard.writeText(window.location.href);
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <>
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
          
          {canDelete && onDelete && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <MoreHorizontal size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-800 border-gray-700">
                <DropdownMenuItem 
                  onClick={() => onDelete(post.id)}
                  className="text-red-400 hover:text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete Post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
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
                onClick={() => setShowComments(true)}
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
        </CardContent>
      </Card>

      <CommentDrawer
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        post={post}
        onAddComment={onAddComment}
      />
    </>
  );
};

export default PostCard;
