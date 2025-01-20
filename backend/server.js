// Importera beroenden
import express from 'express'; // Express-biblioteket för att skapa en webbtjänst
import bcrypt from 'bcrypt'; // Bcrypt för att hasha och jämföra lösenord
import jwt from 'jsonwebtoken'; // JSON Web Token för autentisering
import fetch from 'node-fetch'; // För att göra HTTP-förfrågningar till externa API:er (nödvändigt om Node.js är <18, men i version 18+ finns fetch globalt)
import { addUser, getUser, addFavorite, getFavorites } from './database.js'; // Import av funktioner som interagerar med Firestore

const app = express(); // Skapar en Express-applikation
const PORT = 3000; // Anger portnumret för servern
const JWT_SECRET = 'your_jwt_secret'; // En hemlig nyckel för att signera och verifiera JWT-token

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

// **Sökfilmer (TMDb API)**
app.get('/movies/search', async (req, res) => {
  const { query } = req.query; // Hämtar sökfrågan från query-parametern
  // Validering av sökfrågan
  if (!query) return res.status(400).send('Query parameter is required.');

  try {
    // Gör en förfrågan till TMDb API för att söka filmer
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=8034d73f1fb759ae30b1bc1d6594bda5&query=${query}`);
    // Parse JSON-svaret
    const data = await response.json();
    // Skickar tillbaka filmdatan som JSON
    res.status(200).json(data);
  } catch (error) {
    // Om ett fel inträffar under sökningen
    res.status(500).send('Error searching for movies: ' + error.message);
  }
});

// **Lägg till favoritfilm**
app.post('/favorites', async (req, res) => {
  const { token, movie } = req.body; // Hämtar JWT-token och filmobjekt från request body
  // Validering av att token och film finns med
  if (!token || !movie) return res.status(400).send('Token and movie are required.');

  try {
    // Verifiera JWT-token för att få användarens e-postadress
    const decoded = jwt.verify(token, JWT_SECRET);
    const email = decoded.email;
    // Lägg till filmen i användarens favoriter
    await addFavorite(email, movie);
    // Svarar med en bekräftelse
    res.status(200).send('Movie added to favorites.');
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

// **Startar servern och lyssnar på förfrågningar**
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
