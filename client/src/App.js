import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Login from '../src/components/Login';
import Register from '../src/components/Register';
import SearchMovies from '../src/components/SearchMovies';
import Favorites from '../src/components/Favorites';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Uppdatera token när det ändras i localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <Router>
      <nav>
        {token ? (
          <>
            <Link to="/">Search Movies</Link>
            <Link to="/favorites">Favorites</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>

      <Routes>
        <Route 
          path="/" 
          element={token ? <SearchMovies /> : <Navigate to="/login" replace />} 
        />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/login" 
          element={<Login onLoginSuccess={(userToken) => {
            localStorage.setItem('token', userToken);
            setToken(userToken);
          }} />} 
        />
        <Route 
          path="/favorites" 
          element={token ? <Favorites /> : <Navigate to="/login" replace />} 
        />
      </Routes>
    </Router>
  );
};

export default App;
