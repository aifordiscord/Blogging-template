import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface BlogSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function BlogSearch({ onSearch, placeholder = "Search blogs, topics, authors..." }: BlogSearchProps) {
  const [query, setQuery] = useState("");

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="relative max-w-2xl mx-auto">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20"
      />
    </div>
  );
}
