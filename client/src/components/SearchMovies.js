import React, { useState } from 'react';
import axios from 'axios';

const SearchMovies = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token'));  // Få token från localStorage

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/movies/search?query=${query}`);
      setMovies(response.data);
    } catch (err) {
      setError('Error searching for movies: ' + err.response?.data || err.message);
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
        movie: { ...movie, rating }
      });
      alert(`${movie.title} has been added to your favorites with rating: ${rating}`);
    } catch (err) {
      setError('Error adding to favorites: ' + err.response?.data || err.message);
    }
  };

  return (
    <div>
      <h2>Search Movies</h2>
      <input
        type="text"
        placeholder="Search for movies"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {error && <p>{error}</p>}

      <div>
        {movies.map((movie) => (
          <div key={movie.id}>
            <h3>{movie.title}</h3>
            <p>{movie.overview}</p>

            {/* Visa trailer om den finns */}
            {movie.trailer && (
              <a href={movie.trailer.url} target="_blank" rel="noopener noreferrer">Watch Trailer</a>
            )}

            {/* Betygsättning och knapp för att lägga till favorit */}
            <div>
              <label htmlFor={`rating-${movie.id}`}>Rating:</label>
              <select id={`rating-${movie.id}`}>
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
              >
                Add to Favorites
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchMovies;
