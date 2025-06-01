import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      axios
        .get(`http://localhost:3000/favorites?token=${token}`)
        .then((response) => setFavorites(response.data))
        .catch((err) => console.error('Error fetching favorites: ', err));
    }
  }, [token]);

  const handleRemoveFavorite = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/favorites/${id}?token=${token}`);
      setFavorites(favorites.filter((movie) => movie.id !== id));
    } catch (err) {
      console.error('Error removing favorite: ', err);
    }
  };

  return (
    <div className="favorites-container">
      <h2>Your Favorite Movies</h2>

      <div className="movie-grid">
        {favorites.length > 0 ? (
          favorites.map((movie) => (
            <div key={movie.id} className="movie-card">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="movie-poster"
              />
              <div className="movie-info">
                <h3>{movie.title}</h3>
                <p>{movie.overview.slice(0, 100)}...</p>
                <p className="movie-rating">Rating: {movie.rating} ⭐</p>
                <button
                  onClick={() => handleRemoveFavorite(movie.id)}
                  className="favorite-button remove-button"
                >
                  Remove from Favorites
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>You have no favorite movies yet!</p>
        )}
      </div>
    </div>
  );
};

export default Favorites;
