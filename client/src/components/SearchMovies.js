import React, { useState } from 'react';
import axios from 'axios';
import '../App.css'; 

const SearchMovies = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token')); // Få token från localStorage

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/movies/search?query=${query}`);
      console.log('Movies fetched:', response.data);
      setMovies(response.data);
    } catch (err) {
      setError('Error searching for movies: ' + (err.response?.data || err.message));
    }
  };

  const handleAddToFavorites = async (movie, rating) => {
    if (!token) {
      alert('You need to be logged in to add favorites.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/favorites', {
        token,
        movie: { ...movie, rating },
      });
      alert(`${movie.title} has been added to your favorites with rating: ${rating}`);
    } catch (err) {
      setError('Error adding to favorites: ' + (err.response?.data || err.message));
    }
  };

  return (
    <div className="search-container">
      <h2>Search Movies</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for movies"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="movie-grid">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="movie-poster"
            />
            <div className="movie-info">
              <h3>{movie.title}</h3>
              <p>{movie.overview.slice(0, 100)}...</p>
              {movie.trailer && (
                <a
                  href={movie.trailer.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="trailer-link"
                >
                  Watch Trailer
                </a>
                
              )}
              <div className="rating-container">
                <label htmlFor={`rating-${movie.id}`}>Rating:</label>
                <select id={`rating-${movie.id}`} className="rating-select">
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button
                  onClick={() => {
                    const rating = document.getElementById(`rating-${movie.id}`).value;
                    handleAddToFavorites(movie, rating);
                  }}
                  className="favorite-button"
                >
                  Add to Favorites
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchMovies;
