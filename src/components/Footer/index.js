import { useState, useEffect } from "react";
import {Link} from "react-router-dom"
import './style.css'


function Footer(){
    return(
        <footer className="bg-footer d-flex justify-content-center align-items-center">
            <p>Todos os direitos reservados©</p>
        </footer>
    )
}

export default Footer;