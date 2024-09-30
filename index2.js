// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { getDatabase} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-database.js";

  const firebaseConfig = {
  databaseURL: "https://pap--11-01-default-rtdb.europe-west1.firebasedatabase.app",
  apiKey: "AIzaSyAQ53q90zz4ladNEqDqWgcaMXIvOu7uYrY",
  authDomain: "pap--11-01.firebaseapp.com",
  projectId: "pap--11-01",
  storageBucket: "pap--11-01.appspot.com",
  messagingSenderId: "768987706479",
  appId: "1:768987706479:web:47662a04df7274d930499a",
  measurementId: "G-B7QVNLWHJZ"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const database = getDatabase(app);

  var login = document.getElementById('login'); 

  if (login) {
    login.addEventListener('click', (event) => {
      event.preventDefault();
  
      var email = document.getElementById('email').value;
      var password = document.getElementById('password').value;
  
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          sessionStorage.setItem('loggedIn', 'true');
          window.location.href = 'main.html';
        })
        .catch((error) => {
          const errorMessage = error.message;
          alert(errorMessage);
        });
    });
  }

 

 
