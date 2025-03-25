import { History, X } from "lucide-react"
import { Button } from "./ui/button"

export function SearchHistory({ history, onHistoryItemClick }) {
  if (history.length === 0) return null
  
  return (
    <div className="flex flex-wrap items-center gap-2 mt-2">
      <span className="flex items-center text-sm text-muted-foreground">
        <History className="h-4 w-4 mr-1" />
        Recent:
      </span>
      {history.map((item, index) => (
        <Button 
          key={index} 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2 text-sm"
          onClick={() => onHistoryItemClick(item)}
        >
          {item}
        </Button>
      ))}
    </div>
  )
}