import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Eye, 
  Heart, 
  CheckCircle, 
  Edit, 
  Trash2, 
  Plus,
  LogOut,
  FileText
} from "lucide-react";
import { useAdminBlogs, useBlogStats, useDeleteBlog } from "@/hooks/use-blogs";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { useToast } from "@/hooks/use-toast";
import { BlogEditor } from "./blog-editor";
import type { Blog } from "@shared/schema";

interface AdminPanelProps {
  onClose: () => void;
}

export function AdminPanel({ onClose }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  
  const { logout } = useAdminAuth();
  const { data: blogs = [], isLoading: blogsLoading } = useAdminBlogs();
  const { data: stats } = useBlogStats();
  const deleteBlog = useDeleteBlog();
  const { toast } = useToast();

  const handleDelete = (blog: Blog) => {
    if (window.confirm(`Are you sure you want to delete "${blog.title}"?`)) {
      deleteBlog.mutate(blog.id, {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Blog deleted successfully",
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to delete blog",
            variant: "destructive",
          });
        }
      });
    }
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setShowEditor(true);
    setActiveTab("editor");
  };

  const handleNewBlog = () => {
    setEditingBlog(null);
    setShowEditor(true);
    setActiveTab("editor");
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  if (showEditor) {
    return (
      <BlogEditor
        blog={editingBlog}
        onSave={() => {
          setShowEditor(false);
          setEditingBlog(null);
          setActiveTab("blogs");
        }}
        onCancel={() => {
          setShowEditor(false);
          setEditingBlog(null);
          setActiveTab("blogs");
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-100 dark:bg-gray-900 z-50">
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-gray-800 shadow-lg">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white">Admin Panel</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Content Management</p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-2">
            <Button
              variant={activeTab === "dashboard" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("dashboard")}
            >
              <BarChart3 className="w-4 h-4 mr-3" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === "blogs" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("blogs")}
            >
              <FileText className="w-4 h-4 mr-3" />
              All Blogs
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleNewBlog}
            >
              <Plus className="w-4 h-4 mr-3" />
              Write Blog
            </Button>
          </nav>

          <div className="absolute bottom-4 left-4 right-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-3" />
              Logout
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="bg-white dark:bg-gray-800 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {activeTab === "dashboard" ? "Dashboard" : "All Blogs"}
              </h1>
              <div className="flex items-center gap-4">
                <Button onClick={handleNewBlog} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  New Blog
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Close Panel
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsContent value="dashboard">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Total Blogs</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {stats?.totalBlogs || 0}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {stats?.totalViews?.toLocaleString() || 0}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                          <Eye className="w-6 h-6 text-emerald-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Total Likes</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {stats?.totalLikes?.toLocaleString() || 0}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                          <Heart className="w-6 h-6 text-red-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Published</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {stats?.publishedBlogs || 0}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-purple-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Blogs */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Blogs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {blogsLoading ? (
                      <p>Loading...</p>
                    ) : (
                      <div className="space-y-4">
                        {blogs.slice(0, 5).map((blog) => (
                          <div key={blog.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 dark:text-white">{blog.title}</h4>
                              <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                <span>{blog.category}</span>
                                <span>{blog.readTime} min read</span>
                                <Badge variant={blog.published ? "default" : "secondary"}>
                                  {blog.published ? "Published" : "Draft"}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(blog)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDelete(blog)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="blogs">
                <Card>
                  <CardContent className="p-6">
                    {blogsLoading ? (
                      <p>Loading blogs...</p>
                    ) : (
                      <div className="space-y-4">
                        {blogs.map((blog) => (
                          <div key={blog.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 dark:text-white">{blog.title}</h4>
                              <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                <span>{blog.category}</span>
                                <span>{blog.views} views</span>
                                <span>{blog.likes} likes</span>
                                <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                                <Badge variant={blog.published ? "default" : "secondary"}>
                                  {blog.published ? "Published" : "Draft"}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(blog)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDelete(blog)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
