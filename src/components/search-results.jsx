import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { ExternalLink } from "lucide-react"

export function SearchResults({ results }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Found {results.length} results</h3>
      
      <div className="grid gap-4 md:grid-cols-2">
        {results.map((result) => (
          <Card key={result.id} className="result-item">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span>{result.title}</span>
                <a href={result.url} className="text-primary hover:text-primary/80">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{result.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}