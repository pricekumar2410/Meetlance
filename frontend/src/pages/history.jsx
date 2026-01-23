import React, { useContext, useEffect, useState } from 'react'
import withAuth from '../utils/withAuth'
import { AuthContext } from '../contexts/AuthContext';
import CardContent from '@mui/material/CardContent';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import "../styleCSS/history.css"


function HistoryComponent() {

    const { getHistoryOfUser } = useContext(AuthContext);

    const [meetings, setMeetings] = useState([]);

    const routeTo = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await getHistoryOfUser();
                setMeetings(history);
            } catch {

            }
        }
        fetchHistory();
    }, [])

    let dateFormat = (dataString) => {
        const date = new Date(dataString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();

        return `${day}-${month}-${year}`
    }

    return (
        <div>
            <nav className='meetingNav'>
                <img src="/websiteLogo.png" className='logo' />
                <p onClick={() => {
                    routeTo("/home");
                }}><b>Meet<span style={{ color: "#DC2626" }}>lance</span></b></p>
            </nav>
            {
                (meetings.length !== 0 ? 
                    meetings.map((e, i) => {
                    return (
                        <>
                            <Card key={i} variant="outlined" className='cardContainer'>
                                <CardContent>
                                    <Typography gutterBottom sx={{fontSize: 14 }}>
                                        <b>Code:</b> {e.meetingCode}
                                    </Typography>
                                    <Typography>
                                        <b>Date:</b> {dateFormat(e.date)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </>
                    )
                }) : <><p style={{padding: "1rem"}}><b>No meeting history yet.</b> <br/>Start or join a meeting to see it here.</p></>
                )
            }
        </div>
    )
}

export default withAuth(HistoryComponent);