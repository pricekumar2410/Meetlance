import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, TextField } from '@mui/material';

function joinMeeting() {

    const navigate = useNavigate();

    const isAuthenticated = localStorage.getItem("token");

    const [meetingLink, setMeetingLink] = useState("");

    const handleJoinVedioCall = async () => {
        if (!meetingLink.trim()) {
            alert("Please enter a meeting link first!");
            return;
        }

        let finalCode = meetingLink.trim();

        try {
            if (finalCode.includes("http")) {
                const urlParts = new URL(finalCode);
                finalCode = urlParts.pathname.substring(1);
            }
        } catch (error) {
            console.error("Invalid URL format");
        }
        navigate(`/${finalCode}`);
    }

    return (
        <>
            <nav className='meetingNav'>
                <img src="/websiteLogo.png" className='logo' style={{ marginLeft: "2rem", borderRadius: "10%", border: "1px solid #dee1e7", width: "1.95rem", height: "1.8rem" }} />
                {!isAuthenticated ?
                    <p onClick={() => {
                        navigate("/");
                    }}><b>Meet<span style={{ color: "#DC2626" }}>lance</span></b></p> :
                    <p onClick={() => {
                        navigate("/home");
                    }}><b>Meet<span style={{ color: "#DC2626" }}>lance</span></b></p>
                }
            </nav>
            <div className='meeting-home'>
                <div className='meeting-inside'>
                    <div>
                        <h2>Connect with Secure Video Meetings Instantly</h2>
                    </div>
                    <div className='joinMeeting'>
                        <p style={{ marginBottom: "12px" }}><b>Enter Meeting Link:</b></p>
                        <TextField onChange={e => setMeetingLink(e.target.value)} id="outlined-basic" label="Meeting Link" variant='outlined' required />
                        <Button onClick={handleJoinVedioCall} variant='contained' sx={{ margin: "0.6rem", marginLeft: "1.2rem" }}>Join</Button>
                    </div>
                </div>
                <div>
                    <img src='/joinMeeting.svg' />
                </div>
            </div>

        </>
    )
}

export default joinMeeting;