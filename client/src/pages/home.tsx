import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/header";
import { BlogCard } from "@/components/blog-card";
import { BlogSearch } from "@/components/blog-search";
import { AdminModal } from "@/components/admin-modal";
import { AdminPanel } from "@/components/admin-panel";
import { SeoHead } from "@/components/seo-head";
import { useBlogs } from "@/hooks/use-blogs";
import { useAdminAuth } from "@/hooks/use-admin-auth";

const categories = ["All Posts", "Tech", "Design", "Business", "Lifestyle", "Data Science", "Tutorial"];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Posts");
  const [sortBy, setSortBy] = useState("latest");
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const { data: blogs = [], isLoading } = useBlogs(selectedCategory, searchQuery);
  const { isAdmin } = useAdminAuth();

  const handleAdminSuccess = () => {
    setShowAdminModal(false);
    setShowAdminPanel(true);
  };

  // Sort blogs based on selected option
  const sortedBlogs = [...blogs].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return (b.views + b.likes) - (a.views + a.likes);
      case "views":
        return b.views - a.views;
      case "oldest":
        return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
      default: // latest
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    }
  });

  const featuredBlog = sortedBlogs.find(blog => blog.featured);
  const regularBlogs = sortedBlogs.filter(blog => !blog.featured);

  if (showAdminPanel && isAdmin) {
    return <AdminPanel onClose={() => setShowAdminPanel(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <SeoHead 
        title="Ai for discord blog"
        description="Get latest updates about discord and bots and Ai "
      />
      
      <Header onAdminClick={() => setShowAdminModal(true)} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-emerald-500 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Amazing{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              Stories
            </span>
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Explore our collection of insightful articles, tutorials, and stories from passionate writers around the world.
          </p>
          
          <BlogSearch onSearch={setSearchQuery} />
        </div>
      </section>

      {/* Blog Filters & Stats */}
      <section className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            {/* Filter Tags */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Sort Options */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="views">Most Views</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Loading blogs...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery ? "No blogs found matching your search." : "No blogs found."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredBlog && <BlogCard blog={featuredBlog} featured />}
            {regularBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                  </svg>
                </div>
                <span className="text-xl font-bold">Ai for discord blogs</span>
              </div>
              <p className="text-gray-400 mb-4">
                A modern blogging platform for sharing ideas, insights, and stories with the world.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
                <li><a href="https://discord.gg/yGzD5jVFMz" className="hover:text-white transition-colors">Blogs</a></li>
                <li><a href="https://discord.gg/yGzD5jVFMz" className="hover:text-white transition-colors">About</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="https://discord.gg/yGzD5jVFMz" className="hover:text-white transition-colors">Technology</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Design</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Business</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Ai for discord. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <AdminModal 
        open={showAdminModal} 
        onOpenChange={setShowAdminModal}
        onSuccess={handleAdminSuccess}
      />
    </div>
  );
}
