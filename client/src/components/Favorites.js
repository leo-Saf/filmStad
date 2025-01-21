import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    <div>
      <h2>Your Favorite Movies</h2>
      <div>
        {favorites.map((movie) => (
          <div key={movie.id}>
            <h3>{movie.title}</h3>
            <button onClick={() => handleRemoveFavorite(movie.id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
