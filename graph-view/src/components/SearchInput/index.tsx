import { useState, useEffect, useRef, KeyboardEvent } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

// Simulated async function to fetch search results
const fetchSearchResults = async (query: string): Promise<string[]> => {
  await new Promise(resolve => setTimeout(resolve, 300)) // Simulate API delay
  return [
    `Result for ${query} 1`,
    `Result for ${query} 2`,
    `Result for ${query} 3`,
    `Result for ${query} 4`,
    `Result for ${query} 5`,
  ].filter(result => result.toLowerCase().includes(query.toLowerCase()))
}

export default function Component() {
  const [inputValue, setInputValue] = useState("")
  const [results, setResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [showResults, setShowResults] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      if (inputValue) {
        setIsLoading(true)
        const searchResults = await fetchSearchResults(inputValue)
        setResults(searchResults)
        setIsLoading(false)
        setShowResults(true)
      } else {
        setResults([])
        setShowResults(false)
      }
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [inputValue])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    setSelectedIndex(-1)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === "Enter" && selectedIndex > -1) {
      setInputValue(results[selectedIndex])
      setShowResults(false)
    } else if (e.key === "Escape") {
      setShowResults(false)
    }
  }

  const handleResultClick = (result: string) => {
    setInputValue(result)
    setShowResults(false)
    inputRef.current?.focus()
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="pl-8 pr-4 py-2 w-full rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow duration-200 ease-in-out bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
        />
        {isLoading && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        )}
        {showResults && results.length > 0 && (
          <ul
            ref={resultsRef}
            className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto"
          >
            {results.map((result, index) => (
              <li
                key={index}
                onClick={() => handleResultClick(result)}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  index === selectedIndex ? "bg-gray-100 dark:bg-gray-700" : ""
                }`}
              >
                {result}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}