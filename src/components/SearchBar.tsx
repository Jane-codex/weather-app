import { useState } from "react";
import { Search } from "lucide-react";
 
interface SearchBarProps {
    onSearch: (city: string) => void;
}

export default function
 SearchBar({ onSearch }: SearchBarProps) {
     const [query, setQuery] = useState("");

     const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        onSearch(query.trim());
     };

     return (
        <form className="search-bar" onSubmit={handleSubmit}>
            <input
            type="text"
            placeholder="Search city..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            />

            <button type="submit"
            className="search-btn">
                <Search size={20}
                strokeWidth={2.5} />
            </button>
        </form>
     );
 }