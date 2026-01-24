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
import RestoreIcon from '@mui/icons-material/Restore';
import AddBoxIcon from '@mui/icons-material/AddBox';
import PortraitIcon from '@mui/icons-material/Portrait';
import HandshakeIcon from '@mui/icons-material/Handshake';
import CodeIcon from '@mui/icons-material/Code';

import withAuth from '../utils/withAuth';
import "../styleCSS/home.css";
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';

function HomeComponent() {

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
            <nav className='homeNavbar'>
                <div>
                    <img src="/websiteLogo.png" style={{ borderRadius: "20%", border: "1px solid #2563EB" }} />
                    <p style={{ display: "contents", fontSize: "x-large", color: "#2563EB" }}><b>Meet<span style={{ color: "#DC2626" }}>lance</span></b></p>
                </div>
                <div>
                    <Button sx={{ color: "black", marginRight: "2rem" }} onClick={() => {
                        navigate("/practicecode");
                    }}>
                        <CodeIcon />&nbsp;<b>Coding</b>
                    </Button>
                    <Button sx={{ color: "black", marginRight: "2rem" }} onClick={() => {
                        navigate("/history");
                    }}>
                        <RestoreIcon sx={{ fontSize: "1.4rem" }} /> &nbsp;<p><b>history</b></p>
                    </Button>
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
            <div className='bottomPart'>
                <div>
                    <h1>Connnect instantly with video Meetings</h1>
                    <h3 style={{ padding: "5px" }}>Seamless video calls for teams and friends</h3>
                    <div className='all-Btn'>
                        <div className='btn btn1' onClick={() => {
                            navigate("/addMeeting");
                        }}>
                            <IconButton>
                                <AddBoxIcon sx={{ fontSize: "2.5rem", marginTop: "0.5rem", color: "white" }} />
                            </IconButton>
                            <p><b>Create Meeting</b></p>
                        </div>
                        <div className='btn btn2' onClick={() => {
                            navigate("/joinmeeting");
                        }}>
                            <IconButton>
                                <PortraitIcon sx={{ fontSize: "2.5rem", marginTop: "0.5rem", color: "white" }} />
                            </IconButton>
                            <p><b>Join Meeting</b></p>
                        </div>
                    </div>
                    <div className='all-Btn'>
                        <div className='btn btn3' onClick={() => {
                            navigate("/practicecode");
                        }}>
                            <IconButton>
                                <CodeIcon sx={{ fontSize: "2.5rem", marginTop: "0.5rem", color: "white" }} />
                            </IconButton>
                            <p><b>Pratice Coding</b></p>
                        </div>
                        <div className='btn btn4'>
                            <IconButton>
                                <HandshakeIcon sx={{ fontSize: "2.5rem", marginTop: "0.5rem", color: "white" }} />
                            </IconButton>
                            <p><b>Interview</b></p>
                        </div>
                    </div>
                </div>
                <div>
                    <img src='/homeimgs.png' className='bottomImg' />
                </div>
            </div>
        </>
    );
}

export default withAuth(HomeComponent);