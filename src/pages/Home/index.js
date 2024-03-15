// Importa os hooks useState e useEffect do React, que são essenciais para o
//funcionamento do componente.
import { useState, useEffect } from 'react';
// Importa as funções de conexão com o Firebase e as operações de banco de dados do
//Firestore.
import { Link } from "react-router-dom";
import { db, auth } from '../../firebaseConnection';
import "./style.css"
// Importa funções específicas do Firestore para manipulação de documentos e coleções.
import {
  doc,
  setDoc,
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
// Importa funções de autenticação do Firebase para criar usuários, fazer login e logout.
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
// Função principal do componente React, que será renderizada na página.
function Home() {
  // Estado para armazenar o título do post.
  const [titulo, setTitulo] = useState('');
  const [idTarefa, setIdTarefa] = useState('');
  // Estado para armazenar o email e a senha do usuário.
  const [auxiliarTitulo, setAuxiliarTitulo] = useState('');


  const [tarefas, setTarefas] = useState([]);


  // Efeito que carrega os posts do Firestore sempre que o componente é montado.
  useEffect(() => {
    async function loadTarefas() {
      const unsub = onSnapshot(collection(db, "tarefas"), (snapshot) => {
        let listaTarefa = [];
        snapshot.forEach((doc) => {
          listaTarefa.push({
            id: doc.id,
            titulo: doc.data().Titulo
          })
        })
        setTarefas(listaTarefa);
      })
    }
    loadTarefas();
  }, [])


  // Efeito que verifica se o usuário está logado quando o componente é montado.

  // Função para adicionar um novo post ao Firestore.

  async function handleAdd() {
    await addDoc(collection(db, "tarefas"), {
      Titulo: titulo
    })
      .then(() => {
        console.log("CADASTRADO COM SUCESSO")
        setTitulo('');
      })
      .catch((error) => {
        console.log("ERRO " + error);
      })
  }
  // Função para buscar todos os posts do Firestore.
  async function buscarTarefas() {
    const tarefasRef = collection(db, "tarefas");
    await getDocs(tarefasRef)
      .then((snapshot) => {
        let lista = [];
        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            titulo: doc.data().Titulo
          })
        })
        setTarefas(lista);
      })
      .catch((error) => {
        console.log("DEU ALGUM ERRO AO BUSCAR");
      })
  }
  // Função para editar um post existente no Firestore.
  async function editarTarefas(id) {
    const docRef = doc(db, "tarefas", id);
    await updateDoc(docRef, {
      Titulo: titulo
    })
      .then(() => {
        console.log("POST ATUALIZADO!");

        setIdTarefa('');
        setTitulo('');
      })
      .catch((error) => {
        console.log(error);
      })
  }
  // Função para excluir um post do Firestore.
  async function excluirTarefa(id) {
    const docRef = doc(db, "tarefas", id);
    await deleteDoc(docRef)
      .then(() => {
        alert("TAREFA DELETADO COM SUCESSO!");
      })
  }

  // Renderização do componente React.
  return (
    <main>
      <section>
        <h1 className='text-center'>ReactJS + Firebase :</h1>
      </section>




      <section className="container row">
        <div className='col-6'>
          <h2 className='text-start'>Tarefas</h2>
        </div>


      </section>
      <section className='container'>
// Lista de tarefass.
        <div className='text-end'>
          <button className='btn btn-success' onClick={handleAdd}>Cadastrar nova tarefa</button>
        </div>
        <ul>
          {tarefas.map((tarefa) => {
            return (

              <li key={tarefa.id}>
                <span>Titulo: {tarefa.titulo} </span> <br />
                <button className='btn btn-outline-danger' onClick={() => excluirTarefa(tarefa.id)}>Excluir</button>
                <button type='button' className='btn btn-outline-primary' data-bs-toggle="collapse" href={`#collapse-titulo-${tarefa.id}`} role="button" aria-controls={`collapse-titulo-${tarefa.id}`} aria-expanded="false">Editar</button>

                <div className={`collapse input-group `} role='button' id={`collapse-titulo-${tarefa.id}`}>
                  <input
                    className='form-control'
                    type="text"
                    placeholder='Digite um novo titulo'
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    aria-describedby="button-addon1"

                  />
                  <button className="btn btn-outline-secondary" type="button" id="button-addon1" onClick={() => editarTarefas(tarefa.id)}>Confirmar</button>
                </div>

              </li>


            )
          })}
        </ul>

      </section>


    </main>

  );
}
export default Home;