import React from 'react'
import "../App.css"
import { Link, useNavigate } from "react-router-dom"
import { Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';


export default function LandingPage() {

  const navigate = useNavigate();

  return (
    <div className='LandingPageContainer'>
      <nav className='LandingPageNav'>
        <div>
          <img src='/MeetLogo.png' />
          <p><b>Meet<span style={{ color: "#DC2626" }}>lance</span></b></p>
          
          <Button onClick={() => {
            navigate("/home");
          }} sx={{ color: "white", marginLeft: "1rem", alignItems: "center" }}>
            <HomeIcon sx={{ color: "orange" }} /><b>Home</b>
          </Button>

        </div>
        <div>
          <p>Join as Guest</p>
          <p>Register</p>
          <p>Login</p>
        </div>
      </nav>
      <div className='LandingpageHome'>
        <div>
          <h1>Connect with <span style={{ color: "#DC2626" }}>Meetlance</span></h1>
          <p>To interact with Live Meeting</p>
          <div role='button'>
            <Link to={"/auth"}>Get Started</Link>
          </div>
        </div>
        <div>
          <img src='/mobile.png' />
        </div>
      </div>
    </div>
  )
}
