/*
	Objeto para manejar el ambiente Firebase
*/
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
  
  import {getAuth, signInWithPopup, signInWithRedirect, GoogleAuthProvider, FacebookAuthProvider, onAuthStateChanged, OAuthProvider, signOut} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js"
  
  import { getDatabase, ref, onValue} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";
  
  export default (config) => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth();
    const bd = getDatabase();
      
	return { 
		app, 
		autenticator: {
		  auth, 
		  signInWithPopup, 
		  signInWithRedirect, 
		  signOut, 
		  GoogleAuthProvider, 
		  FacebookAuthProvider, 
		  OAuthProvider, 
		  onAuthStateChanged
		}, 
		bd: {
		  bd,
		  ref,
		  onValue
		} 
	};
}
