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
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import withAuth from '../utils/withAuth';
import "../styleCSS/interviewHomePage.css";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import server from '../environment';

function interviewHomePage() {

    const navigate = useNavigate();

    const { userData } = React.useContext(AuthContext);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    // Create Session Modal State
    const [openCreateDialog, setOpenCreateDialog] = React.useState(false);
    const [createFormData, setCreateFormData] = React.useState({
        interviewType: 'interviewer',
        interviewerName: userData?.name || '',
        interviewUsername: userData?.username || '',
        interviewCode: ''
    });
    const [isCreating, setIsCreating] = React.useState(false);
    const [createError, setCreateError] = React.useState('');

    // Join Session Modal State
    const [openJoinDialog, setOpenJoinDialog] = React.useState(false);
    const [joinFormData, setJoinFormData] = React.useState({
        candidateName: userData?.name || '',
        candidateUsername: userData?.username || '',
        interviewCode: ''
    });
    const [isJoining, setIsJoining] = React.useState(false);
    const [joinError, setJoinError] = React.useState('');

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // Create Session Handlers
    const handleOpenCreateDialog = () => {
        setCreateFormData({
            interviewType: 'interviewer',
            interviewerName: userData?.name || '',
            interviewUsername: userData?.username || '',
            interviewCode: generateSessionCode()
        });
        setCreateError('');
        setOpenCreateDialog(true);
    };

    const handleCloseCreateDialog = () => {
        setOpenCreateDialog(false);
    };

    const handleCreateChange = (e) => {
        const { name, value } = e.target;
        setCreateFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateSession = () => {
        if (!createFormData.interviewerName || !createFormData.interviewUsername || !createFormData.interviewCode) {
            setCreateError('Please fill all fields');
            return;
        }
        handleCloseCreateDialog();
        navigate(`/interview-room/${createFormData.interviewCode}`, {
            state: {
                role: 'interviewer',
                sessionCode: createFormData.interviewCode,
                username: createFormData.interviewUsername,
                name: createFormData.interviewerName
            }
        });
    };

    // Join Session Handlers
    const handleOpenJoinDialog = () => {
        setJoinFormData({
            candidateName: userData?.name || '',
            candidateUsername: userData?.username || '',
            interviewCode: ''
        });
        setJoinError('');
        setOpenJoinDialog(true);
    };

    const handleCloseJoinDialog = () => {
        setOpenJoinDialog(false);
    };

    const handleJoinChange = (e) => {
        const { name, value } = e.target;
        setJoinFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleJoinSession = () => {
        if (!joinFormData.candidateName || !joinFormData.candidateUsername || !joinFormData.interviewCode) {
            setJoinError('Please fill all fields');
            return;
        }
        handleCloseJoinDialog();
        navigate(`/interview-room/${joinFormData.interviewCode}`, {
            state: {
                role: 'candidate',
                sessionCode: joinFormData.interviewCode,
                username: joinFormData.candidateUsername,
                name: joinFormData.candidateName
            }
        });
    };

    const generateSessionCode = () => {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
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
                </div>
            </nav>
            <div className='interviewContainer'>
                <div style={{ marginTop: "-7rem" }}>
                    <h2>Prepare, Perform & Succeed in Your Interview.</h2>
                    <h3 style={{ padding: "10px 0px 7px 3px" }}>Create or Join Interview Session!</h3>
                    <div className='all-Btn'>
                        <div className='btn btn1' onClick={handleOpenCreateDialog} style={{ cursor: 'pointer' }}>
                            <IconButton>
                                <AddBoxIcon sx={{ fontSize: "2.5rem", marginTop: "0.5rem", color: "white" }} />
                            </IconButton>
                            <p><b>Create Session</b></p>
                        </div>
                        <div className='btn btn2' onClick={handleOpenJoinDialog} style={{ cursor: 'pointer' }}>
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

            {/* CREATE SESSION DIALOG */}
            <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ bgcolor: '#2563EB', color: 'white', fontWeight: 'bold' }}>
                    Create Interview Session
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    {createError && <Alert severity="error" sx={{ mb: 2 }}>{createError}</Alert>}

                    <FormControl fullWidth sx={{ mb: 2, mt: 4 }}>
                        <InputLabel>Interview Type</InputLabel>
                        <Select
                            name="interviewType"
                            value={createFormData.interviewType}
                            onChange={handleCreateChange}
                            label="Interview Type"
                        >
                            <MenuItem value="interviewer">Interviewer</MenuItem>
                            <MenuItem value="student">Student</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        label="Your Name"
                        name="interviewerName"
                        value={createFormData.interviewerName}
                        onChange={handleCreateChange}
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        fullWidth
                        label="Username"
                        name="interviewUsername"
                        value={createFormData.interviewUsername}
                        onChange={handleCreateChange}
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        fullWidth
                        label="Interview Code"
                        name="interviewCode"
                        value={createFormData.interviewCode}
                        InputProps={{ readOnly: true }}
                        helperText="Auto-generated code"
                        sx={{ mb: 2 }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleCloseCreateDialog}>Cancel</Button>
                    <Button
                        onClick={handleCreateSession}
                        variant="contained"
                    >
                        Create & Enter
                    </Button>
                </DialogActions>
            </Dialog>

            {/* JOIN SESSION DIALOG */}
            <Dialog open={openJoinDialog} onClose={handleCloseJoinDialog} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ bgcolor: '#2563EB', color: 'white', fontWeight: 'bold' }}>
                    Join Interview Session
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    {joinError && <Alert severity="error" sx={{ mb: 2 }}>{joinError}</Alert>}

                    <TextField
                        fullWidth
                        label="Your Name"
                        name="candidateName"
                        value={joinFormData.candidateName}
                        onChange={handleJoinChange}
                        sx={{ mb: 2, mt: 4 }}
                    />

                    <TextField
                        fullWidth
                        label="Username"
                        name="candidateUsername"
                        value={joinFormData.candidateUsername}
                        onChange={handleJoinChange}
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        fullWidth
                        label="Interview Code"
                        name="interviewCode"
                        value={joinFormData.interviewCode}
                        onChange={handleJoinChange}
                        placeholder="Enter code provided by interviewer"
                        sx={{ mb: 2 }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleCloseJoinDialog}>Cancel</Button>
                    <Button
                        onClick={handleJoinSession}
                        variant="contained"
                    >
                        Join Session
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default withAuth(interviewHomePage);