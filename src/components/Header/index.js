import { Link } from 'react-router-dom'
import "./style.css"
import { useState, useEffect } from 'react';
import { db, auth } from '../../firebaseConnection';

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';

import imagelogo from "../../assets/images/task.png"

function Header() {

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

    async function fazerLogout() {
        await signOut(auth)
        setUser(false);
        setUserDetail({});
      }

    return (
        <nav className="nav navbar-expand  bg-header p-1">
            <div className='container-fluid text-start d-flex align-items-center'>
                <Link to='/' className='navbar-brand logo-texto' href='#'>
                    <img src={imagelogo} alt='logo' className='d-inline-block align-text-center logo-imagem'></img>
                    MyTasks
                </Link>
            </div>
            <div className={`container-fluid  text-end ${user ? 'dropdown' : ''}`}>
                { user?(
                    <>
                    <button className='btn bg-botao dropdown-toggle m-2' type='button' data-bs-toggle='dropdown' aria-expanded="false">{userDetail.email}</button>
                    <ul className='dropdown-menu'>
                        <li><button onClick={fazerLogout} className='dropdown-item'>Sair</button></li>
                    </ul>
                    </>
                ) : (
                    <>
                    <Link className='btn bg-botao m-2' to="/login">Cadastrar</Link>
                    <Link className='btn bg-botao m-2' to="/login">Login</Link>
                    </>
                )}
                
            </div>
        </nav>

    )
}

export default Header;