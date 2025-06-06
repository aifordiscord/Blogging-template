import { Button } from "@/components/ui/button";
import { Moon, Sun, Shield } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { Link } from "wouter";

interface HeaderProps {
  onAdminClick: () => void;
}

export function Header({ onAdminClick }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <Link href="/">
            <div className="flex items-center space-x-4 cursor-pointer">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                  </svg>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">Aifor-dsblog</span>
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-blue-600 dark:text-blue-400 font-medium">
              Home
            </Link>
            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors">
              Blogs
            </Link>
            <Link href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors">
              About
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
            
            {/* Admin Login */}
            <Button 
              onClick={onAdminClick}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              <Shield className="w-4 h-4 mr-2" />
              Admin
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
