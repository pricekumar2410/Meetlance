import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from "socket.io-client"
import "../styleCSS/VedioCall.css";
import { Badge, IconButton, TextField, Button } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import ChatIcon from '@mui/icons-material/Chat';
import server from '../environment';

const server_url = server;
var connections = {};

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
}

export default function VedioComponent() {
    const { url } = useParams();
    let routeTo = useNavigate();

    const isAuthenticated = localStorage.getItem("token");

    var socketRef = useRef();
    let socketIdRef = useRef();
    let localVideoRef = useRef();

    let [videoAvailable, setVideoAvailable] = useState(true);
    let [audioAvailable, setAudioAvailable] = useState(true);
    let [video, setVedio] = useState(true);
    let [audio, setAudio] = useState(true);
    let [screen, setScreen] = useState();
    let [screenAvailable, setScreenAvailable] = useState();

    let [showModel, setModel] = useState(false);
    let [messages, setMessages] = useState([]);
    let [message, setMessage] = useState("");
    let [newMessages, setNewmessages] = useState(0);

    let [askForUsername, setAskForUsername] = useState(true);
    let [username, setUsername] = useState("");
    let [videos, setVideos] = useState([]);

    const getPermissions = async () => {
        try {
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoPermission) {
                setVideoAvailable(true);
            } else {
                setVideoAvailable(false);
            }

            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (audioPermission) {
                setAudioAvailable(true);
            } else {
                setAudioAvailable(false);
            }

            if (navigator.mediaDevices.getDisplayMedia) {
                setScreenAvailable(true);
            } else {
                setScreenAvailable(false);
            }

            if (videoAvailable || audioAvailable) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable });
                if (userMediaStream) {
                    window.localStream = userMediaStream;
                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = userMediaStream;
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getPermissions();
    }, []);

    useEffect(() => {
        if (askForUsername === false && localVideoRef.current && window.localStream) {
            localVideoRef.current.srcObject = window.localStream;
        }
    }, [askForUsername]);

    let getUserMediaSuccess = (stream) => {
        try {
            if (window.localStream) {
                window.localStream.getTracks().forEach(track => track.stop());
            }
        } catch (e) { console.log(e); }

        window.localStream = stream;
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
        }

        for (let id in connections) {
            if (id === socketIdRef.current) continue;

            // SDP Order fix: Use addTrack instead of addStream
            stream.getTracks().forEach(track => {
                connections[id].addTrack(track, stream);
            });

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description).then(() => {
                    socketRef.current.emit(
                        "signal",
                        id,
                        JSON.stringify({ sdp: connections[id].localDescription })
                    );
                });
            });
        }
    };

    let silence = () => {
        let ctx = new AudioContext()
        let oscillator = ctx.createOscillator();
        let dst = oscillator.connect(ctx.createMediaStreamDestination());
        oscillator.start();
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
    }

    let blackScreen = ({ width = 648, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height });
        canvas.getContext("2d").fillRect(0, 0, width, height);
        let stream = canvas.captureStream();
        return Object.assign(stream.getVideoTracks()[0], { enabled: false })
    }

    let getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess)
                .catch((e) => console.log(e))
        }
    }

    useEffect(() => {
        if (video !== undefined && audio !== undefined && askForUsername === false) {
            getUserMedia();
        }
    }, [audio, video])

    let gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message)

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === "offer") {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit("signal", fromId, JSON.stringify({ "sdp": connections[fromId].localDescription }))
                            }).catch(e => console.log(e))
                        }).catch(e => console.log(e))
                    }
                }).catch(e => console.log(e))
            }
            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e));
            }
        }
    }

    let addMessage = (data, sender, socketIdSender) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: sender, data: data }
        ]);

        if (socketIdSender !== socketIdRef.current) {
            setNewmessages((prevMessages) => prevMessages + 1)
        }
    }

    let connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false });
        socketRef.current.on('signal', gotMessageFromServer);

        socketRef.current.on("connect", () => {
            socketRef.current.emit("join-call", window.location.href)
            socketIdRef.current = socketRef.current.id;

            socketRef.current.on('chat-message', addMessage)

            socketRef.current.on("user-left", (id) => {
                // Video Hatane ka logic (state filter)
                setVideos((prevVideos) => prevVideos.filter((v) => v.socketId !== id));
                if (connections[id]) {
                    connections[id].ontrack = null;
                    connections[id].onicecandidate = null;
                    connections[id].close();
                    delete connections[id];
                }
            })

            socketRef.current.on("user-joined", (id, clients) => {
                clients.forEach((socketListId) => {
                    if (!connections[socketListId]) {
                        connections[socketListId] = new RTCPeerConnection(peerConfigConnections);

                        connections[socketListId].onicecandidate = (event) => {
                            if (event.candidate != null) {
                                socketRef.current.emit("signal", socketListId, JSON.stringify({ "ice": event.candidate }))
                            }
                        }

                        // Updated from onaddstream to ontrack for better stability
                        connections[socketListId].ontrack = (event) => {
                            setVideos(prevVideos => {
                                const videoExists = prevVideos.find(v => v.socketId === socketListId);
                                if (videoExists) {
                                    return prevVideos.map(v => v.socketId === socketListId ? { ...v, stream: event.streams[0] } : v);
                                } else {
                                    return [...prevVideos, { socketId: socketListId, stream: event.streams[0] }];
                                }
                            });
                        }

                        if (window.localStream) {
                            window.localStream.getTracks().forEach(track => {
                                connections[socketListId].addTrack(track, window.localStream);
                            });
                        }
                    }
                })

                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue
                        connections[id2].createOffer().then((description) => {
                            connections[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit("signal", id2, JSON.stringify({ "sdp": connections[id2].localDescription }))
                                })
                        })
                    }
                }
            })
        })
    }

    let getMedia = () => {
        setVedio(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer();
    }

    let connect = () => {
        setAskForUsername(false);
        getMedia();
    }

    let handleVideo = () => {
        setVedio(!video);
        if (window.localStream) {
            window.localStream.getVideoTracks().forEach(track => {
                track.enabled = !video;
            });
        }
    }

    let handleAudio = () => {
        setAudio(!audio);
        if (window.localStream) {
            window.localStream.getAudioTracks().forEach(track => {
                track.enabled = !audio;
            });
        }
    }

    let getDisplayMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop());
        } catch (e) { console.log(e) }
        window.localStream = stream;
        localVideoRef.current.srcObject = stream;

        for (let id in connections) {
            if (id === socketIdRef.current) continue;

            // Re-negotiate screen share using track replacement
            stream.getTracks().forEach(track => {
                connections[id].addTrack(track, stream);
            });

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }
        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false)

            try {
                let tracks = localVideoRef.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([blackScreen(...args), silence()])
            window.localStream = blackSilence()
            localVideoRef.current.srcObject = window.localStream

            getUserMedia();
        })
    }

    let getDisplayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDisplayMediaSuccess)
                    .catch((e) => { console.log(e) })
            }
        }
    }

    useEffect(() => {
        if (screen !== undefined) {
            getDisplayMedia();
        }
    }, [screen])

    let handleScreen = () => {
        setScreen(!screen);
    }

    const chatEndRef = useRef(null);
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    let openChat = () => {
        setModel(!showModel);
        setNewmessages(0);
    }

    let sendMessage = () => {
        socketRef.current.emit("chat-message", message, username);
        setMessage("");
    }

    let handleEndCall = () => {
        if (socketRef.current) socketRef.current.disconnect();
        const destination = isAuthenticated ? "/home" : "/"
        routeTo(destination);
    }

    return (
        <div>
            {askForUsername === true ?
                <div>
                    <nav className='meetingNav'>
                        <img src="/websiteLogo.png" className='logo' />
                        <p onClick={() => {
                            navigate("/home");
                        }}><b>Meet<span style={{ color: "#DC2626" }}>lance</span></b></p>
                    </nav>
                    <div className='JoinContainer'>
                        <div className='leftContainer'>
                            <h2 style={{ marginBottom: '1rem' }}>Enter into Lobby</h2>
                            <div style={{ marginBottom: "1.2rem" }}>
                                <TextField label="Username" value={username} onChange={e => setUsername(e.target.value)} variant="outlined" />
                                <Button variant="contained" onClick={connect} style={{ margin: "9px" }}>Join</Button>
                            </div>
                            <video ref={localVideoRef} autoPlay muted className='joinvedioContainer'></video>
                        </div>
                        <div> <img src='joinVideo.svg' className='joinImg' alt="join" /></div>
                    </div>
                </div> :
                <div className='meetVedioContainer'>

                    {showModel ?
                        <div className='chatRoom'>
                            <div className='chatContainer'>
                                <h2 style={{ color: "#DC2626", padding: "4px 0px" }}>Chat Message</h2>
                                <div className="chattingDispaly" style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    overflowY: 'auto',
                                    maxHeight: '400px',
                                    wordBreak: 'break-word'
                                }}>
                                    {messages.length > 0 ? messages.map((item, index) => (
                                        <div key={index} style={{ marginBottom: "10px" }}>
                                            <p style={{ fontWeight: "bold", margin: "0" }}>{item.sender}:</p>
                                            <p style={{ margin: "0" }}>{item.data}</p>
                                        </div>
                                    )) : <p style={{ opacity: "0.2" }}>No Message Yet</p>}

                                    <div ref={chatEndRef} />
                                </div>
                                <div className='chatBox'>
                                    <TextField id="outlined-basic" value={message} onChange={(e) => setMessage(e.target.value)} variant="outlined" />
                                    <Button variant="contained" onClick={sendMessage} style={{ marginLeft: "1rem", marginTop: "6px" }}>Send</Button>
                                </div>
                            </div>
                        </div>
                        : <></>
                    }

                    <div className='buttonContainer'>
                        <IconButton onClick={handleVideo} style={{ color: "white" }}>
                            {(video === true) ? <VideocamIcon /> : <VideocamOffIcon />}
                        </IconButton>
                        <IconButton onClick={handleEndCall} style={{ color: "red" }}>
                            <CallEndIcon />
                        </IconButton>
                        <IconButton onClick={handleAudio} style={{ color: "white" }}>
                            {(audio === true) ? <MicIcon /> : <MicOffIcon />}
                        </IconButton>
                        {(screenAvailable && (videos.length > 0 || screen)) && (
                            <IconButton onClick={handleScreen} style={{ color: "white" }}>
                                {screen ? <StopScreenShareIcon /> : <ScreenShareIcon />}
                            </IconButton>
                        )}
                        <Badge
                            badgeContent={newMessages}
                            max={99}
                            color='secondary'
                            invisible={showModel || newMessages === 0}
                        >
                            <IconButton onClick={openChat} style={{ color: "white" }}>
                                <ChatIcon />
                            </IconButton>
                        </Badge>
                    </div>

                    <p className='Username'>@<b>{username}</b></p>
                    <video ref={localVideoRef} autoPlay muted className='meetUserVideo'></video>
                    <div className='conferenceView'>
                        {videos.map((v) => (
                            <div key={v.socketId} style={{ position: 'relative' }}>
                                <video
                                    className='conferenceVideo'
                                    autoPlay
                                    playsInline
                                    ref={(ref) => {
                                        if (ref && v.stream) {
                                            if (ref.srcObject !== v.stream) {
                                                ref.srcObject = v.stream;
                                            }
                                        }
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            }
        </div>
    )
}