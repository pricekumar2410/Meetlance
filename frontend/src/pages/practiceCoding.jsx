import React from 'react'
import withAuth from '../utils/withAuth'
import { useNavigate } from 'react-router-dom';
import "../styleCSS/practicecode.css";


function PracticeCodingComponent() {

    const navigate = useNavigate();

    return (
        <>
            <nav className='codeNav'>
                <p onClick={() => {
                    navigate("/home");
                }}><b>Meet<span style={{ color: "#DC2626" }}>lance</span></b></p>
            </nav>
        </>
    )
}

export default withAuth(PracticeCodingComponent);