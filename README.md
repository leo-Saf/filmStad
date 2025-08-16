8# 🎬 FilmStad – Fullstack Filmapp med React, Node.js, Firebase och TMDb

FilmStad är en komplett webbaserad filmapp där användare kan:

-  Söka filmer via TMDb
-  Se trailers via YouTube
-  Registrera & logga in med e-post och lösenord
-  Lägga till favoritfilmer med betyg
-  Ta bort favoriter

---


##  Teknologier

- **Frontend:** React, Axios, React Router
- **Backend:** Express.js, Firebase Firestore, bcrypt, JWT, node-fetch
- **APIer:** TMDb, YouTube Data API v3

---

##  Kom igång – Snabbstart

### 1. Klona repot och installera allt

```bash
git clone <repo-url>
cd filmstad
node.js 
npm 

# Installera beroenden för backend
1. Initiera pakethantering och skapa en package.json med rätt fält:

cd backend
npm init -y
npm pkg set type=module
npm pkg set main=database.js
npm pkg set scripts.start="node server.js"


2. Installera alla beroenden inklusive dotenv:
npm install express@4.21.2 bcrypt@5.1.1 cors@2.8.5 jsonwebtoken@9.0.2 firebase-admin@13.0.2 node-fetch@3.3.2 dotenv@16.5.0

Alternativ B: Manuell installation (om du redan har package.json)

1. Gå in i backend-mappen:

cd backend

2. Installera beroenden utifrån befintlig package.json och extra paket:

npm install
npm install express bcrypt cors jsonwebtoken firebase-admin node-fetch
npm install bcrypt@5.1.1 cors@2.8.5 express@4.21.2 firebase-admin@13.0.2 jsonwebtoken@9.0.2 node-fetch@3.3.2 dotenv@^16.5.0

Skapa .env-filen

cat <<EOF > .env
YOUTUBE_API_KEY=din_youtube_api_nyckel_här
EOF


npm start  //innan du startar se till att du har fixat jason filen rätt// om du har node v22  ska du använda import attributes med with { type: 'json' }
Servern körs på: http://localhost:3000


Alternativ A: Automatisk package.json + npm install

1. Gå in i client-mappen:

cd client

2. Initiera package.json:

npm init -y
npm pkg set private=true
npm pkg set scripts.start="react-scripts start"
npm pkg set scripts.build="react-scripts build"
npm pkg set scripts.test="react-scripts test"
npm pkg set scripts.eject="react-scripts eject"
npm pkg set proxy="http://localhost:3000"

3. Installera alla dependencies:

npm install axios cors cra-template react react-dom react-router-dom react-scripts web-vitals

4. Installera dev-dependency:

npm install --save-dev @babel/plugin-proposal-private-property-in-object

Alternativ B: Manuell installation (om du redan har package.json)

cd ../client
npm install
npm install react@^19.0.0 react-dom@^19.0.0 react-router-dom@^7.1.3 axios@^1.7.9 react-scripts@5.0.1 web-vitals@^4.2.4 cra-template@1.2.0
npm install --save-dev @babel/plugin-proposal-private-property-in-object@^7.21.11


##  Backend – Inställningar

###  Skapa och placera din Firebase-nyckel

### 🔐 Lägg till din Firebase-nyckel

För att backend ska fungera krävs en Firebase service account-nyckel.

1. Gå till [Firebase Console](https://console.firebase.google.com)
2. Skapa ett nytt projekt eller använd ett befintligt
3. Gå till **Project Settings → Service Accounts**
4. Klicka på **"Generate new private key"** och spara `.json`-filen på din dator
5. Spara den som:


Sedan:

- Öppna `backend/database.js`
- Byt ut raden där `serviceAccount` importeras, så att den pekar på **din lokala sökväg**

```js
import serviceAccount from '/Users/ditt-användarnamn/SÖKVÄG-TILL-DIN-NYCKEL.json' assert { type: "json" };


---

###  Starta backend-servern

Kör följande kommandon:

```bash
cd backend
npm start
```

Servern startar på:

```
http://localhost:3000/
```

## Frontend – Starta klienten

```bash
cd client
npm start
```

