import React, { useRef, useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import withAuth from '../utils/withAuth'
import "../styleCSS/interviewRoom.css";
import server from '../environment';
import { io } from "socket.io-client"

import Editor from '@monaco-editor/react';
import LanguageSelector from '../Practice_Coding/langaugeSelector';
import { codeSnippets } from '../CodingConstant';
import { executeCode } from '../codeAPI';
import { Box, Button, CircularProgress, Tooltip, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
}

function InterviewRoom() {
    const { code } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { role, sessionCode, username, name } = location.state || {};

    const interviewCode = code || sessionCode;

    const [value, setValue] = useState(codeSnippets.lang);
    const [language, setLanguage] = useState("Select");
    const [showOutput, setShowOutput] = useState(false);
    const [output, setOutput] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const editorRef = useRef();

    // Video and audio state
    const localVideoRef = useRef();
    const remoteVideoRef = useRef();
    const [video, setVideo] = useState(true);
    const [audio, setAudio] = useState(true);
    const [screen, setScreen] = useState(false);
    const [videoAvailable, setVideoAvailable] = useState(true);
    const [audioAvailable, setAudioAvailable] = useState(true);
    const [screenAvailable, setScreenAvailable] = useState(false);
    const [remoteUsername, setRemoteUsername] = useState('Joining...');

    // Socket
    const socketRef = useRef();
    const socketIdRef = useRef();
    const connectionsRef = useRef({});

    const onMount = (editor) => {
        editorRef.current = editor;
        editor.focus();
    };

    const onSelect = (lang) => {
        setLanguage(lang);
        setValue(codeSnippets[lang] || "");
        if (socketRef.current) {
            socketRef.current.emit("language-change", lang);
        }
    };

    const handleRun = async () => {
        if (language === 'Select' || isRunning) return;
        const sourceCode = editorRef.current?.getValue();
        if (!sourceCode) return;
        setIsRunning(true);
        try {
            const { run: result } = await executeCode(language, sourceCode);
            let outputData;
            if (result.stderr) {
                outputData = result.stderr.split('\n');
            } else {
                outputData = (result.stdout || result.output || '').split('\n');
            }
            setOutput(outputData);
            setShowOutput(true);
            if (socketRef.current) {
                socketRef.current.emit("run-code", outputData);
            }
        } catch (e) {
            const errorOutput = ['Error: ' + (e.message || 'Unable to run code')];
            setOutput(errorOutput);
            setShowOutput(true);
            if (socketRef.current) {
                socketRef.current.emit("run-code", errorOutput);
            }
        } finally {
            setIsRunning(false);
        }
    };

    const closeOutput = () => setShowOutput(false);

    // Media permission handling
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
                    // Add to existing connections
                    Object.keys(connectionsRef.current).forEach((socketId) => {
                        userMediaStream.getTracks().forEach(track => {
                            connectionsRef.current[socketId].addTrack(track, userMediaStream);
                        });
                    });
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getPermissions();
    }, []);

    // Socket connection
    useEffect(() => {
        socketRef.current = io.connect(server, { secure: false });
        socketRef.current.on('connect', () => {
            socketRef.current.emit("join-call", interviewCode);
            socketIdRef.current = socketRef.current.id;
        });

        socketRef.current.on('code-change', (code) => {
            setValue(code);
        });

        socketRef.current.on('language-change', (lang) => {
            setLanguage(lang);
            setValue(codeSnippets[lang] || "");
        });

        socketRef.current.on('run-code', (outputData) => {
            setOutput(outputData);
            setShowOutput(true);
        });

        // Video signaling
        socketRef.current.on('signal', gotMessageFromServer);
        socketRef.current.on('user-joined', (id, clients) => {
            clients.forEach((socketId) => {
                if (socketId !== socketIdRef.current && !connectionsRef.current[socketId]) {
                    connectionsRef.current[socketId] = new RTCPeerConnection(peerConfigConnections);
                    connectionsRef.current[socketId].onicecandidate = (event) => {
                        if (event.candidate) {
                            socketRef.current.emit("signal", socketId, JSON.stringify({ "ice": event.candidate }));
                        }
                    };
                    connectionsRef.current[socketId].ontrack = (event) => {
                        if (remoteVideoRef.current) {
                            remoteVideoRef.current.srcObject = event.streams[0];
                        }
                    };
                    if (window.localStream) {
                        window.localStream.getTracks().forEach(track => {
                            connectionsRef.current[socketId].addTrack(track, window.localStream);
                        });
                    }
                }
            });

            if (id === socketIdRef.current) {
                Object.keys(connectionsRef.current).forEach((socketId) => {
                    if (socketId !== socketIdRef.current) {
                        connectionsRef.current[socketId].createOffer().then((description) => {
                            connectionsRef.current[socketId].setLocalDescription(description).then(() => {
                                socketRef.current.emit("signal", socketId, JSON.stringify({ "sdp": description }));
                            });
                        });
                    }
                });
            }
        });

        socketRef.current.on("user-left", (id) => {
            if (connectionsRef.current[id]) {
                connectionsRef.current[id].close();
                delete connectionsRef.current[id];
            }
            setRemoteUsername('Joining...');
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [interviewCode]);

    const gotMessageFromServer = (fromId, message) => {
        const signal = JSON.parse(message);
        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connectionsRef.current[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        connectionsRef.current[fromId].createAnswer().then((description) => {
                            connectionsRef.current[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit("signal", fromId, JSON.stringify({ "sdp": description }));
                            });
                        });
                    }
                });
            }
            if (signal.ice) {
                connectionsRef.current[fromId].addIceCandidate(new RTCIceCandidate(signal.ice));
            }
        }
    };

    // Video control handlers
    const handleVideo = () => {
        setVideo(!video);
        if (window.localStream) {
            window.localStream.getVideoTracks().forEach(track => {
                track.enabled = !video;
            });
        }
    };

    const handleAudio = () => {
        setAudio(!audio);
        if (window.localStream) {
            window.localStream.getAudioTracks().forEach(track => {
                track.enabled = !audio;
            });
        }
    };

    const handleEndCall = () => {
        if (window.localStream) {
            window.localStream.getTracks().forEach(track => track.stop());
        }
        Object.keys(connectionsRef.current).forEach((socketId) => {
            connectionsRef.current[socketId].close();
        });
        if (socketRef.current) {
            socketRef.current.disconnect();
        }
        navigate('/interviewhomepage');
    };


    const isRunDisabled = isRunning || !value || !value.trim();
    const tooltipMessage = (!value || !value.trim() ? 'Write some code to run' : '');

    const editorHeight = showOutput ? 'calc(100vh - 80px - 20vh)' : 'calc(102.1vh - 80px)';

    return (
        <div className="interview-room">
            <div className="coding-section">
                {/* Top bar: language selector (left) + run button (right) */}
                <div className="coding-topbar" style={{ display: 'flex', justifyContent: 'space-between', marginTop: "6px", alignItems: 'center', gap: 2 }}>
                    <div>
                        <LanguageSelector language={language} onSelect={onSelect} />
                    </div>

                    <div>
                        <Tooltip title={tooltipMessage} arrow disableHoverListener={!isRunDisabled}>
                            <span>
                                <Button
                                    variant="contained"
                                    onClick={handleRun}
                                    disabled={isRunDisabled}
                                    sx={{ bgcolor: isRunDisabled ? '#999' : 'green', color: 'white' }}
                                >
                                    {isRunning ? <CircularProgress size={18} color="inherit" /> : <b>Run Code</b>}
                                </Button>
                            </span>
                        </Tooltip>
                    </div>
                </div>

                {/* Code editor input below topbar */}
                <div style={{ marginTop: 6, flex: 1 }}>
                    <Editor
                        height={editorHeight}
                        theme='vs-dark'
                        language={language === 'Select' ? 'javascript' : language}
                        value={value}
                        onMount={onMount}
                        defaultValue={codeSnippets[language]}
                        onChange={(val) => {
                            setValue(val);
                            if (socketRef.current) {
                                socketRef.current.emit("code-change", val);
                            }
                        }}
                        options={{
                            fontSize: 16,
                            fontFamily: "Fira Code, monospace",
                            minimap: { enabled: false }
                        }}
                    />
                </div>

                {/* Output below editor, only visible after run */}
                {showOutput && (
                    <div className="output-box" style={{ display: "flex", justifyContent: "space-between", marginTop: 2, height: '20.7vh', minHeight: 120 }}>
                        <div>
                            <pre style={{ whiteSpace: 'pre-wrap', height: 'calc(100% - 36px)', overflow: 'auto', padding: 10, margin: 0, color: '#fff' }}>
                                {output ? output.join('\n') : ''}
                            </pre>
                        </div>
                        <div>
                            <IconButton size="small" onClick={closeOutput} sx={{ color: 'white' }}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </div>
                    </div>
                )}
            </div>

            <div className="video-section" style={{ width: '25vw', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>

                {/* Video Display Area */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, overflow: 'auto' }}>
                    {/* Local Video */}
                    <div style={{ position: 'relative', flex: 1, borderRadius: 8, overflow: 'hidden', backgroundColor: '#000', border: '2px solid #2563EB' }}>
                        <video
                            ref={localVideoRef}
                            autoPlay
                            muted
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{ position: 'absolute', bottom: 8, left: 8, backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', padding: '4px 8px', borderRadius: 4, fontSize: 12 }}>
                            {username} (you)
                        </div>
                    </div>

                    {/* Remote Video */}
                    <div style={{ position: 'relative', flex: 1, borderRadius: 8, overflow: 'hidden', backgroundColor: '#000', border: '2px solid #DC2626' }}>
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{ position: 'absolute', bottom: 8, left: 8, backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', padding: '4px 8px', borderRadius: 4, fontSize: 12 }}>
                            {remoteUsername}
                        </div>
                    </div>
                </div>

                {/* Control Buttons */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 18, padding: 4, flexWrap: 'wrap', marginTop: 4 }}>
                    <Tooltip title={video ? "Turn off video" : "Turn on video"}>
                        <IconButton onClick={handleVideo} style={{ color: "white", backgroundColor: video ? 'transparent' : 'rgba(255,0,0,0.3)', border: '1px solid #fff' }}>
                            {video ? <VideocamIcon /> : <VideocamOffIcon />}
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="End call">
                        <IconButton onClick={handleEndCall} style={{ color: "white", backgroundColor: 'rgba(255,0,0,0.5)', border: '1px solid red' }}>
                            <CallEndIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={audio ? "Mute microphone" : "Unmute microphone"}>
                        <IconButton onClick={handleAudio} style={{ color: "white", backgroundColor: audio ? 'transparent' : 'rgba(255,0,0,0.3)', border: '1px solid #fff' }}>
                            {audio ? <MicIcon /> : <MicOffIcon />}
                        </IconButton>
                    </Tooltip>

                </div>
            </div>
        </div>
    )
}

export default withAuth(InterviewRoom);