// Importera beroenden
import express from 'express'; // Express-biblioteket för att skapa en webbtjänst
import bcrypt from 'bcrypt'; // Bcrypt för att hasha och jämföra lösenord
import jwt from 'jsonwebtoken'; // JSON Web Token för autentisering
import fetch from 'node-fetch'; // För att göra HTTP-förfrågningar till externa API:er (nödvändigt om Node.js är <18, men i version 18+ finns fetch globalt)
import { addUser, getUser, addFavorite, getFavorites, removeFavorite } from './database.js'; // Import av funktioner som interagerar med Firestore

import cors from 'cors';


const app = express(); // Skapar en Express-applikation
const PORT = 3000; // Anger portnumret för servern
const JWT_SECRET = 'your_jwt_secret'; // En hemlig nyckel för att signera och verifiera JWT-token
const YOUTUBE_API_KEY = 'AIzaSyBnbqDT14XIJPcJV7aTxzUCSRE1CewfWSA';

// Tillåt förfrågningar från localhost:3001
app.use(cors({
  origin: 'http://localhost:3001', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json()); // Middleware som gör att Express kan läsa JSON i inkommande förfrågningar

// **Registrering av användare**
app.post('/register', async (req, res) => {
  const { email, password } = req.body; // Tar emot e-post och lösenord från request body

  // Validering för att säkerställa att e-post och lösenord har skickats med
  if (!email || !password) return res.status(400).send('Email and password are required.');

  try {
    // Hashar lösenordet innan det sparas
    const hashedPassword = await bcrypt.hash(password, 10);
    // Lägger till användaren i databasen
    await addUser(email, hashedPassword);
    // Svarar med en bekräftelse
    res.status(201).send('User registered successfully.');
  } catch (error) {
    // Om ett fel inträffar, skickas ett meddelande tillbaka
    res.status(500).send('Error registering user: ' + error.message);
  }
});

// **Inloggning av användare**
app.post('/login', async (req, res) => {
  const { email, password } = req.body; // Tar emot inloggningsuppgifter

  // Validering för att säkerställa att e-post och lösenord har skickats med
  if (!email || !password) return res.status(400).send('Email and password are required.');

  try {
    // Hämtar användardata från databasen baserat på e-post
    const user = await getUser(email);
    // Om användaren inte finns, svara med ett fel
    if (!user) return res.status(404).send('User not found.');

    // Jämför det hashade lösenordet med användarens lösenord
    const isPasswordValid = await bcrypt.compare(password, user.password);
    // Om lösenordet inte stämmer, svara med ett fel
    if (!isPasswordValid) return res.status(401).send('Invalid credentials.');

    // Om inloggningen lyckas, generera en JWT-token
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
    // Skicka tillbaka token till klienten
    res.status(200).json({ token });
  } catch (error) {
    // Om ett fel inträffar under inloggningen, skicka ett felmeddelande
    res.status(500).send('Error logging in: ' + error.message);
  }
});

// Sökfilmer och trailers
app.get('/movies/search', async (req, res) => {
  const { query } = req.query; // Hämtar sökfrågan från query-parametern
  if (!query) return res.status(400).send('Query parameter is required.');

  try {
    // Steg 1: Hämta filmer från TMDb API
    const tmdbResponse = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=8034d73f1fb759ae30b1bc1d6594bda5&query=${query}`);
    const tmdbData = await tmdbResponse.json();
    const movies = tmdbData.results || [];

    // Steg 2: Lägg till trailer för varje film med hjälp av YouTube API
    const moviesWithTrailers = await Promise.all(
      movies.map(async (movie) => {
        try {
          const youtubeResponse = await fetch(
            
            `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&key=${YOUTUBE_API_KEY}&q=${encodeURIComponent(
              movie.title + ' trailer'
            )}`
          );
          const youtubeData = await youtubeResponse.json();
          const trailer = youtubeData.items?.[0]; // Ta första träffen

          return {
            ...movie,
            trailer: trailer
              ? {
                  title: trailer.snippet.title,
                  videoId: trailer.id.videoId,
                  url: `https://www.youtube.com/watch?v=${trailer.id.videoId}`,
                }
              : null, // Om ingen trailer hittas
          };
        } catch (err) {
          console.error(`Error fetching trailer for ${movie.title}: ${err.message}`);
          return { ...movie, trailer: null };
        }
      })
    );

    // Skicka tillbaka filmer med trailers
    res.status(200).json(moviesWithTrailers);
  } catch (error) {
    console.error('Error fetching movies or trailers:', error.message);
    res.status(500).send('Error searching for movies: ' + error.message);
  }
});

app.post('/favorites', async (req, res) => {
  const { token, movie } = req.body; // Hämtar JWT-token och filmobjekt från request body
  
  // Kontrollera att token, film och betyg finns med
  if (!token || !movie) {
    return res.status(400).send('Token and movie are required.');
  }
  if (!movie.rating) {
    return res.status(400).send('Rating is required to add a movie to favorites.');
  }

  try {
    // Verifiera JWT-token för att få användarens e-postadress
    const decoded = jwt.verify(token, JWT_SECRET);
    const email = decoded.email;

    // Lägg till filmen i användarens favoriter med betyget
    await addFavorite(email, movie);

    // Svarar med en bekräftelse
    res.status(200).send('Movie added to favorites with rating.');
  } catch (error) {
    // Om ett fel inträffar
    res.status(500).send('Error adding to favorites: ' + error.message);
  }
});


// **Hämta favoritfilmer**
app.get('/favorites', async (req, res) => {
  const { token } = req.query; // Hämtar JWT-token från query-parametern
  // Validering av token
  if (!token) return res.status(400).send('Token is required.');

  try {
    // Verifierar token och hämtar e-postadress från den
    const decoded = jwt.verify(token, JWT_SECRET);
    const email = decoded.email;
    // Hämtar användarens favoritfilmer från databasen
    const favorites = await getFavorites(email);
    // Skickar tillbaka favoritfilmer som JSON
    res.status(200).json(favorites);
  } catch (error) {
    // Om ett fel inträffar
    res.status(500).send('Error fetching favorites: ' + error.message);
  }
});

app.delete('/favorites/:id', async (req, res) => {
  const { token } = req.query; // Hämtar token från query-parametrarna
  const { id } = req.params; // Hämtar film-ID från URL-parametern

  // Validera om token och film-ID finns med
  if (!token || !id) return res.status(400).send('Token and movie ID are required.');

  try {
    // Verifiera JWT-token och hämta användarens e-postadress
    const decoded = jwt.verify(token, JWT_SECRET);
    const email = decoded.email;

    // Ta bort filmen från användarens favoriter baserat på film-ID
    await removeFavorite(email, parseInt(id)); // Omvandla ID till ett nummer
    res.status(200).send('Movie removed from favorites.');
  } catch (error) {
    res.status(500).send('Error removing movie from favorites: ' + error.message);
  }
});


// **Startar servern och lyssnar på förfrågningar**
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));