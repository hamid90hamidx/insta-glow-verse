
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Image, Video, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Post } from '../types/Post';

const UploadPage = () => {
  const { user, getAllUsers } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    mediaUrl: '',
    mediaType: 'image' as 'image' | 'video'
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate file upload - in a real app, you'd upload to a cloud service
      const fakeUrl = URL.createObjectURL(file);
      setFormData({
        ...formData,
        mediaUrl: fakeUrl,
        mediaType: file.type.startsWith('video/') ? 'video' : 'image'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.mediaUrl) return;

    setIsUploading(true);

    try {
      // Create new post
      const newPost: Post = {
        id: Date.now().toString(),
        userId: user.id,
        username: user.username,
        userAvatar: user.avatar || '',
        title: formData.title,
        description: formData.description,
        mediaUrl: formData.mediaUrl,
        mediaType: formData.mediaType,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        likes: 0,
        likedBy: [],
        comments: [],
        timestamp: new Date().toISOString()
      };

      // Save to localStorage with better organization
      const existingPosts = JSON.parse(localStorage.getItem('socialapp_posts') || '[]');
      const updatedPosts = [newPost, ...existingPosts];
      localStorage.setItem('socialapp_posts', JSON.stringify(updatedPosts));

      // Update user's post count
      const users = getAllUsers();
      const updatedUsers = users.map(u => 
        u.id === user.id ? { ...u, posts: u.posts + 1 } : u
      );
      localStorage.setItem('socialapp_users', JSON.stringify(updatedUsers));
      localStorage.setItem('socialapp_user', JSON.stringify({ ...user, posts: user.posts + 1 }));

      toast({
        title: "Post uploaded!",
        description: "Your post has been shared successfully.",
      });

      navigate('/home');
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="max-w-2xl mx-auto pt-20 pb-8 px-4">
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <Upload size={24} />
              Create New Post
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Media Upload */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-300">
                  Upload Image or Video
                </label>
                
                {!formData.mediaUrl ? (
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-purple-500 transition-colors">
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="media-upload"
                    />
                    <label htmlFor="media-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="bg-gray-800 p-3 rounded-full">
                          <Upload size={24} className="text-gray-400" />
                        </div>
                        <p className="text-gray-400">Click to upload media</p>
                        <p className="text-xs text-gray-500">Supports images and videos</p>
                      </div>
                    </label>
                  </div>
                ) : (
                  <div className="relative rounded-lg overflow-hidden">
                    {formData.mediaType === 'image' ? (
                      <img
                        src={formData.mediaUrl}
                        alt="Preview"
                        className="w-full h-64 object-cover"
                      />
                    ) : (
                      <video
                        src={formData.mediaUrl}
                        className="w-full h-64 object-cover"
                        controls
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, mediaUrl: '', mediaType: 'image' })}
                      className="absolute top-2 right-2 bg-black/50 p-1 rounded-full hover:bg-black/70"
                    >
                      <X size={16} className="text-white" />
                    </button>
                  </div>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title
                </label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500"
                  placeholder="Give your post a title..."
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500 min-h-24"
                  placeholder="Share what's on your mind..."
                  required
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tags
                </label>
                <Input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500"
                  placeholder="life, photography, travel (separate with commas)"
                />
                <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isUploading || !formData.mediaUrl || !formData.title}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                {isUploading ? 'Uploading...' : 'Share Post'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default UploadPage;
