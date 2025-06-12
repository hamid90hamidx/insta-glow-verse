
import React from 'react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, X, Trash2 } from 'lucide-react';
import { Post } from '../types/Post';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
  onLike: (postId: string) => void;
  onDelete?: (postId: string) => void;
  onComment: () => void;
  currentUserId: string;
}

const PostModal: React.FC<PostModalProps> = ({ 
  isOpen, 
  onClose, 
  post, 
  onLike, 
  onDelete, 
  onComment, 
  currentUserId 
}) => {
  const navigate = useNavigate();
  const isLiked = post.likedBy.includes(currentUserId);
  const canDelete = post.userId === currentUserId;

  const handleUserClick = () => {
    navigate(`/profile/${post.userId}`);
    onClose();
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 max-w-4xl max-h-[90vh] p-0">
        <div className="flex h-full">
          {/* Media Section */}
          <div className="flex-1 bg-black flex items-center justify-center">
            {post.mediaType === 'image' ? (
              <img
                src={post.mediaUrl}
                alt={post.title}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <video
                src={post.mediaUrl}
                className="max-w-full max-h-full object-contain"
                controls
              />
            )}
          </div>
          
          {/* Content Section */}
          <div className="w-96 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
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
              
              <div className="flex items-center space-x-2">
                {canDelete && onDelete && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onDelete(post.id)}
                    className="text-red-400 hover:text-red-500 hover:bg-red-500/10"
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
                <DialogClose asChild>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <X size={20} />
                  </Button>
                </DialogClose>
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <h3 className="text-white font-semibold text-lg">{post.title}</h3>
                  <p className="text-gray-300 mt-2">{post.description}</p>
                </div>
                
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
            </div>
            
            {/* Actions */}
            <div className="p-4 border-t border-gray-800">
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
                    onClick={onComment}
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
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostModal;
