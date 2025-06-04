# 🎬 FilmStad – Fullstack Filmapp med React, Node.js, Firebase och TMDb

FilmStad är en komplett webbaserad filmapp där användare kan:

- 🔍 Söka filmer via TMDb
- 📺 Se trailers via YouTube
- ✅ Registrera & logga in med e-post och lösenord
- ⭐ Lägga till favoritfilmer med betyg
- ❌ Ta bort favoriter

---

## 📁 Projektstruktur

backend/
├── server.js          # Servern
├── database.js       # Firebase-funktioner

frontend/
├── src/
│   ├── components/
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── SearchMovies.js
│   │   ├──Favorites.css
│   │   └── Favorites.js
│   ├── App.js
│   └── App.css


---

## 🧰 Teknologier

- **Frontend:** React, Axios, React Router
- **Backend:** Express.js, Firebase Firestore, bcrypt, JWT, node-fetch
- **APIer:** TMDb, YouTube Data API v3

---

## 🚀 Kom igång – Snabbstart

### 1. Klona repot och installera allt

```bash
git clone <repo-url>
cd filmstad

# Installera beroenden för backend
cd backend
npm install

# Installera beroenden för frontend
cd ../client
npm install

## ⚙️ Backend – Inställningar

### 🔐 Skapa och placera din Firebase-nyckel

1. Gå till [Firebase Console](https://console.firebase.google.com)
2. Skapa ett nytt projekt
3. Gå till **Project Settings > Service Accounts**
4. Klicka **"Generate new private key"**
5. Spara JSON-filen som:

```bash
backend/filmstad-key/serviceAccountKey.json
```

---

### 🔑 Lägg till YouTube API-nyckel

I `backend/server.js`, byt ut din nyckelrad till din riktiga YouTube Data API-nyckel:

```js
const YOUTUBE_API_KEY = 'DIN_YOUTUBE_API_NYCKEL';
```

---

### 🏁 Starta backend-servern

Kör följande kommandon:

```bash
cd backend
npm start
```

Servern startar på:

```
http://localhost:3000/
```

## 🌐 Frontend – Starta klienten

```bash
cd frontend
npm start
```

Frontend körs på [http://localhost:3001](http://localhost:3001)

---

## 🔒 Funktioner

- **Register & Login** – via `/register` och `/login` endpoints
- **JWT-authentication** – alla skyddade operationer kräver en token
- **Sökfilmer** – hämtas via TMDb
- **Trailerlänkar** – via YouTube Data API
- **Favoriter** – lägg till och ta bort filmer med betyg

---

## 🛠 Extra beroenden

Backend använder:

- `node-fetch` – om du kör Node <18
- `bcrypt` – för lösenordshashning
- `jsonwebtoken` – för JWT-tokens

Om `fetch` inte fungerar i din Node-version, installera:
```bash
npm install node-fetch
```

---