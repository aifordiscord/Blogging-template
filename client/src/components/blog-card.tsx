import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, Heart, Clock } from "lucide-react";
import { Link } from "wouter";
import type { Blog } from "@shared/schema";

interface BlogCardProps {
  blog: Blog;
  featured?: boolean;
}

export function BlogCard({ blog, featured = false }: BlogCardProps) {
  const cardClasses = featured 
    ? "md:col-span-2 lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
    : "bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer";

  const imageHeight = featured ? "h-64" : "h-48";

  return (
    <Link href={`/blog/${blog.id}`}>
      <Card className={cardClasses}>
        <div className="group-hover:-translate-y-1 transition-transform duration-300">
          <img 
            src={blog.thumbnail} 
            alt={blog.title}
            className={`w-full ${imageHeight} object-cover`}
          />
          
          <CardContent className={featured ? "p-8" : "p-6"}>
            {/* Badges and Stats */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {featured && (
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-semibold">
                    FEATURED
                  </Badge>
                )}
                <Badge variant="secondary" className="text-xs">
                  {blog.category}
                </Badge>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {blog.views}
                </span>
                <span className="flex items-center">
                  <Heart className="w-4 h-4 mr-1" />
                  {blog.likes}
                </span>
              </div>
            </div>

            {/* Title and Excerpt */}
            <h3 className={`font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors ${
              featured ? "text-2xl" : "text-lg"
            }`}>
              {blog.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">
              {blog.excerpt}
            </p>

            {/* Author and Meta */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={blog.authorAvatar} alt={blog.authorName} />
                  <AvatarFallback>{blog.authorName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {blog.authorName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(blog.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {blog.readTime} min read
                </span>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
}
