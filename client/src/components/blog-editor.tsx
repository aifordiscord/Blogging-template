import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { X, Save, Eye } from "lucide-react";
import { useCreateBlog, useUpdateBlog } from "@/hooks/use-blogs";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import type { Blog, InsertBlog } from "@shared/schema";

interface BlogEditorProps {
  blog?: Blog | null;
  onSave: () => void;
  onCancel: () => void;
}

export function BlogEditor({ blog, onSave, onCancel }: BlogEditorProps) {
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    thumbnail: "",
    category: "",
    tags: [] as string[],
    published: false,
    featured: false,
    readTime: 5,
    authorName: "Admin",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    authorBio: "Blog Administrator",
    publishedAt: new Date().toISOString(),
    metaTitle: "",
    metaDescription: "",
    seoKeywords: [] as string[]
  });

  const [tagInput, setTagInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [activeTab, setActiveTab] = useState("content");

  const createBlog = useCreateBlog();
  const updateBlog = useUpdateBlog();
  const { toast } = useToast();

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title,
        excerpt: blog.excerpt,
        content: blog.content,
        thumbnail: blog.thumbnail,
        category: blog.category,
        tags: blog.tags,
        published: blog.published,
        featured: blog.featured,
        readTime: blog.readTime,
        authorName: blog.authorName,
        authorAvatar: blog.authorAvatar,
        authorBio: blog.authorBio || "",
        publishedAt: blog.publishedAt,
        metaTitle: blog.metaTitle || "",
        metaDescription: blog.metaDescription || "",
        seoKeywords: blog.seoKeywords
      });
    }
  }, [blog]);

  const handleSave = () => {
    if (!formData.title || !formData.content || !formData.excerpt) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const blogData: InsertBlog = {
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      thumbnail: formData.thumbnail,
      category: formData.category,
      tags: formData.tags,
      published: formData.published,
      featured: formData.featured,
      readTime: formData.readTime,
      authorName: formData.authorName,
      authorAvatar: formData.authorAvatar,
      authorBio: formData.authorBio,
      publishedAt: formData.publishedAt,
      metaTitle: formData.metaTitle || formData.title,
      metaDescription: formData.metaDescription || formData.excerpt,
      seoKeywords: formData.seoKeywords
    };

    if (blog) {
      updateBlog.mutate({ id: blog.id, ...blogData }, {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Blog updated successfully",
          });
          onSave();
        },
        onError: (error: any) => {
          console.error("Blog update error:", error);
          toast({
            title: "Error",
            description: error?.message || "Failed to update blog",
            variant: "destructive",
          });
        }
      });
    } else {
      createBlog.mutate(blogData, {
        onSuccess: (blogId) => {
          console.log("Blog created successfully with ID:", blogId);
          toast({
            title: "Success",
            description: "Blog created successfully! It will appear in the blog list shortly.",
          });
          onSave();
        },
        onError: (error: any) => {
          console.error("Blog creation error:", error);
          toast({
            title: "Error",
            description: error?.message || "Failed to create blog. Please try again.",
            variant: "destructive",
          });
        }
      });
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.seoKeywords.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        seoKeywords: [...prev.seoKeywords, keywordInput.trim()]
      }));
      setKeywordInput("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      seoKeywords: prev.seoKeywords.filter(k => k !== keyword)
    }));
  };

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {blog ? "Edit Blog" : "Create New Blog"}
          </h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={createBlog.isPending || updateBlog.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {createBlog.isPending || updateBlog.isPending ? "Saving..." : "Save Blog"}
            </Button>
          </div>
        </div>

        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter blog title..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="excerpt">Excerpt *</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                      placeholder="Brief description of the blog..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="thumbnail">Thumbnail URL *</Label>
                    <Input
                      id="thumbnail"
                      value={formData.thumbnail}
                      onChange={(e) => setFormData(prev => ({ ...prev, thumbnail: e.target.value }))}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        placeholder="Tech, Design, etc."
                      />
                    </div>
                    <div>
                      <Label htmlFor="readTime">Read Time (minutes)</Label>
                      <Input
                        id="readTime"
                        type="number"
                        value={formData.readTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, readTime: parseInt(e.target.value) || 5 }))}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  {formData.thumbnail && (
                    <div>
                      <Label>Thumbnail Preview</Label>
                      <img 
                        src={formData.thumbnail} 
                        alt="Thumbnail preview"
                        className="w-full h-48 object-cover rounded-lg border"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="content">Content * (Markdown supported)</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your blog content here using Markdown..."
                  rows={20}
                  className="font-mono"
                />
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Publication Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="published">Published</Label>
                      <Switch
                        id="published"
                        checked={formData.published}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="featured">Featured</Label>
                      <Switch
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Author Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="authorName">Author Name</Label>
                      <Input
                        id="authorName"
                        value={formData.authorName}
                        onChange={(e) => setFormData(prev => ({ ...prev, authorName: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="authorAvatar">Author Avatar URL</Label>
                      <Input
                        id="authorAvatar"
                        value={formData.authorAvatar}
                        onChange={(e) => setFormData(prev => ({ ...prev, authorAvatar: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="authorBio">Author Bio</Label>
                      <Textarea
                        id="authorBio"
                        value={formData.authorBio}
                        onChange={(e) => setFormData(prev => ({ ...prev, authorBio: e.target.value }))}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-4">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add a tag..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button onClick={addTag} type="button">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-2">
                        {tag}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTag(tag)}
                          className="h-auto p-0 hover:bg-transparent"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seo" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>SEO Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input
                      id="metaTitle"
                      value={formData.metaTitle}
                      onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                      placeholder="SEO title (defaults to blog title)"
                    />
                  </div>
                  <div>
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea
                      id="metaDescription"
                      value={formData.metaDescription}
                      onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                      placeholder="SEO description (defaults to excerpt)"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>SEO Keywords</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-4">
                    <Input
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      placeholder="Add SEO keyword..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                    />
                    <Button onClick={addKeyword} type="button">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.seoKeywords.map((keyword) => (
                      <Badge key={keyword} variant="outline" className="flex items-center gap-2">
                        {keyword}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeKeyword(keyword)}
                          className="h-auto p-0 hover:bg-transparent"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Blog Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {formData.thumbnail && (
                      <img 
                        src={formData.thumbnail} 
                        alt="Blog thumbnail"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        {formData.title || "Blog Title"}
                      </h1>
                      <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                        {formData.excerpt || "Blog excerpt..."}
                      </p>
                      <div className="flex items-center gap-4 mb-8">
                        <Badge>{formData.category || "Category"}</Badge>
                        <span className="text-sm text-gray-500">{formData.readTime} min read</span>
                      </div>
                    </div>
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                      <ReactMarkdown skipHtml={false}>
                        {formData.content || "Blog content will appear here..."}
                      </ReactMarkdown>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
