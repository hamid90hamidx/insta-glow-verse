
export interface Comment {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  content: string;
  timestamp: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  followers: string[];
  following: string[];
  posts: number;
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  tags: string[];
  likes: number;
  likedBy: string[];
  comments: Comment[];
  timestamp: string;
}
