import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, query, where, deleteDoc} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
  
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
    const db = getFirestore(app);

    document.querySelector('form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nome = document.getElementById('nome').value;
        const duracao = document.getElementById('duracao').value;
        const dataEstreia = document.getElementById('data_estreia').value;
        const genero = document.getElementById('genero').value;
        const idade = document.getElementById('idade').value;
        const direcao = document.getElementById('direcao').value;
        const sinopse = document.getElementById('sinopse').value;
        const elenco = document.getElementById('elenco').value;
        const trailer = document.getElementById('trailer').value;
        const capa = document.getElementById('avatar').files[0];

        
        
        try {
            const docRef = await addDoc(collection(db, "filme"), {
                nome: nome,
                duracao: duracao,
                dataEstreia: dataEstreia,
                generos: genero,
                idade: idade,
                direcao: direcao,
                sinopse: sinopse,
                elenco: elenco,
                trailer: trailer,
                capa: "img/" + capa.name            
            });
            
            console.log("Documento adicionado com ID: ", docRef.id);
            e.target.reset();
            location.reload();
            
        } catch (error) {
            console.error("Erro ao adicionar documento: ", error);
        }
    });

    const filmesDaSemanaContainer = document.getElementById('filmesDaSemana');
    const colRef = collection(db, 'filme');

    let filmesDestacados = 0;

    getDocs(colRef)
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data) {
                    // Criar elementos HTML para cada filme
                    const divCol = document.createElement('div');
                    divCol.classList.add('col-md-3');

                    const img = document.createElement('img');
                    img.src = "../" + data.capa; // Substitua 'imagem' pelo campo correto no seu documento Firestore
                    img.classList.add('img-fluid');
                    img.classList.add('imgcapa');
                    img.alt = 'Capa do Filme';

                    const h3 = document.createElement('h3');
                    h3.textContent = data.titulo; // Substitua 'titulo' pelo campo correto no seu documento Firestore

                    // Criar botão com base no valor de filmeDestaque
                    const button = document.createElement('button');
                    button.type = 'button';
                    button.classList.add('btn');
                    if (!data.filmeDestacado) {
                        button.classList.add('btn-success'); // Botão vermelho
                        button.textContent = 'Destacar Filme';
                        button.addEventListener('click', function() {
                            destacarFilme(doc.id, doc.data().capa);
                        });
                    } else {
                        button.classList.add('btn-danger'); // Botão verde
                        button.textContent = 'Remover Destaque';
                        filmesDestacados++;
                        button.addEventListener('click', function() {
                            removerDestaqueFilme(doc.id);
                        });
                    }

                    // Criar botão "Adicionar Sessão"
                    const buttonAdicionarSessao = document.createElement('button');
                    buttonAdicionarSessao.type = 'button';
                    buttonAdicionarSessao.classList.add('btn', 'btn-info'); // Botão azul
                    buttonAdicionarSessao.textContent = 'Adicionar Sessão';
                    buttonAdicionarSessao.addEventListener('click', function() {
                        console.log("Botão de adicionar sessão clicado.");
                        // Encontra o ID do filme correspondente ao botão clicado
                        const idFilme = doc.id; // Use o ID do filme atual
                        console.log("ID do filme:", idFilme);
                        // Chama a função para adicionar sessão, passando o ID do filme
                        adicionarSessoesSemana(idFilme);
                    });

                    // Função para adicionar sessões para a semana
                    function adicionarSessoesSemana(idFilme) {
                        // Exibe o formulário de sessão
                        const formSessao = document.getElementById('formSessao');
                        formSessao.style.display = 'block';

                        // Adiciona um evento para lidar com o envio do formulário
                        formSessao.addEventListener('submit', async (e) => {
                            e.preventDefault(); // Impede o comportamento padrão de enviar o formulário
                            const horario = document.getElementById('horario').value;
                            const diaSemana = document.getElementById('dia_semana').value;
                            const sala = document.getElementById('sala').value;

                            try {
                                // Adicionar a sessão à coleção "sessaoFilme" no Firestore
                                const sessaoRef = await addDoc(collection(db, "sessaoFilme"), {
                                    idFilme: idFilme,
                                    horario: horario,
                                    sala: sala,
                                    diaSemana: diaSemana // Adicionando o dia da semana ao documento da sessão
                                });
                                console.log("Sessão adicionada com ID: ", sessaoRef.id);
                                // Você pode adicionar aqui alguma lógica para atualizar a interface do usuário se necessário
                            } catch (error) {
                                console.error("Erro ao adicionar sessão: ", error);
                            }
                        });
                    }
        
                    document.getElementById('voltar').addEventListener('click', function() {
                        document.getElementById('formSessao').style.display = 'none';
                    }); 
                    
                    // Alterar o tipo do botão "Voltar" para evitar envio do formulário
                    document.getElementById('voltar').type = 'button';
                    
                    document.addEventListener('DOMContentLoaded', function() {
                        // Seletor para o container de filmes da semana
                        const filmesDaSemanaContainer = document.getElementById('filmesDaSemana');
                    
                        // Função para renderizar os filmes da semana
                        function renderizarFilmes(querySnapshot) {
                            querySnapshot.forEach((doc) => {
                                const data = doc.data();
                                if (data) {
                                    // Criar elementos HTML para cada filme
                                    const divCol = document.createElement('div');
                                    divCol.classList.add('col-md-3');
                    
                                    const img = document.createElement('img');
                                    img.src = "../" + data.capa; // Substitua 'imagem' pelo campo correto no seu documento Firestore
                                    img.classList.add('img-fluid');
                                    img.classList.add('imgcapa');
                                    img.alt = 'Capa do Filme';
                    
                                    const h3 = document.createElement('h3');
                                    h3.textContent = data.nome; // Substitua 'nome' pelo campo correto no seu documento Firestore
                    
                                    // Botão "Adicionar Sessão" para cada filme
                                    const buttonAdicionarSessao = document.createElement('button');
                                    buttonAdicionarSessao.type = 'button';
                                    buttonAdicionarSessao.classList.add('btn', 'btn-info');
                                    buttonAdicionarSessao.textContent = 'Adicionar Sessão';
                                    buttonAdicionarSessao.addEventListener('click', function() {
                                        adicionarSessoesSemana(doc.id);
                                    });

                                    divCol.appendChild(img);
                                    divCol.appendChild(h3);
                                    divCol.appendChild(buttonDestacarFilme);
                                    divCol.appendChild(buttonAdicionarSessao);
                    
                                    filmesDaSemanaContainer.querySelector('.row').appendChild(divCol);
                                }
                            });
                        }
                    
                        // Obter documentos da coleção 'filme'
                        getDocs(collection(db, 'filme'))
                            .then((querySnapshot) => {
                                // Renderizar os filmes da semana
                                renderizarFilmes(querySnapshot);
                            })
                            .catch((error) => {
                                console.error("Erro ao obter documentos:", error);
                            });
                    });                     
                    
                    // Criar botão com base no valor de filmeDestacado
                    const buttonDestacarFilme = document.createElement('button');
                    buttonDestacarFilme.type = 'button';
                    buttonDestacarFilme.classList.add('btn');
                    if (!data.filmeDestacado) {
                        buttonDestacarFilme.classList.add('btn-success'); // Botão vermelho
                        buttonDestacarFilme.textContent = 'Destacar Filme';
                        buttonDestacarFilme.addEventListener('click', function() {
                            destacarFilme(doc.id, doc.data().capa);
                        });
                    } else {
                        buttonDestacarFilme.classList.add('btn-danger'); // Botão verde
                        buttonDestacarFilme.textContent = 'Remover Destaque';
                        filmesDestacados++;
                        buttonDestacarFilme.addEventListener('click', function() {
                            removerDestaqueFilme(doc.id);
                        });
                    }

                    // Adicionar elementos ao divCol
                    divCol.appendChild(img);
                    divCol.appendChild(h3);
                    divCol.appendChild(buttonDestacarFilme);
                    divCol.appendChild(buttonAdicionarSessao);

                    // Adicionar divCol ao container de filmes da semana
                    filmesDaSemanaContainer.querySelector('.row').appendChild(divCol);
                }
            });
        })
        .catch((error) => {
            console.error("Erro ao obter documentos:", error);
        });


        function destacarFilme(idFilme, capa) {
        const filmeRef = doc(db, 'filme', idFilme);
        const filmesEmDestaqueRef = collection(db, 'filmesEmDestaque');
        
        getDocs(filmesEmDestaqueRef)
            .then((querySnapshot) => {
                if (querySnapshot.size < 4) {
                    // Modificar o documento no Firestore para definir filmeDestacado como true
                    updateDoc(filmeRef, { filmeDestacado: true })
                    .then(() => {
                        console.log("Filme destacado com sucesso.");
                        // Adicionar o filme à coleção 'filmesEmDestaque' após destacá-lo
                        addDoc(filmesEmDestaqueRef, { idFilme: idFilme, capa: capa  })
                        .then(() => {
                            console.log("Filme adicionado à coleção filmesEmDestaque.");
                            // Atualizar a contagem de filmes destacados
                            filmesDestacados++;
                            location.reload(); // Atualizar a página após destacar o filme
                        })
                        .catch((error) => {
                            console.error("Erro ao adicionar filme à coleção filmesEmDestaque:", error);
                        });
                    })
                    .catch((error) => {
                        console.error("Erro ao destacar filme:", error);
                    });
                } else {
                    alert("Apenas podes destacar 4 filmes no máximo.");
                }
            })
            .catch((error) => {
                console.error("Erro ao verificar filmes destacados:", error);
            });
    }

    function removerDestaqueFilme(idFilme) {
        const filmeRef = doc(db, 'filme', idFilme);
        const filmesEmDestaqueRef = collection(db, 'filmesEmDestaque');
        
        // Modificar o documento no Firestore para definir filmeDestacado como false
        updateDoc(filmeRef, { filmeDestacado: false })
            .then(() => {
                // Procurar pelo documento correspondente na coleção filmesEmDestaque
                const queryRef = query(filmesEmDestaqueRef, where('idFilme', '==', idFilme));

                getDocs(queryRef)
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            // Remover o documento da coleção filmesEmDestaque
                            deleteDoc(doc.ref)
                                .then(() => {
                                    console.log("Filme destacado removido com sucesso da coleção 'filmesEmDestaque'.");
                                    // Atualizar a contagem de filmes destacados
                                    filmesDestacados--;
                                    location.reload(); // Atualizar a página após remover o destaque do filme
                                })
                                .catch((error) => {
                                    console.error("Erro ao remover destaque do filme da coleção 'filmesEmDestaque':", error);
                                });
                        });
                    })
                    .catch((error) => {
                        console.error("Erro ao buscar o filme destacado na coleção 'filmesEmDestaque':", error);
                    });
            })
            .catch((error) => {
                console.error("Erro ao remover destaque do filme:", error);
            });
    }


    document.addEventListener('DOMContentLoaded', function() {
        const botaoMostrarDiv = document.getElementById('mostrarDiv');
        if (botaoMostrarDiv) {
            botaoMostrarDiv.addEventListener('click', function() {
                const div = document.getElementById('adicionarfilmeEmDestaque');
                if (div) {
                    div.style.display = 'block';
                    localStorage.setItem('adicionarfilmeEmDestaqueVisivel', 'true');
                }
            });
        }
    });
    
    document.addEventListener('DOMContentLoaded', function() {
        const filmesDaSemanaContainer = document.getElementById('filmesDaSemana');
    
        function renderizarFilmes(querySnapshot) {
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data) {
                    const divCol = document.createElement('div');
                    divCol.classList.add('col-md-3');
    
                    const img = document.createElement('img');
                    img.src = "../" + data.capa;
                    img.classList.add('img-fluid');
                    img.classList.add('imgcapa');
                    img.alt = 'Capa do Filme';
    
                    const h3 = document.createElement('h3');
                    h3.textContent = data.nome;
    
                    // Botão "Adicionar Sessão" para cada filme
                    const buttonAdicionarSessao = document.createElement('button');
                    buttonAdicionarSessao.type = 'button';
                    buttonAdicionarSessao.classList.add('btn', 'btn-info');
                    buttonAdicionarSessao.textContent = 'Adicionar Sessão';
                    buttonAdicionarSessao.addEventListener('click', function() {
                        adicionarSessoesSemana(doc.id);
                    });
    
                    divCol.appendChild(img);
                    divCol.appendChild(h3);
                    divCol.appendChild(buttonAdicionarSessao);
    
                    filmesDaSemanaContainer.querySelector('.row').appendChild(divCol);
                }
            });
        }

    });

    document.querySelector('#formNoticia').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const titulo = document.getElementById('titulo').value;
        const descricao = document.getElementById('descricao').value;
        const texto = document.getElementById('texto').value;
        const capa = document.getElementById('capa').files[0];
    
        try {
            // Adicionando documento ao Firestore
            const docRef = await addDoc(collection(db, "noticias"), {
                titulo: titulo,
                descricao: descricao,
                texto: texto,
                capa: 'img/' + capa.name,
            });
        
            console.log("Documento adicionado com ID: ", docRef.id);
            
            // Obtendo a URL da imagem carregada
            const imageUrl = await uploadImageAndGetURL(capa);  // Você precisa implementar essa função
            inserirNoticiaNaGaleria(titulo, descricao, imageUrl);   
        } catch (error) {
            console.error("Erro ao adicionar documento: ", error);
        }
    });    

    document.querySelector('#exampleModal_3 button[type="submit"]').addEventListener('click', async () => {

        const codigo = document.getElementById('codigo').value;

        const querySnapshot = await getDocs(query(collection(db, "assentos"), where("codigo", "==", codigo)));

        if (!querySnapshot.empty) {
            const docData = querySnapshot.docs[0].data(); 
            const nomeDocumento = querySnapshot.docs[0].id; 
            alert(`Código Verificado em: ${nomeDocumento}`);
        } else {
            alert('Código Inválido');
        }
    });


    
    
