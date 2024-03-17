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

import imagemHome from "../../assets/images/Studying-amico.svg"

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
    if(auxiliarTitulo !== ''){
      await addDoc(collection(db, "tarefas"), {
        Titulo: auxiliarTitulo
      })
        .then(() => {
          console.log("CADASTRADO COM SUCESSO")
          setTitulo('');
          setAuxiliarTitulo('');
        })
        .catch((error) => {
          console.log("ERRO " + error);
        })
    } else{
      alert('Você deve inserir algo para cadastrar nova tarefa.')
    }
    
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
    <main className='d-flex flex-column justify-content-center align-items-center'>
      <section className='row introducao container-fluid p-2'>
     
      <div className='col-md-6 col-12 d-flex flex-column justify-content-center'>
        <h1 className='titulo-principal text-center'>ReactJS+Firebase:</h1>
        <p className='text-center texto-principal'>Integrando banco de dados noSQL para criação de um site de tarefas.</p>
      </div>
      <div className='col-md-6 col-12 d-flex justify-content-center'>
        <img src={imagemHome} className='img-fluid'></img>
      </div>
      </section>
      <section className='column container-fluid tarefas-container p-5'>
        <div className='col-12 p-2 mb-4'>
          <h2 className='text-center titulo-tarefas'>Suas Tarefas</h2>
        </div>
        <div className='input-group container'>
          <input className='form-control' aria-describedby="button-addon3" value={auxiliarTitulo} onChange={(e) => setAuxiliarTitulo(e.target.value)} type='text' placeholder="Ex: 'Varrer a casa...'"></input>
          <button className='btn bg-azulzinho' id='button-addon3' onClick={handleAdd}>Cadastrar nova tarefa</button>
        </div>
      


        <ul className='row pt-5 pe-5 ps-5'>
          {tarefas.map((tarefa) => {
            return (
              
              <li className='col-lg-4 col-md-6 col-12 mb-3' key={tarefa.id}>
                <div className='card'>
                <div className='card-body text-center'>
                <h4 className='card-title p-2'>{tarefa.titulo} </h4> 
                <button className='btn btn-outline-danger btn-sm m-1' onClick={() => excluirTarefa(tarefa.id)}><i className='fa-solid fa-trash'></i></button>
                <button type='button' className='btn bg-botao btn-sm m-1' data-bs-toggle="collapse" href={`#collapse-titulo-${tarefa.id}`} role="button" aria-controls={`collapse-titulo-${tarefa.id}`} aria-expanded="false"><i class="fa-solid fa-pen"></i></button>
                <div className={`collapse input-group pt-2`} role='button' id={`collapse-titulo-${tarefa.id}`}>
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
                </div>
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