import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from '../src/components/Login';
import Register from '../src/components/Register';
import SearchMovies from '../src/components/SearchMovies';
import Favorites from '../src/components/Favorites';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  return (
    <Router>
      <nav>
        <Link to="/">Search Movies</Link>
        <Link to="/favorites">Favorites</Link>
        {!token ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <button onClick={() => { localStorage.removeItem('token'); setToken(null); }}>Logout</button>
        )}
      </nav>

      <Routes>
        <Route path="/" element={token ? <SearchMovies /> : <Login onLoginSuccess={setToken} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login onLoginSuccess={setToken} />} />
        <Route path="/favorites" element={token ? <Favorites /> : <Login onLoginSuccess={setToken} />} />
      </Routes>
    </Router>
  );
};

export default App;
