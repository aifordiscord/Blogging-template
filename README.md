# BlogHub - Advanced Blogging Platform

A modern, feature-rich blogging platform built with React, Tailwind CSS, and Firebase. Features include admin panel, markdown support, SEO optimization, and more.

## Features

### 🎨 Frontend
- **Modern Design**: Clean, responsive design with Tailwind CSS
- **Dark/Light Mode**: Theme toggle with system preference detection
- **Advanced Blog Cards**: Thumbnails, view counts, timestamps, and author info
- **Search Functionality**: Search across blog titles, content, and tags
- **SEO Optimized**: Auto-generated meta tags, Open Graph, and structured data
- **Markdown Support**: Full markdown rendering with syntax highlighting
- **Responsive Layout**: Works perfectly on all devices

### 🔐 Admin Features
- **Firebase Authentication**: Secure admin-only login
- **Admin Dashboard**: Statistics and overview of all blogs
- **Blog Management**: Create, edit, delete, and manage blog posts
- **Rich Editor**: Advanced blog editor with live preview
- **SEO Settings**: Custom meta titles, descriptions, and keywords
- **Draft System**: Save drafts and publish when ready

### 📊 Analytics & Features
- **View Tracking**: Automatic view counting for each blog post
- **Like System**: Interactive like/unlike functionality
- **Categories & Tags**: Organize content with categories and tags
- **Featured Posts**: Highlight important blog posts
- **Social Sharing**: Built-in sharing functionality

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Routing**: Wouter
- **Firebase**: Authentication, Firestore, Storage
- **UI Components**: Shadcn/ui
- **Markdown**: React Markdown with syntax highlighting
- **SEO**: React Helmet Async
- **Icons**: Lucide React

## Prerequisites

Before setting up the project, make sure you have:

1. **Node.js 18+** installed on your machine
2. **Firebase account** and project set up
3. **Basic knowledge** of React and Firebase

## Firebase Setup

### 1. Create Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Follow the setup wizard to create your project

### 2. Enable Firebase Services

#### Enable Authentication
1. Go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** authentication
3. Add your domain to **Authorized domains** (for production)

#### Enable Firestore Database
1. Go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (configure security rules later)
4. Select your preferred location

#### Enable Storage (Optional)
1. Go to **Storage**
2. Click **Get started**
3. Configure security rules as needed

### 3. Get Firebase Configuration

1. Go to **Project Settings** > **General**
2. Scroll down to **Your apps** section
3. Click **Add app** > **Web** (</> icon)
4. Register your app with a nickname
5. Copy the Firebase configuration object

## Environment Setup

Create a `.env.local` file in the root directory and add your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
```

## Installation & Setup

### 1. Clone or Download the Project

If you're using this project, ensure all files are in your working directory.

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Add your Firebase configuration to the Replit Secrets or create a `.env.local` file:

- `VITE_FIREBASE_API_KEY` - Your Firebase API key
- `VITE_FIREBASE_PROJECT_ID` - Your Firebase project ID  
- `VITE_FIREBASE_APP_ID` - Your Firebase app ID

### 4. Set Up Firebase Firestore Security Rules

In your Firebase Console, go to Firestore Database > Rules and update with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read access to published blogs
    match /blogs/{blogId} {
      allow read: if resource.data.published == true;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    
    // Allow admin access to admin collection
    match /admins/{adminId} {
      allow read, write: if request.auth != null && request.auth.uid == adminId;
    }
  }
}
```

### 5. Create Your First Admin User

1. Start the application: `npm run dev`
2. Click the "Admin" button in the header
3. Try to login with your desired admin credentials
4. If the user doesn't exist, create it manually in Firebase:
   - Go to Firebase Console > Authentication
   - Click "Add user" and create a user with email/password
   - Go to Firestore Database
   - Create a new collection called "admins"
   - Add a document with the user's UID as the document ID
   - Add fields: `email`, `isAdmin: true`, `displayName`

### 6. Start the Application

```bash
npm run dev
```

The application will be available at the provided URL.

## Usage Guide

### For Admins

1. **Login**: Click "Admin" in the header and login with your credentials
2. **Dashboard**: View blog statistics and recent posts
3. **Create Blog**: Click "New Blog" to create a new post
4. **Edit Blog**: Click the edit icon next to any blog post
5. **Manage Content**: Use the rich editor with markdown support
6. **SEO Settings**: Configure meta titles, descriptions, and keywords
7. **Publish**: Toggle the "Published" switch to make posts live

### For Visitors

1. **Browse Blogs**: View all published blog posts on the homepage
2. **Search**: Use the search bar to find specific content
3. **Categories**: Filter posts by category using the filter buttons
4. **Read Posts**: Click on any blog card to read the full article
5. **Interact**: Like posts and share them on social media
6. **Dark Mode**: Toggle between light and dark themes

## Features Breakdown

### Blog Management
- **Rich Editor**: Markdown support with live preview
- **Image Support**: Add thumbnails and images via URLs
- **Categories & Tags**: Organize content effectively
- **Draft System**: Save drafts before publishing
- **SEO Optimization**: Custom meta tags and structured data

### User Experience
- **Responsive Design**: Works on all screen sizes
- **Fast Loading**: Optimized performance with React Query
- **Search Functionality**: Find content quickly
- **Social Sharing**: Built-in sharing capabilities
- **View Tracking**: Automatic view counting

### Technical Features
- **Firebase Integration**: Real-time database and authentication
- **SEO Ready**: Meta tags, Open Graph, and structured data
- **TypeScript**: Full type safety throughout the application
- **Modern UI**: Clean design with Tailwind CSS
- **Dark Mode**: System preference detection and manual toggle

## Blog Post URLs

All blog posts are automatically accessible at:
```
/blog/{blog-id}
```

Each blog post gets auto-generated SEO-friendly meta tags including:
- Title and description
- Open Graph tags for social sharing
- Structured data for search engines
- Canonical URLs

## Troubleshooting

### Common Issues

1. **Firebase Connection Errors**
   - Verify your Firebase configuration keys
   - Check that Firestore and Authentication are enabled
   - Ensure your domain is added to Firebase authorized domains

2. **Admin Login Issues**
   - Make sure the user exists in Firebase Authentication
   - Verify the admin document exists in Firestore
   - Check Firestore security rules allow admin access

3. **Blog Posts Not Showing**
   - Ensure blogs are marked as "published"
   - Check Firestore security rules allow read access
   - Verify the blogs collection exists in Firestore

4. **Image Loading Issues**
   - Use direct image URLs (not file uploads)
   - Ensure images are publicly accessible
   - Check image URLs are valid and working

## Deployment

### Replit Deployment

1. Ensure all environment variables are set in Replit Secrets
2. Click the "Deploy" button in your Replit project
3. Your blog will be available at your-repl-name.replit.app

### Other Platforms

For deployment on Vercel, Netlify, or other platforms:

1. Set environment variables in your platform's dashboard
2. Build the project: `npm run build`
3. Deploy the `dist` folder
4. Update Firebase authorized domains with your production URL

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the [MIT License](LICENSE).
