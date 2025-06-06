import { z } from "zod";

// Blog schema
export const blogSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  thumbnail: z.string().url("Must be a valid URL"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  views: z.number().default(0),
  likes: z.number().default(0),
  readTime: z.number().default(5),
  authorName: z.string().min(1, "Author name is required"),
  authorAvatar: z.string().url("Must be a valid URL"),
  authorBio: z.string().optional(),
  publishedAt: z.string(),
  updatedAt: z.string(),
  createdAt: z.string(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  seoKeywords: z.array(z.string()).default([])
});

export const insertBlogSchema = blogSchema.omit({
  id: true,
  views: true,
  likes: true,
  createdAt: true,
  updatedAt: true
});

export const updateBlogSchema = insertBlogSchema.partial();

export type Blog = z.infer<typeof blogSchema>;
export type InsertBlog = z.infer<typeof insertBlogSchema>;
export type UpdateBlog = z.infer<typeof updateBlogSchema>;

// Admin user schema
export const adminUserSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  displayName: z.string().optional(),
  isAdmin: z.boolean().default(true)
});

export type AdminUser = z.infer<typeof adminUserSchema>;

// Blog stats schema
export const blogStatsSchema = z.object({
  totalBlogs: z.number(),
  totalViews: z.number(),
  totalLikes: z.number(),
  publishedBlogs: z.number()
});

export type BlogStats = z.infer<typeof blogStatsSchema>;
