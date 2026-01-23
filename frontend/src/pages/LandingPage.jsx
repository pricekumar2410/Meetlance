import React, { useEffect, useState } from 'react'
import "../App.css"
import { Link, useNavigate } from "react-router-dom"
import { Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';

const words = ["Meeting", "Coding", "Interview"];

export default function LandingPage() {

  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];
    let timer;

    if (!deleting && charIndex < currentWord.length) {
      timer = setTimeout(() => {
        setText(currentWord.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, 40);
    } else if (deleting && charIndex > 0) {
      timer = setTimeout(() => {
        setText(currentWord.slice(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      }, 20);
    } else if (!deleting && charIndex === currentWord.length) {
      timer = setTimeout(() => setDeleting(true), 1000);
    } else if (deleting && charIndex === 0) {
      setDeleting(false);
      setWordIndex((wordIndex + 1) % words.length);
    }

    return () => clearTimeout(timer);
  }, [charIndex, deleting, wordIndex]);

  return (
    <div className='LandingPageContainer'>
      <nav className='LandingPageNav'>
        <div>
          <img src='/MeetLogo.png' />
          <p><b>Meet<span style={{ color: "#DC2626" }}>lance</span></b></p>

          <Button onClick={() => {
            navigate("/home");
          }} sx={{ color: "white", marginLeft: "1rem", alignItems: "center" }}>
            <GridViewRoundedIcon sx={{ color: "#FFA511" }} /><b>Dashboard</b>
          </Button>

        </div>
        <div>
          <p>Join as Guest</p>
          <p onClick={() => { navigate("/auth") }}>Register</p>
          <p onClick={() => { navigate("/auth") }}>Login</p>
        </div>
      </nav>
      <div className='LandingpageHome'>
        <div>
          <h1>Connect with your <span style={{ color: "#2563EB" }}>Meet</span><span style={{ color: "#DC2626" }}>lance</span></h1>
          <h2 style={{ marginTop: "6px", paddingLeft: "3px" }}>To interact with Live <span style={{ color: "#FFA511" }}>{text}</span></h2>
          <div role='button' className='getStartedDiv'>
            <Link to={"/auth"} className='getStartedBtn'>Get Started</Link>
          </div>
        </div>
        <div>
          <img src='/mobile.png' />
        </div>
      </div>
    </div>
  )
}
