// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Função para salvar dados no Firebase Realtime Database e criar um novo usuário na Autenticação
  document.getElementById('join-btn').addEventListener('click', async function(event) {
  event.preventDefault();

  // Obtém os valores dos campos de entrada de texto
  var username = document.getElementById('nome').value;
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  
  if (password.length < 6) {
    alert("A senha deve ter pelo menos 6 caracteres.");
    return; // Para a execução da função se a senha for curta
  }

  // Cria um novo utilizador na Autenticação
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      var userId = userCredential.user.uid;

      var database = firebase.database();
      var dataRef = database.ref("clientes");

      var data = {
        nome: username,
        email: email,
        password: password,
        IsAdmin: false,
        userId: userId  // Adicione o ID exclusivo do usuário aos dados
      };

      dataRef.child(username).set(data)
        .then(function() {
          console.log("Dados salvos com sucesso!");
          alert("Conta Registada");
          sessionStorage.setItem('loggedIn', 'true');
          window.location.href = 'main.html';
        })
        .catch(function(error) {
          console.error("Erro ao salvar dados: " + error.message);
        });
      })
      .catch((error) => {
      if (error.code === 'auth/email-already-in-use') {
        console.error("Erro ao criar usuário: Este email já está em uso.");
        alert("Erro: Este email já está em uso.");
      } else {
        console.error("Erro ao criar usuário: " + error.message);
      }
     });
  });




