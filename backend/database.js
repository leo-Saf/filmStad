// Importerar Firebase Admin SDK för att interagera med Firestore och Realtime Database
import admin from 'firebase-admin';

// Importerar service account JSON för autentisering i Firebase
import serviceAccount from '/Users/gabrielcarlstoftsoderstrom/Desktop/Filmstad-key/filmstad-bc402-firebase-adminsdk-fbsvc-1cc46a8e10.json' assert { type: "json" };

// Initialiserar Firebase Admin med hjälp av service-kontot och ställer in URL för databasen
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount), // autentisering via certifikat
  databaseURL: 'https://filmstad-bc402-default-rtdb.firebaseio.com' // Anger databasens URL
});

// Skapar en referens till Firestore-databasen
const db = admin.firestore();

/**
 * Funktion för att lägga till en användare i Firestore
 * @param {string} email - Användarens email
 * @param {string} password - Användarens lösenord
 */
export const addUser = async (email, password) => {
  // Lägger till användaren i collectionen 'users' i Firestore med e-post som dokument-id
  await db.collection('users').doc(email).set({ email, password });
};

/**
 * Funktion för att hämta användardata baserat på email
 * @param {string} email - Användarens email
 * @returns {object|null} - Returnerar användardata eller null om användaren inte finns
 */
export const getUser = async (email) => {
  // Hämtar dokumentet för användaren från 'users' collection
  const userDoc = await db.collection('users').doc(email).get();
  
  // Om användaren finns, returnera deras data, annars null
  return userDoc.exists ? userDoc.data() : null;
};

/**
 * Funktion för att lägga till en favoritfilm för användaren
 * @param {string} email - Användarens email
 * @param {object} movie - Filmobjektet att lägga till i användarens favoriter
 */
export const addFavorite = async (email, movie) => {
  const userFavoritesRef = db.collection('users').doc(email).collection('favorites');

  // Kontrollera att betyg är inkluderat
  if (!movie.rating) {
    throw new Error('Rating is required to add a movie to favorites.');
  }

  // Lägger till eller uppdaterar filmen i användarens favoritsamling baserat på filmens id
  await userFavoritesRef.doc(String(movie.id)).set(movie);
};


/**
 * Funktion för att hämta alla favoritfilmer för en användare
 * @param {string} email - Användarens email
 * @returns {array} - En lista med favoritfilmer
 */
export const getFavorites = async (email) => {
  // Referens till användarens favoritsamling
  const userFavoritesRef = db.collection('users').doc(email).collection('favorites');
  
  // Hämtar alla favoritfilmer för användaren
  const snapshot = await userFavoritesRef.get();
  
  // Returnerar en array av films data (ej dokument-objekt) från snapshot
  return snapshot.docs.map(doc => doc.data());
};

/**
 * Funktion för att ta bort en favoritfilm för användaren
 * @param {string} email - Användarens e-postadress
 * @param {number} id - ID för filmen som ska tas bort
 */
export const removeFavorite = async (email, id) => {
  try {
    // Referens till användarens favoritsamling
    const userFavoritesRef = db.collection('users').doc(email).collection('favorites');
    
    // Hämtar alla filmer och letar efter filmen som har rätt ID
    const snapshot = await userFavoritesRef.where('id', '==', id).get();

    if (snapshot.empty) {
      throw new Error(`Movie with ID ${id} not found.`);
    }

    // Tar bort varje matchande dokument (även om det bara borde finnas ett)
    snapshot.forEach(async (doc) => {
      await userFavoritesRef.doc(doc.id).delete();
      console.log(`Movie with ID ${id} removed from favorites.`);
    });
  } catch (error) {
    console.error('Error removing favorite movie:', error);
    throw new Error('Error removing movie from favorites: ' + error.message);
  }
};
