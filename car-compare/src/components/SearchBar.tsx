"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

interface SearchBarProps {
  initialQuery?: string;
}

export default function SearchBar({
  initialQuery = "",
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/search");
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Search cars, makes, models..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-4 py-3 border-2 border-black text-sm font-medium uppercase tracking-wider placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-black text-white px-8 py-3 text-sm font-medium uppercase tracking-wider hover:bg-black/80 transition-colors"
        >
          <Search size={16} />
          Search
        </button>
      </div>
    </form>
  );
}
