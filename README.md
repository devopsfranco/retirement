# Pathfinder - The Search Engine That Always Finds A Way

Pathfinder is a modern search engine interface built with React, Vite, and Tailwind CSS that demonstrates the concept of persistent searching. When traditional search methods fail, Pathfinder tries alternative approaches to help users find what they're looking for.

## Features

- Clean, modern UI with dark/light mode support
- Persistent search that tries alternative queries when no results are found
- Search history tracking
- Responsive design for all device sizes
- Animated UI elements for better user experience

## Technologies Used

- React
- Vite
- Tailwind CSS
- shadcn/ui components
- Lucide React icons

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`

## How It Works

Pathfinder demonstrates the concept of a search engine that "always finds a way" by:

1. Accepting user search queries
2. Attempting to find results based on the initial query
3. If no results are found, automatically trying alternative search approaches
4. Suggesting related searches that might yield better results
5. Maintaining a search history for easy reference

## Project Structure

- `src/components/` - React components
- `src/components/ui/` - shadcn/ui components
- `src/lib/` - Utility functions
- `public/` - Static assets

## License

MIT