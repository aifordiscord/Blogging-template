import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User 
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { AdminUser } from "@shared/schema";

export function useAdminAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const adminQuery = useQuery({
    queryKey: ["admin-user", user?.uid],
    queryFn: async () => {
      if (!user) return null;
      
      const adminDoc = await getDoc(doc(db, "admins", user.uid));
      if (adminDoc.exists()) {
        return { uid: user.uid, email: user.email!, ...adminDoc.data() } as AdminUser;
      }
      return null;
    },
    enabled: !!user,
  });

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Create admin document if it doesn't exist
      const adminDoc = await getDoc(doc(db, "admins", result.user.uid));
      if (!adminDoc.exists()) {
        await setDoc(doc(db, "admins", result.user.uid), {
          email: result.user.email,
          displayName: result.user.displayName || "Admin",
          isAdmin: true,
          createdAt: new Date().toISOString()
        });
      }
      
      return result.user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-user"] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await signOut(auth);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-user"] });
    },
  });

  return {
    user,
    isAdmin: adminQuery.data?.isAdmin || false,
    loading: loading || adminQuery.isLoading,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
  };
}
