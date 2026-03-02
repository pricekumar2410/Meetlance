import React, { useEffect, useState } from 'react'
import "../styleCSS/LandingPage.css";
import { Link, useNavigate } from "react-router-dom"
import { Button, MenuList } from '@mui/material';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Logout from '@mui/icons-material/Logout';

import { AuthContext } from '../contexts/AuthContext';

const words = ["Meeting", "Coding", "Interview"];

export default function LandingPage() {

  const isAuthenticated = localStorage.getItem("token");
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
    <div className='LandingPageContainer'>
      <div className="stars-wrapper">
        <div className="stars"></div>
      </div>

      <nav className='LandingPageNav'>
        <div>
          <div>
            <img src="/websiteLogo.png" className='navImg' />
            <p className='Meetlance'><b>Meet<span style={{ color: "#DC2626" }}>lance</span></b></p>
          </div>
          <Button className='dashboard' onClick={() => {
            navigate("/home");
          }} sx={{ color: "white", marginTop: "2px", marginLeft: "1rem", alignItems: "center" }}>
            <GridViewRoundedIcon sx={{ color: "#FFA511" }} /><b>Dashboard</b>
          </Button>

        </div>
        <div>

          {!isAuthenticated ? (
            <>
              <div className='guestContainer'>
                <p onClick={() => { navigate("/joinmeeting") }} style={{ color: "white", fontSize: "1rem", cursor: "pointer" }}>Join as Guest</p>
                <span className="joinPopup-box">Guest can only join meetings!</span>
              </div>
              <p onClick={() => { navigate("/auth") }} style={{ marginRight: "1rem" }}>Register</p>
              <p onClick={() => { navigate("/auth") }}>Login</p>

            </>
          ) :
            <>
              <React.Fragment>
                <Box className="profileBox" sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                  <Tooltip title="Profile">
                    <IconButton
                      onClick={handleClick}
                      size="small"
                      sx={{ ml: 2, color: "red" }}
                      aria-controls={open ? 'account-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? 'true' : undefined}
                    >
                      <Avatar sx={{ width: 32, height: 32, color: "#2563EB", bgcolor: "#FFA511" }}><b>{(userData?.name).split(" ").map(word => word.charAt(0).toUpperCase()).join("")}</b></Avatar>
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
                    <b>{userData?.name}</b>
                  </MenuItem>
                  <MenuItem sx={{ cursor: "default" }}>
                    <b>{userData?.username}</b>
                  </MenuItem>
                  <MenuItem sx={{ cursor: "default" }}>
                    <b>{userData?.email}</b>
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
            </>
          }
        </div>
      </nav>
      <div className='LandingpageHome'>
        <div className='textOrder'>
          <h1>Connect with your <span style={{ color: "#2563EB" }}>Meet</span><span style={{ color: "#DC2626" }}>lance</span></h1>
          <h2 style={{ marginTop: "6px", paddingLeft: "3px" }}>To interact with Live <span style={{ color: "#FFA511" }}>{text}</span></h2>
          <div role='button' className='getStartedDiv'>
            {!isAuthenticated ?
              <Link to={"/auth"} className='getStartedBtn'>Get Started</Link> :
              <Link to={"/home"} className='getStartedBtn'>Get Started</Link>
            }
          </div>
        </div>
        <div className='imageOrder'>
          <img src='/mobile.png' />
        </div>
      </div>
    </div>
  )
}
