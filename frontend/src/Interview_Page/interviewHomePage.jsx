import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Logout from '@mui/icons-material/Logout';
import AddBoxIcon from '@mui/icons-material/AddBox';
import PortraitIcon from '@mui/icons-material/Portrait';
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import withAuth from '../utils/withAuth';
import "../styleCSS/interviewHomePage.css";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

function interviewHomePage() {

    const navigate = useNavigate();

    const { userData } = React.useContext(AuthContext);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <>
            <nav className='interviewNavbar'>
                <div onClick={() => {
                    navigate("/home");
                }}>
                    <img src="/websiteLogo.png" style={{ borderRadius: "20%", border: "1px solid #2563EB" }} />
                    <p style={{ display: "contents", fontSize: "x-large", color: "#2563EB" }}><b>Meet<span style={{ color: "#DC2626" }}>lance</span></b></p>
                </div>
                <div>
                    <React.Fragment>
                        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                            <Tooltip title="Profile">
                                <IconButton
                                    onClick={handleClick}
                                    size="small"
                                    sx={{ ml: 2, color: "red" }}
                                    aria-controls={open ? 'account-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                >
                                    <Avatar sx={{ width: 32, height: 32, color: "#2563EB", bgcolor: "#FFA511" }}><b>M</b></Avatar>
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Menu
                            anchorEl={anchorEl}
                            id="account-menu"
                            open={open}
                            onClose={handleClose}
                            onClick={handleClose}
                            slotProps={{
                                paper: {
                                    elevation: 0,
                                    sx: {
                                        overflow: 'visible',
                                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                        mt: 1.5,
                                        '& .MuiAvatar-root': {
                                            width: 32,
                                            height: 32,
                                            ml: -0.5,
                                            mr: 1,
                                        },
                                        '&::before': {
                                            content: '""',
                                            display: 'block',
                                            position: 'absolute',
                                            top: 0,
                                            right: 14,
                                            width: 10,
                                            height: 10,
                                            bgcolor: 'background.paper',
                                            transform: 'translateY(-50%) rotate(45deg)',
                                            zIndex: 0,
                                        },
                                    },
                                },
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <MenuItem sx={{ cursor: "default" }}>
                                <p style={{ display: "contents", fontSize: "x-large", color: "#2563EB" }}><b>Meet<span style={{ color: "red" }}>lance</span></b></p>
                            </MenuItem>
                            <Divider />
                            <MenuItem sx={{ cursor: "default" }}>
                                {userData?.name}
                            </MenuItem>
                            <MenuItem sx={{ cursor: "default" }}>
                                {userData?.username}
                            </MenuItem>
                            <MenuItem sx={{ cursor: "default" }}>
                                {userData?.email}
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={() => {
                                localStorage.removeItem("token")
                                navigate("/")
                            }} style={{ color: "red" }}>
                                <ListItemIcon>
                                    <Logout fontSize="small" color='error' />
                                </ListItemIcon>
                                <b>Logout</b>
                            </MenuItem>
                        </Menu>
                    </React.Fragment>
                </div>
            </nav>
            <div className='interviewContainer'>
                <div style={{ marginTop: "-7rem" }}>
                    <h2>Prepare, Perform & Succeed in Your Interview.</h2>
                    <h3 style={{ padding: "10px 0px 7px 3px" }}>Create or Join Interview Session!</h3>
                    <div className='all-Btn'>
                        <div className='btn btn1'>
                            <IconButton>
                                <AddBoxIcon sx={{ fontSize: "2.5rem", marginTop: "0.5rem", color: "white" }} />
                            </IconButton>
                            <p><b>Create Session</b></p>
                        </div>
                        <div className='btn btn2'>
                            <IconButton>
                                <PortraitIcon sx={{ fontSize: "2.5rem", marginTop: "0.5rem", color: "white" }} />
                            </IconButton>
                            <p><b>Join Session</b></p>
                        </div>
                    </div>
                </div>
                <div className='historyContainer'>
                    <h3 style={{ padding: "10px 0px 2px 10px" }}>Your Past Session</h3>
                    <div className="cardContainer">
                        <Card sx={{ minWidth: 275 }}>
                            <CardContent>
                                <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                                    not histroy yet
                                </Typography>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

export default withAuth(interviewHomePage);