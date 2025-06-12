
# SocialVibe - Instagram-Like Social Media App

A modern, dark-themed social media platform built with React, TypeScript, and Vite. Share your moments, connect with friends, and discover amazing content in a sleek, Instagram-inspired interface.

## 🌟 What Makes SocialVibe Special

- **🌙 Dark Theme**: Beautiful dark interface that's easy on the eyes
- **📱 Instagram-Like Design**: Familiar and intuitive user experience
- **🎥 Media Support**: Upload both images and videos
- **💾 Persistent Data**: All your posts, comments, and profile data are safely stored
- **👥 Multi-User System**: Multiple users can use the app simultaneously
- **🔄 Real-time Interactions**: Like, comment, and follow users instantly
- **📱 Responsive Design**: Works perfectly on desktop and mobile devices

## 🚀 Key Features

### Authentication System
- **Secure Login/Signup**: Create an account or sign in to access your profile
- **Data Persistence**: Your data remains safe even after logging out and back in
- **Loading Screen**: Beautiful animated loading screen when starting the app

### Content Creation & Sharing
- **Media Upload**: Upload images or videos with ease
- **Rich Posts**: Add titles, descriptions, and tags to your content
- **Instant Publishing**: Share your moments with the community immediately

### Social Interactions
- **Like System**: Like and unlike posts with instant feedback
- **Comment System**: 
  - Sliding comment drawer from the bottom (mobile-friendly)
  - Real-time commenting with other users
  - View all comments on any post
- **Follow/Unfollow**: Build your network by following other users

### Profile Management
- **Custom Avatars**: Upload and change your profile picture
- **Profile Views**: Click on any user's avatar to view their profile
- **Post Gallery**: All your posts displayed in a beautiful grid
- **Post Modal**: Click on any post in your profile to view it in detail
- **User Stats**: See follower count, following count, and total posts

### Post Management
- **Delete Posts**: Remove your own posts (only yours, not others')
- **Post Details**: View posts in full-screen modal with all interactions
- **Media Playback**: Videos play with full controls

## 🎯 How to Use the App

### Getting Started
1. **First Launch**: You'll see a beautiful loading screen
2. **Authentication**: Sign up for a new account or log in to existing one
3. **Home Feed**: Browse posts from all users in the community

### Creating Your First Post
1. Click the **Upload** button in the header
2. **Select Media**: Choose an image or video from your device
3. **Add Details**: 
   - Write an engaging title
   - Add a description
   - Include relevant tags (separated by commas)
4. **Publish**: Hit "Share Post" to publish to the community

### Interacting with Posts
- **Like**: Double-tap or click the heart icon
- **Comment**: Click the comment icon to open the comment drawer
- **View Profile**: Click on the user's avatar or username
- **Delete**: Use the three-dots menu (only available on your own posts)

### Managing Your Profile
1. **Upload Avatar**: 
   - Go to your profile
   - Click on your current avatar
   - Select a new image to upload
2. **View Your Posts**: All your posts appear in a grid layout
3. **Post Details**: Click any post to view it in full detail

### Following Users
- Visit any user's profile by clicking their avatar
- Click "Follow" to add them to your network
- Click "Unfollow" to remove them from your network
- View follower/following counts on profiles

## 🛠 Technical Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS with custom dark theme
- **UI Components**: Shadcn/ui for consistent design
- **Icons**: Lucide React for beautiful icons
- **Routing**: React Router for navigation
- **State Management**: React Context for authentication
- **Data Storage**: LocalStorage for persistent data

## 📱 Project Setup

### Prerequisites
- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation Steps

```sh
# Step 1: Clone the repository
git clone https://github.com/Ahmadjamil888/insta-glow-verse.git

# Step 2: Navigate to the project directory
cd insta-glow-verse

# Step 3: Install dependencies
npm i

# Step 4: Start the development server
npm run dev
```

## 🌐 Deployment

The easiest way to deploy your SocialVibe app:

1. Open [Lovable](https://lovable.dev/projects/00174642-99b8-469e-85a2-df25681b0bcb)
2. Click on **Share → Publish**
3. Your app will be live instantly!

### Custom Domain
You can connect a custom domain through:
- **Project > Settings > Domains** in Lovable
- Click **Connect Domain**
- [Domain setup guide](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## 🎨 Design Philosophy

SocialVibe embraces a **dark-first design** with:
- **Purple-Pink Gradients**: Beautiful accent colors throughout
- **Clean Typography**: Easy-to-read text hierarchy
- **Smooth Animations**: Subtle transitions for better UX
- **Mobile-First**: Responsive design that works everywhere
- **Accessibility**: High contrast and keyboard navigation support

## 🔧 Development Features

- **Hot Reload**: Instant updates during development
- **TypeScript**: Full type safety for robust code
- **Component Library**: Reusable UI components
- **Responsive Design**: Mobile and desktop optimized
- **Error Handling**: Graceful error states and recovery

## 🎪 Special Features

### Real-time Experience
- **Instant Updates**: All interactions update immediately
- **Persistent Sessions**: Your login state persists across browser sessions
- **Data Integrity**: All user data, posts, and interactions are safely stored

### User Experience
- **Intuitive Navigation**: Familiar Instagram-like interface
- **Smooth Interactions**: Animated transitions and hover effects
- **Visual Feedback**: Loading states and success messages
- **Error Prevention**: Form validation and user guidance

### Privacy & Security
- **User Isolation**: Each user's data is completely separate
- **Post Ownership**: Only delete your own content
- **Safe Storage**: Local data storage with proper data structure

