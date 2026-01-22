import React, { useState } from 'react'
import withAuth from '../utils/withAuth'
import { useNavigate } from 'react-router-dom';
import { Button, TextField } from '@mui/material';

import "../styleCSS/addMeeting.css";

function AddMeeting() {

    const navigate = useNavigate();

    const [meetingCode, setMeetingCode] = useState("");
    const handleJoinVedioCall = async () => {
        navigate(`/${meetingCode}`);
    }

    return (
        <>
            <nav className='meetingNav'>
                <p onClick={() => {
                    navigate("/home");
                }}><b>Meet<span style={{ color: "#DC2626" }}>lance</span></b></p>
            </nav>
            <div className='meeting-home'>
                <div className='meeting-inside'>
                    <div>
                        <h2>Join a Secure Video Meeting Instantly</h2>
                    </div>
                    <div className='joinMeeting'>
                        <TextField onChange={e => setMeetingCode(e.target.value)} id="outlined-basic" label="Meeting Code" variant='outlined' />
                        <Button onClick={handleJoinVedioCall} variant='contained' sx={{margin: "0.6rem", marginLeft: "1.2rem"}}>Join</Button>
                    </div>
                </div>
                <div>
                    <img src='/vedioCall.svg' />
                </div>
            </div>

        </>
    )
}

export default AddMeeting;