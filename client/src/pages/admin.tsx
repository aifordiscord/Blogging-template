import { useEffect } from "react";
import { useLocation } from "wouter";
import { AdminPanel } from "@/components/admin-panel";
import { useAdminAuth } from "@/hooks/use-admin-auth";

export default function Admin() {
  const [, setLocation] = useLocation();
  const { isAdmin, loading } = useAdminAuth();

  useEffect(() => {
    if (!loading && !isAdmin) {
      setLocation("/");
    }
  }, [isAdmin, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return <AdminPanel onClose={() => setLocation("/")} />;
}
