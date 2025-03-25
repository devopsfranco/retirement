import { useState, useEffect } from 'react'
import { SearchBar } from './components/search-bar'
import { SearchResults } from './components/search-results'
import { NoResults } from './components/no-results'
import { SearchHistory } from './components/search-history'
import { ModeToggle } from './components/mode-toggle'
import { Compass } from 'lucide-react'

function App() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchHistory, setSearchHistory] = useState([])
  const [searchAttempts, setSearchAttempts] = useState(0)
  const [showNoResults, setShowNoResults] = useState(false)

  // Mock data for search results
  const mockData = [
    { id: 1, title: "Finding your way through coding challenges", url: "#coding", description: "Learn how to approach and solve complex coding problems step by step." },
    { id: 2, title: "Pathfinder: The ultimate navigation tool", url: "#navigation", description: "Discover how modern navigation systems always find the optimal route." },
    { id: 3, title: "Alternative routes when you're stuck in traffic", url: "#traffic", description: "Smart ways to avoid traffic jams and find alternative routes." },
    { id: 4, title: "Problem-solving methodologies", url: "#problem-solving", description: "Systematic approaches to finding solutions to complex problems." },
    { id: 5, title: "The art of finding your way in unfamiliar territories", url: "#exploration", description: "Tips and tricks for navigating unknown environments safely." },
    { id: 6, title: "Career pathways: Finding your way in professional life", url: "#career", description: "Guidance on navigating career transitions and professional growth." },
    { id: 7, title: "Algorithms that always find a solution", url: "#algorithms", description: "Exploring computational methods that guarantee finding answers." },
    { id: 8, title: "Navigating difficult conversations", url: "#communication", description: "How to find your way through challenging interpersonal discussions." },
    { id: 9, title: "Finding your way back: Recovery strategies", url: "#recovery", description: "Methods for bouncing back when you've lost your way." },
    { id: 10, title: "Wayfinding in architecture and urban design", url: "#design", description: "How designers create spaces that help people find their way." }
  ]

  // Alternative search suggestions based on original query
  const getAlternativeSearches = (originalQuery) => {
    const alternatives = [
      `${originalQuery} solutions`,
      `how to ${originalQuery}`,
      `${originalQuery} alternatives`,
      `${originalQuery} guide`,
      `finding ${originalQuery}`
    ]
    return alternatives.slice(0, 3)
  }

  const handleSearch = async (searchQuery, isRetry = false) => {
    if (!searchQuery.trim()) return
    
    setLoading(true)
    setShowNoResults(false)
    
    // Add to search history if it's not a retry
    if (!isRetry) {
      setSearchHistory(prev => {
        // Avoid duplicates in history
        if (!prev.includes(searchQuery)) {
          return [...prev, searchQuery].slice(-5) // Keep last 5 searches
        }
        return prev
      })
      setSearchAttempts(1)
    } else {
      setSearchAttempts(prev => prev + 1)
    }

    // Simulate API call with timeout
    setTimeout(() => {
      // Filter mock data based on query
      const filtered = mockData.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
      
      // If no results on first attempt, show "finding another way" message
      if (filtered.length === 0 && searchAttempts < 2) {
        setResults([])
        setLoading(false)
        setShowNoResults(true)
        
        // Automatically try a modified search after a delay
        setTimeout(() => {
          const enhancedQuery = `${searchQuery} alternatives`
          setQuery(enhancedQuery)
          handleSearch(enhancedQuery, true)
        }, 2000)
      } else {
        setResults(filtered)
        setLoading(false)
      }
    }, 1500)
  }

  const handleHistoryItemClick = (historyItem) => {
    setQuery(historyItem)
    handleSearch(historyItem)
  }

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <Compass className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">Pathfinder</h1>
        </div>
        <ModeToggle />
      </header>
      
      <main>
        <div className="max-w-3xl mx-auto mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
            The search engine that <span className="text-primary">always finds a way</span>
          </h2>
          <p className="text-center text-muted-foreground mb-8">
            When others give up, we keep searching. No dead ends, just new paths to explore.
          </p>
          
          <SearchBar 
            query={query} 
            setQuery={setQuery} 
            onSearch={handleSearch} 
            loading={loading}
          />
          
          {searchHistory.length > 0 && (
            <div className="mt-4">
              <SearchHistory 
                history={searchHistory} 
                onHistoryItemClick={handleHistoryItemClick} 
              />
            </div>
          )}
        </div>
        
        {showNoResults && (
          <NoResults 
            query={query} 
            alternativeSearches={getAlternativeSearches(query)}
            onAlternativeClick={(alternative) => {
              setQuery(alternative)
              handleSearch(alternative, true)
            }}
          />
        )}
        
        {results.length > 0 && (
          <SearchResults results={results} />
        )}
      </main>
      
      <footer className="mt-16 text-center text-sm text-muted-foreground">
        <p>Pathfinder Search Engine - Always finding a way since 2023</p>
      </footer>
    </div>
  )
}

export default App