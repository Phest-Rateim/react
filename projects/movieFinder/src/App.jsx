import { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";

function App() {
  // State for search input value
  const [search, setSearch] = useState("");
  // Reference to track the last successful search term
  const lastSearchRef = useRef("");
  // State for error messages
  const [error, setError] = useState("");
  // State for movie results
  const [movies, setMovies] = useState([]);
  // State for loading status
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Transforms raw API data into our application's movie format
   * @param {Object} apiData - Raw data from OMDB API
   * @returns {Array} Array of formatted movie objects
   */
  const transformMoviesData = (apiData) => {
    if (!apiData.Search) return [];

    return apiData.Search.map((movie) => ({
      title: movie.Title,
      year: movie.Year,
      idIMDB: movie.imdbID,
      type: movie.Type,
      posterURL: movie.Poster,
    }));
  };

  /**
   * Fetches movies from OMDB API based on search term
   * @param {string} searchTerm - Term to search for
   */
  const fetchMovies = useCallback(async (searchTerm) => {
    setError("");

    // Skip if search term hasn't changed
    if (searchTerm === lastSearchRef.current) {
      return;
    }

    // Validation checks
    if (searchTerm.trim() === "") {
      setError("Search field cannot be empty");
      return;
    }

    if (searchTerm.length < 3) {
      setError("Search term must be at least 3 characters long");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=45128e6d&s=${searchTerm}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();

      // Handle API-specific errors
      if (data.Response === "False") {
        throw new Error(data.Error || "No results found");
      }

      const transformedMovies = transformMoviesData(data);
      setMovies(transformedMovies);
      lastSearchRef.current = searchTerm; // Update last successful search
    } catch (error) {
      setError(error.message);
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Handles form submission
   * @param {Event} event - Form submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    fetchMovies(search);
  };

  /**
   * Handles search input changes
   * @param {Event} e - Input change event
   */
  const handleSearch = (e) => {
    setSearch(e.target.value);
    // Clear error when user starts typing valid input
    if (error && e.target.value.length >= 3) {
      setError("");
    }
  };

  // Effect for debounced search as user types
  useEffect(() => {
    const timerId = setTimeout(() => {
      if (search.length >= 3) {
        fetchMovies(search);
      }
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(timerId);
    };
  }, [search, fetchMovies]);

  return (
    <div className="app">
      <form onSubmit={handleSubmit}>
        <div className="search-container">
          <input
            type="text"
            name="searchInput"
            value={search}
            placeholder="'Titanic', 'Avatar 2'"
            onChange={handleSearch}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
      </form>

      {isLoading ? (
        <div className="loading">Loading...</div>
      ) : movies.length > 0 ? (
        <div className="movies-grid">
          {movies.map((movie) => (
            <div key={movie.idIMDB} className="movie-card">
              <img
                src={movie.posterURL}
                alt={`${movie.title} poster`}
                loading="lazy"
                onError={(e) => {
                  e.target.src =
                    "https://placehold.co/300x450?text=Poster+not+available";
                  e.target.onerror = null;
                }}
              />
              <h3>
                {movie.title} ({movie.year})
              </h3>
            </div>
          ))}
        </div>
      ) : (
        !error && <div className="no-results">Enter a search term to begin</div>
      )}
    </div>
  );
}

export default App;
