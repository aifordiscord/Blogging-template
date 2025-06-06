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
