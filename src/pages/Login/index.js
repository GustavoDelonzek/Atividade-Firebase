//funcionamento do componente.
import { useState, useEffect } from 'react';
// Importa as funções de conexão com o Firebase e as operações de banco de dados do
//Firestore.
import { Link, redirect, useNavigate } from "react-router-dom";
import { db, auth } from '../../firebaseConnection';
import "./style.css"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  // Estado para verificar se o usuário está logado.
  const [user, setUser] = useState(false);
  const [userDetail, setUserDetail] = useState({});

  const navigate = useNavigate();

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
        navigate('/')
      })
      .catch(() => {
        alert('Email ou senha incorretos! Tente novamente')
        console.log("ERRO AO FAZER O LOGIN");
      })
  }
  // Função para fazer logout de um usuário no Firebase Auth.
  async function fazerLogout() {
    await signOut(auth)
    setUser(false);
    setUserDetail({});
  }
  return (
    <main className='main-login d-flex flex-column justify-content-center '>
        <div className="container container-login d-flex flex-column">
          <h2 className='text-center m-3'>Login</h2>
          <div className='form-floating mb-3'>
            <input type='email' value={email} onChange={(e) => setEmail(e.target.value)}placeholder="exemplo@exemplo.com" id='floatingInput' className='form-control' />
            <label for="floatingInput">Email</label>
            
          </div>
          <div className='form-floating mb-3'>
            
            <input value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Informe sua senha" className='form-control'id='floatingInput1' type='password'/>
            <label for='floatingInput1'>Senha</label>
          </div>
          <div className='row d-flex justify-content-center mt-3'>
          <button className='btn btn-outline-primary col-sm-5 col-12 m-1' onClick={novoUsuario}>Cadastrar</button>

          <button className='btn btn-outline-success col-sm-5 col-12 m-1' onClick={logarUsuario}>Fazer login</button>
          </div>
          
        </div>
    </main>
  );

}

export default Login;