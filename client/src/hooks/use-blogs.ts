import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  increment,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Blog, InsertBlog, UpdateBlog, BlogStats } from "@shared/schema";

const BLOGS_COLLECTION = "blogs";

export function useBlogs(category?: string, searchQuery?: string) {
  return useQuery({
    queryKey: ["blogs", category, searchQuery],
    queryFn: async () => {
      const blogsRef = collection(db, BLOGS_COLLECTION);
      let q = query(
        blogsRef,
        where("published", "==", true),
        orderBy("publishedAt", "desc")
      );

      if (category && category !== "All Posts") {
        q = query(q, where("category", "==", category));
      }

      const snapshot = await getDocs(q);
      const blogs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Blog[];

      if (searchQuery) {
        return blogs.filter(blog => 
          blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }

      return blogs;
    },
  });
}

export function useBlog(id: string) {
  return useQuery({
    queryKey: ["blog", id],
    queryFn: async () => {
      const docRef = doc(db, BLOGS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Blog;
      } else {
        throw new Error("Blog not found");
      }
    },
    enabled: !!id,
  });
}

export function useAdminBlogs() {
  return useQuery({
    queryKey: ["admin-blogs"],
    queryFn: async () => {
      const blogsRef = collection(db, BLOGS_COLLECTION);
      const q = query(blogsRef, orderBy("createdAt", "desc"));
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Blog[];
    },
  });
}

export function useBlogStats() {
  return useQuery({
    queryKey: ["blog-stats"],
    queryFn: async () => {
      const blogsRef = collection(db, BLOGS_COLLECTION);
      const snapshot = await getDocs(blogsRef);
      const blogs = snapshot.docs.map(doc => doc.data()) as Blog[];
      
      const stats: BlogStats = {
        totalBlogs: blogs.length,
        totalViews: blogs.reduce((sum, blog) => sum + (blog.views || 0), 0),
        totalLikes: blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0),
        publishedBlogs: blogs.filter(blog => blog.published).length
      };
      
      return stats;
    },
  });
}

export function useCreateBlog() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (blogData: InsertBlog) => {
      try {
        console.log("Creating blog with data:", blogData);
        
        const now = new Date().toISOString();
        const blogsRef = collection(db, BLOGS_COLLECTION);
        
        const docRef = await addDoc(blogsRef, {
          ...blogData,
          createdAt: now,
          updatedAt: now,
          publishedAt: blogData.published ? now : now, // Set publishedAt when created
          views: 0,
          likes: 0,
          slug: blogData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          metaTitle: blogData.metaTitle || blogData.title,
          metaDescription: blogData.metaDescription || blogData.excerpt
        });
        
        console.log("Blog created successfully with ID:", docRef.id);
        return docRef.id;
      } catch (error) {
        console.error("Error creating blog:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blog-stats"] });
    },
  });
}

export function useUpdateBlog() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updateData }: UpdateBlog & { id: string }) => {
      const docRef = doc(db, BLOGS_COLLECTION, id);
      const now = new Date().toISOString();
      
      // If the blog is being published for the first time, set publishedAt
      const updatePayload: any = {
        ...updateData,
        updatedAt: now
      };
      
      // If publishing the blog, update publishedAt
      if (updateData.published === true) {
        updatePayload.publishedAt = now;
      }
      
      await updateDoc(docRef, updatePayload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blog-stats"] });
    },
  });
}

export function useDeleteBlog() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const docRef = doc(db, BLOGS_COLLECTION, id);
      await deleteDoc(docRef);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blog-stats"] });
    },
  });
}

export function useIncrementViews() {
  return useMutation({
    mutationFn: async (id: string) => {
      const docRef = doc(db, BLOGS_COLLECTION, id);
      await updateDoc(docRef, {
        views: increment(1)
      });
    },
  });
}

export function useToggleLike() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, liked }: { id: string; liked: boolean }) => {
      const docRef = doc(db, BLOGS_COLLECTION, id);
      await updateDoc(docRef, {
        likes: increment(liked ? 1 : -1)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blog"] });
    },
  });
}
