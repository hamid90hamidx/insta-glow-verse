
import React, { useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, X } from 'lucide-react';
import { Comment, Post } from '../types/Post';
import { useAuth } from '../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface CommentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
  onAddComment: (postId: string, comment: Comment) => void;
}

const CommentDrawer: React.FC<CommentDrawerProps> = ({ isOpen, onClose, post, onAddComment }) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.username,
      userAvatar: user.avatar,
      content: newComment.trim(),
      timestamp: new Date().toISOString()
    };

    onAddComment(post.id, comment);
    setNewComment('');
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="bg-gray-900 border-gray-800 max-h-[80vh]">
        <DrawerHeader className="border-b border-gray-800">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-white">Comments</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <X size={20} />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {post.comments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
          ) : (
            post.comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={comment.userAvatar} alt={comment.username} />
                  <AvatarFallback className="bg-gray-700 text-white text-sm">
                    {comment.username[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-gray-800 rounded-lg p-3">
                    <p className="text-white font-semibold text-sm">{comment.username}</p>
                    <p className="text-gray-300 text-sm">{comment.content}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        
        {user && (
          <div className="p-4 border-t border-gray-800">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.avatar} alt={user.username} />
                <AvatarFallback className="bg-gray-700 text-white text-sm">
                  {user.username[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 flex space-x-2">
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
                <Button 
                  type="submit" 
                  disabled={!newComment.trim()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Send size={16} />
                </Button>
              </div>
            </form>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default CommentDrawer;