Frontend körs på [http://localhost:3001](http://localhost:3001)

---

##  Funktioner

- **Register & Login** – via `/register` och `/login` endpoints
- **JWT-authentication** – alla skyddade operationer kräver en token
- **Sökfilmer** – hämtas via TMDb
- **Trailerlänkar** – via YouTube Data API
- **Favoriter** – lägg till och ta bort filmer med betyg

---

## Extra beroenden

Backend använder:

- `node-fetch` – om du kör Node <18
- `bcrypt` – för lösenordshashning
- `jsonwebtoken` – för JWT-tokens

Om `fetch` inte fungerar i din Node-version, installera:
```bash
npm install node-fetch
```

---

# Val av ramverk

React är ett JavaScript-bibliotek som används för att skapa användargränssnitt och är mycket uppskattat av utvecklare.  React bygger applikationer med komponenter som kan återanvändas. Detta gör det möjligt för oss att dela upp koden i mindre delar, vilket gör det lättare att hantera, testa och underhålla.Som komponenter i projektet används MovieCard och Favorites för att hantera en filmlista och favoritfilmer. Det är enkelt att få hjälp och hitta lösningar på problem med Reacts stora och aktiva community. Dessutom är det många tredjepartsverktyg och bibliotek som fungerar bra med React. React uppdaterar endast de delar av användargränssnittet som har ändrats eftersom den använder en virtuell DOM (Document Object Model). Som ett resultat förbättras applikationens prestanda.

Nackdelar med React är att den kräver en förståelse av idéer som state, props och komponentlivscykler, vilket kan vara svårt för nybörjare.  De som är vana vid att skriva enbart HTML och JavaScript separat kan hitta det förvirrande eftersom React använder JSX.

## Jämförelse med andra ramverk/bibliotek:

Vue.js är ett progressivt JavaScript-ramverk som fokuserar på att skapa deklarativa användargränssnitt. Det är enkelt att integrera i nuvarande applikationer och kräver inte mycket utbildning för nybörjare. Jämfört med React och Angular har Vue en mycket mer förlåtande inlärningskurva. Dess syntax är lik HTML och JavaScript, vilket gör det lättare för utvecklare som inte är bekanta med nya JavaScript-koncept.
Klar dokumentation: Vues utmärkta dokumentation gör funktionerna lätta att förstå och implementera snabbt. Vues inbyggda reaktivitet gör det enkelt att hålla användargränssnittet och data synkroniserade.
Även om Vue har utvecklats snabbt, är det fortfarande mindre känt än React och saknar mer community-stöd och tredjepartsbibliotek.Det kan vara svårare att hitta jobb eller support för Vue i större projekt eftersom React och Angular används mer i stora företagsapplikationer.

Angular erbjuder ett brett utbud av verktyg för applikationsutveckling, vilket kan vara fördelaktigt för större projekt. Att hantera och testa komponenter och tjänster är enklare med Angular, som har ett inbyggt system för dependency injection. Angulars hårdare modulära struktur kan vara fördelaktig för stora program med många team som arbetar på olika delar av systemet. Angulars inlärningskurva är mindre brant än React och Vue. Det finns många idéer att förstå, och det tar mer tid och energi att lära sig dem. Angular är ofta mer komplext än React och Vue eftersom det är ett fullt utrustat ramverk. Detta kan påverka applikationens prestanda, särskilt för mindre projekt.

Vi valde att bygga vår frontend med React och kompletterade detta med Axios för HTTP-förfrågningar och React Router för att hantera navigering. Detta val baserades på vår tidigare erfarenhet av de tekniska aspekterna från tidigare projekt. På backend använde vi Express tillsammans med Firebase-admin för att kommunicera med vår Firestore-databas. Den här strukturen visade sig vara mycket framgångsrik för oss. När vi stötte på problem, t.ex. att databasen inte svarade, visste vi omedelbart att felet låg i backend/database.js och inte i frontend-koden. Det sparade oss mycket tid under felsökningen. Samarbetet inom teamet blev också enklare eftersom vi kunde arbeta parallellt, till exempel kunde en person fokusera på frontend, medan en annan arbetade med API:et i Express och en tredje med databaslogiken i Firestore.


React var det självklara valet för frontend eftersom det har en stor community och ett stort ekosystem med många färdiga bibliotek som Redux och Next.js. Detta gjorde det enkelt att hitta stöd och exempel på lösningar under utvecklingen. Reacts komponentbaserade struktur passade också perfekt för att bygga våra återanvändbara vyer, såsom Login, Register, SearchMovies och Favorites, som alla blev separata komponenter under src/components (React Dev Meta). Det finns alternativ som Vue och Angular, men vi var ganska säkra på React redan från början, medan de andra två har sina användningsområden. Vi kände att React var det rätta valet på grund av dess utbredda användning (Stack Overflow, 2024). React har också blivit standardvalet för många företag, inklusive stora företag som Facebook, vilket ytterligare stödde vårt val av React. En annan anledning vi valde React för detta projekt var för Reacts komponentbaserad struktur och lätt att integrera externa API
gjorde det lätt att implementera funktioner som att hämta filmdata och hantera användarens favoriter. Samt att vi redan har jobbat med det i tidigare projekt, vilket var lättare för oss att förstå konceptet. Dessutom  ett stort ekosystem och community som gör det enklare att hitta hjälp och bibliotek. Vi övervägde också Vue och Angular, men valde React för dess flexibilitet, storhet i ekosystemet och stöd för tredjepartsbibliotek som underlättar integrationen med externa API och backend-servrar. 

---
referenser:
Google Firebase. Cloud Firestore. Firebase. https://firebase.google.com/docs/firestore/

LogRocket (2023). "Why choose Axios over fetch". https://blog.logrocket.com/

Stack Overflow. (2024). Stack Overflow Developer Survey 2024: Most popular technologies. https://survey.stackoverflow.co/2024/technology
