# 🎬 FilmStad – Fullstack Filmapp med React, Node.js, Firebase och TMDb

FilmStad är en komplett webbaserad filmapp där användare kan:

- 🔍 Söka filmer via TMDb
- 📺 Se trailers via YouTube
- ✅ Registrera & logga in med e-post och lösenord
- ⭐ Lägga till favoritfilmer med betyg
- ❌ Ta bort favoriter

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
npm install express bcrypt cors jsonwebtoken firebase-admin node-fetch
npm install bcrypt@5.1.1 cors@2.8.5 express@4.21.2 firebase-admin@13.0.2 jsonwebtoken@9.0.2 node-fetch@3.3.2



# Installera beroenden för frontend
cd ../client
npm install
npm install react@^19.0.0 react-dom@^19.0.0 react-router-dom@^7.1.3 axios@^1.7.9 react-scripts@5.0.1 web-vitals@^4.2.4 cra-template@1.2.0
npm install --save-dev @babel/plugin-proposal-private-property-in-object@^7.21.11


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