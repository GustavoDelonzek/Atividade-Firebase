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

    return (
        <nav className="nav navbar-expand-lg border-bottom">
            <div className='container-fluid'>
                <Link to='/' className='navbar-brand' href='#'>
                    <img src={imagelogo} alt='logo' width='44' className='d-inline-block align-text-center'></img>
                    MyTasks
                </Link>
            </div>
            <div className='container-fluid text-end'>
                <Link className='btn btn-primary m-1' to="/login">Cadastrar</Link>
                <Link className='btn btn-warning m-1' to="/login">Login</Link>
            </div>
        </nav>

    )
}

export default Header;