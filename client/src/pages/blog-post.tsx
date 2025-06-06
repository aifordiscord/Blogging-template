import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Eye, Heart, Share2, Clock } from "lucide-react";
import { Header } from "@/components/header";
import { AdminModal } from "@/components/admin-modal";
import { SeoHead } from "@/components/seo-head";
import { useBlog, useIncrementViews, useToggleLike } from "@/hooks/use-blogs";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [liked, setLiked] = useState(false);
  
  const { data: blog, isLoading, error } = useBlog(id!);
  const incrementViews = useIncrementViews();
  const toggleLike = useToggleLike();
  const { toast } = useToast();

  useEffect(() => {
    if (blog && id) {
      // Increment views when blog loads
      incrementViews.mutate(id);
    }
  }, [blog, id]);

  const handleLike = () => {
    if (!blog) return;
    
    const newLikedState = !liked;
    setLiked(newLikedState);
    
    toggleLike.mutate({ id: blog.id, liked: newLikedState }, {
      onError: () => {
        setLiked(!newLikedState); // Revert on error
        toast({
          title: "Error",
          description: "Failed to update like",
          variant: "destructive",
        });
      }
    });
  };

  const handleShare = async () => {
    if (navigator.share && blog) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Success",
          description: "Link copied to clipboard",
        });
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Success",
        description: "Link copied to clipboard",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header onAdminClick={() => setShowAdminModal(true)} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Loading blog post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header onAdminClick={() => setShowAdminModal(true)} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Blog Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">The blog post you're looking for doesn't exist.</p>
            <Link href="/">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SeoHead blog={blog} url={window.location.href} />
      <Header onAdminClick={() => setShowAdminModal(true)} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-6 text-blue-600 hover:text-blue-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blogs
          </Button>
        </Link>

        {/* Blog Post */}
        <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          {/* Hero Image */}
          <img 
            src={blog.thumbnail} 
            alt={blog.title}
            className="w-full h-64 md:h-96 object-cover"
          />
          
          <div className="p-8 md:p-12">
            {/* Post Meta */}
            <div className="flex items-center space-x-4 mb-6">
              <Badge className={blog.featured ? "bg-gradient-to-r from-yellow-500 to-orange-500" : ""}>
                {blog.category}
              </Badge>
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                Published on {new Date(blog.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {blog.readTime} min read
              </span>
            </div>

            {/* Post Title */}
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {blog.title}
            </h1>

            {/* Author Info */}
            <div className="flex items-center space-x-4 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
              <Avatar className="w-12 h-12">
                <AvatarImage src={blog.authorAvatar} alt={blog.authorName} />
                <AvatarFallback>{blog.authorName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{blog.authorName}</p>
                {blog.authorBio && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{blog.authorBio}</p>
                )}
              </div>
            </div>

            {/* Blog Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            </div>

            {/* Tags */}
            {blog.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Post Actions */}
            <div className="flex items-center justify-between pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={handleLike}
                  className={`flex items-center space-x-2 ${
                    liked ? "text-red-500 hover:text-red-600" : "text-gray-600 dark:text-gray-400 hover:text-red-500"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
                  <span>{blog.likes + (liked ? 1 : 0)} likes</span>
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleShare}
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-500"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </Button>
              </div>
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                <Eye className="w-4 h-4 mr-1" />
                {blog.views.toLocaleString()} views
              </div>
            </div>
          </div>
        </article>
      </div>

      <AdminModal 
        open={showAdminModal} 
        onOpenChange={setShowAdminModal}
        onSuccess={() => setShowAdminModal(false)}
      />
    </div>
  );
}
