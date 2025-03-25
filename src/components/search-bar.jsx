import { Search, Compass } from "lucide-react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"

export function SearchBar({ query, setQuery, onSearch, loading }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex items-center">
        <Input
          type="text"
          placeholder="What are you looking for? We'll find a way..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pr-24 pl-10 h-14 text-lg"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Button 
          type="submit" 
          className="absolute right-1 top-1/2 transform -translate-y-1/2"
          disabled={loading || !query.trim()}
        >
          {loading ? (
            <Compass className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Search className="mr-2 h-4 w-4" />
          )}
          {loading ? "Finding..." : "Search"}
        </Button>
      </div>
    </form>
  )
}