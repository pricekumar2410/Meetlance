import React from 'react'
import "../App.css"
import {Link} from "react-router-dom"

export default function LandingPage() {
  return (
    <div className='LandingPageContainer'>
      <nav className='LandingPageNav'>
        <div>
          <img src='/Meetlance1.png' />
          <p><b>Meet<span style={{color: "red"}}>lance</span></b></p>
        </div>
        <div>
          <p>Join as Guest</p>
          <p>Register</p>
          <p>Login</p>
        </div>
      </nav>
      <div className='LandingpageHome'>
        <div>
          <h1>Connect with <span style={{color: "red"}}>Meetlance</span></h1>
          <p>To interact in real time with Meeting</p>
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
