import { Compass, Search } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

export function NoResults({ query, alternativeSearches, onAlternativeClick }) {
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-center mb-4">
          <Compass className="h-12 w-12 text-primary compass-spin" />
        </div>
        <CardTitle className="text-center text-xl">Finding another way...</CardTitle>
        <CardDescription className="text-center">
          No results found for "{query}", but we're not giving up!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-center text-muted-foreground">
            Try one of these alternative searches:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {alternativeSearches.map((alternative, index) => (
              <Button 
                key={index} 
                variant="outline" 
                onClick={() => onAlternativeClick(alternative)}
                className="flex items-center"
              >
                <Search className="mr-2 h-4 w-4" />
                {alternative}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}