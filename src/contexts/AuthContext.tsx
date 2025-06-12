
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  followers: string[];
  following: string[];
  posts: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateAvatar: (avatarUrl: string) => void;
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
  getAllUsers: () => User[];
  getUserById: (userId: string) => User | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on app start
    const storedUser = localStorage.getItem('socialapp_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const getAllUsers = (): User[] => {
    const users = localStorage.getItem('socialapp_users');
    return users ? JSON.parse(users) : [];
  };

  const getUserById = (userId: string): User | null => {
    const users = getAllUsers();
    return users.find(u => u.id === userId) || null;
  };

  const updateUsersStorage = (updatedUsers: User[]) => {
    localStorage.setItem('socialapp_users', JSON.stringify(updatedUsers));
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user exists
      const users = getAllUsers();
      const existingUser = users.find(u => u.email === email);
      
      if (existingUser) {
        setUser(existingUser);
        localStorage.setItem('socialapp_user', JSON.stringify(existingUser));
      } else {
        const userData: User = {
          id: Date.now().toString(),
          username: email.split('@')[0],
          email,
          avatar: `https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=150&h=150&fit=crop&crop=face`,
          followers: [],
          following: [],
          posts: 0
        };
        
        const updatedUsers = [...users, userData];
        updateUsersStorage(updatedUsers);
        setUser(userData);
        localStorage.setItem('socialapp_user', JSON.stringify(userData));
      }
      
      setIsLoading(false);
      return true;
    } catch (error) {
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (username: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const users = getAllUsers();
      const userData: User = {
        id: Date.now().toString(),
        username,
        email,
        avatar: `https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=150&h=150&fit=crop&crop=face`,
        followers: [],
        following: [],
        posts: 0
      };
      
      const updatedUsers = [...users, userData];
      updateUsersStorage(updatedUsers);
      setUser(userData);
      localStorage.setItem('socialapp_user', JSON.stringify(userData));
      setIsLoading(false);
      return true;
    } catch (error) {
      setIsLoading(false);
      return false;
    }
  };

  const updateAvatar = (avatarUrl: string) => {
    if (!user) return;
    
    const updatedUser = { ...user, avatar: avatarUrl };
    const users = getAllUsers();
    const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
    
    updateUsersStorage(updatedUsers);
    setUser(updatedUser);
    localStorage.setItem('socialapp_user', JSON.stringify(updatedUser));
  };

  const followUser = (userId: string) => {
    if (!user || user.id === userId) return;
    
    const users = getAllUsers();
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return;
    
    const updatedUser = {
      ...user,
      following: [...user.following, userId]
    };
    
    const updatedTargetUser = {
      ...targetUser,
      followers: [...targetUser.followers, user.id]
    };
    
    const updatedUsers = users.map(u => {
      if (u.id === user.id) return updatedUser;
      if (u.id === userId) return updatedTargetUser;
      return u;
    });
    
    updateUsersStorage(updatedUsers);
    setUser(updatedUser);
    localStorage.setItem('socialapp_user', JSON.stringify(updatedUser));
  };

  const unfollowUser = (userId: string) => {
    if (!user || user.id === userId) return;
    
    const users = getAllUsers();
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return;
    
    const updatedUser = {
      ...user,
      following: user.following.filter(id => id !== userId)
    };
    
    const updatedTargetUser = {
      ...targetUser,
      followers: targetUser.followers.filter(id => id !== user.id)
    };
    
    const updatedUsers = users.map(u => {
      if (u.id === user.id) return updatedUser;
      if (u.id === userId) return updatedTargetUser;
      return u;
    });
    
    updateUsersStorage(updatedUsers);
    setUser(updatedUser);
    localStorage.setItem('socialapp_user', JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('socialapp_user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup, 
      logout, 
      updateAvatar, 
      followUser, 
      unfollowUser, 
      getAllUsers, 
      getUserById, 
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
