//funcionamento do componente.
import { useState, useEffect } from 'react';
// Importa as funções de conexão com o Firebase e as operações de banco de dados do
//Firestore.
import { Link } from "react-router-dom";
import { db, auth } from '../../firebaseConnection';

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
  } from 'firebase/auth';

function Login(){
    const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  // Estado para verificar se o usuário está logado.
  const [user, setUser] = useState(false);
  const [userDetail, setUserDetail] = useState({});
    useEffect(() => {
        async function checkLogin() {
          onAuthStateChanged(auth, (user) => {
            if (user) {
              console.log(user);
              setUser(true);
              setUserDetail({
                uid: user.uid,
                email: user.email
              })
            } else {
              setUser(false);
              setUserDetail({})
            }
          })
        }
        checkLogin();
      }, [])

      // Função para criar um novo usuário no Firebase Auth.
  async function novoUsuario() {
    await createUserWithEmailAndPassword(auth, email, senha)
      .then(() => {
        console.log("CADASTRADO COM SUCESSO!");
        setEmail('');
        setSenha('');
      })
      .catch((error) => {
        if (error.code === 'auth/weak-password') {
          alert("Senha muito fraca.");
        } else if (error.code === 'auth/email-already-in-use') {
          alert("Email já existe!");
        }
      })
  }
  // Função para fazer login de um usuário no Firebase Auth.
  async function logarUsuario() {
    await signInWithEmailAndPassword(auth, email, senha)
      .then((value) => {
        console.log("USER LOGADO COM SUCESSO");
        console.log(value.user);
        setUserDetail({
          uid: value.user.uid,
          email: value.user.email,
        })
        setUser(true);

        setEmail('');
        setSenha('');
      })
      .catch(() => {
        console.log("ERRO AO FAZER O LOGIN");
      })
  }
  // Função para fazer logout de um usuário no Firebase Auth.
  async function fazerLogout() {
    await signOut(auth)
    setUser(false);
    setUserDetail({});
  }
    return(
        <main>
        {user && (
            <div>
              <strong>Seja bem-vindo(a) (Você está logado!)</strong> <br />
              <span>ID: {userDetail.uid} - Email: {userDetail.email}</span> <br />
              <Link className='btn btn-danger' to="/" onClick={fazerLogout}>Sair da conta</Link>
              <br /> <br />
            </div>
          )}
    // Seção para cadastro e login de usuários.
          <div className="container">
            <h2>Usuarios</h2>
            <label>Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite um email"
            /> <br />
            <label>Senha</label>
            <input
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Informe sua senha"
            /> <br />
            <button onClick={novoUsuario}>Cadastrar</button>
    
            <Link to="/" className='btn btn-outline-success' onClick={logarUsuario}>Fazer login</Link>
          </div>
          <br /><br />
          <hr />

          </main>
    );
    
}

export default Login;