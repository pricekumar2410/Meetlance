import React, { useContext, useEffect, useState } from 'react'
import withAuth from '../utils/withAuth'
import { AuthContext } from '../contexts/AuthContext';
import CardContent from '@mui/material/CardContent';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import "../styleCSS/history.css"


// Meeting Code / ID
// Date & Time
// Duration
// Meeting Type (Created / Joined)
// Partici
// Host name
// Meeting Title
// Meeting status (Completed / Missed / Cancelled)
// Search by meeting code
// Filter by date
//  Delete history option

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

        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12;
        const minutesStr = minutes < 10 ? "0" + minutes : minutes;

        return `${day}-${month}-${year} \u00A0  ${hours}:${minutesStr} ${ampm}`;
    }

    return (
        <div className='history-box'>
            <div className="navbarFix">
                <nav className='meetingNavs' >
                    <div className='websiteName' onClick={() => {
                        routeTo("/home");
                    }}>
                        <img src="/websiteLogo.png" style={{ marginTop: "2px", marginLeft: "2rem", borderRadius: "10%", border: "1px solid #dee1e7", width: "1.95rem", height: "1.8rem" }} />
                        <p ><b>Meet<span style={{ color: "#DC2626" }}>lance</span></b></p>
                    </div>
                    <h5 className='historyHead'>Meeting History</h5>
                </nav>
                <hr style={{ opacity: "0.4" }} />
                <hr style={{ margin: "1px 8px", opacity: "0.4" }} />
            </div>
            {
                (meetings.length !== 0 ?
                    [...meetings]
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .map((e, i) => {
                            return (
                                <>
                                    <Card key={i} variant="outlined" sx={{ borderRadius: 2.5 }} className='cardContainers'>
                                        <CardContent style={{ backgroundColor: "white", color: "black" }}>
                                            <Typography gutterBottom sx={{ fontSize: 16 }}>
                                                Meeting Code:<b> {e.meetingCode}</b>
                                            </Typography>
                                            <Typography sx={{ fontSize: 14 }}>
                                                Date & Time: <b>{dateFormat(e.date)}</b>
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </>
                            )
                        }) : <><p style={{ padding: "1rem" }}><b>No meeting history yet.</b> <br />Start or join a meeting to see it here.</p></>
                )
            }
            <hr style={{ opacity: "0.1" }} />
        </div>
    )
}

export default withAuth(HistoryComponent);