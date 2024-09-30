import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-database.js";

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

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Referência para os clientes no banco de dados
const clientesRef = ref(database, 'clientes');

// Obtenha os dados dos clientes e exiba-os no dashboard
onValue(clientesRef, (snapshot) => {
    try {
        const clientes = snapshot.val();
        const clientesList = document.getElementById('clientes-list');

        clientesList.innerHTML = ''; // Clear the list before adding clients

        for (let clienteId in clientes) {
            const clienteData = clientes[clienteId];
            const clienteElement = document.createElement('div');
            clienteElement.innerHTML = `
                <strong>Cliente ID:</strong> ${clienteId}, 
                <strong>Nome:</strong> ${clienteData.nome}, 
                <strong>Email:</strong> ${clienteData.email},
                <strong>É Admin:</strong> ${clienteData.isAdmin ? 'Sim' : 'Não'}
            `;
            clientesList.appendChild(clienteElement);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

