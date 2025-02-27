import React, { useState, useEffect } from "react";
import axios from "axios";
import "./IMDbCloneApp.css";

const API_KEY = "dae8411";
const API_URL = "http://www.omdbapi.com/";

const IMDbCloneApp = () => {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchMovies("2024"); // Fetch latest movies by default
  }, []);

  const fetchMovies = async (query) => {
    try {
      const response = await axios.get(`${API_URL}?s=${query}&apikey=${API_KEY}`);
      if (response.data.Search) {
        setMovies(response.data.Search);
        setErrorMessage(""); // Clear error if movies are found
      } else {
        setMovies([]);
        setErrorMessage("No results found. Try another search!");
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      setErrorMessage("Failed to fetch movies. Please try again.");
    }
  };

  const fetchMovieDetails = async (id) => {
    try {
      const response = await axios.get(`${API_URL}?i=${id}&apikey=${API_KEY}`);
      setSelectedMovie(response.data);
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  const handleSearch = () => {
    if (search.trim() !== "") {
      fetchMovies(search);
    }
  };

  const goBack = () => {
    setSelectedMovie(null);
  };

  return (
    <div className="container">
      {selectedMovie ? (
        <div className="movie-details">
          <button className="back-button" onClick={goBack}>🔙 Back</button>
          <h2>{selectedMovie.Title}</h2>
          <img src={selectedMovie.Poster} alt={selectedMovie.Title} className="details-poster" />
          <p><strong>Year:</strong> {selectedMovie.Year}</p>
          <p><strong>Genre:</strong> {selectedMovie.Genre}</p>
          <p><strong>Director:</strong> {selectedMovie.Director}</p>
          <p><strong>Actors:</strong> {selectedMovie.Actors}</p>
          <p><strong>IMDB Rating:</strong> {selectedMovie.imdbRating}</p>
          <p><strong>Plot:</strong> {selectedMovie.Plot}</p>
        </div>
      ) : (
        <>
          <h1 className="title">IMDb Clone App</h1>
          <div className="search-box">
            <input
              type="text"
              placeholder="Search for movies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button onClick={handleSearch} className="search-button">Search</button>
          </div>

          {errorMessage ? (
            <p className="error-message">{errorMessage}</p>
          ) : (
            <>
              <h2 className="latest-title">Latest Movies</h2>
              <div className="movie-grid">
                {movies.map((movie) => (
                  <div 
                    key={movie.imdbID} 
                    className="movie-card" 
                    onClick={() => fetchMovieDetails(movie.imdbID)}
                  >
                    <img src={movie.Poster} alt={movie.Title} className="movie-poster" />
                    <h2 className="movie-title">{movie.Title}</h2>
                    <p>{movie.Year}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default IMDbCloneApp;
