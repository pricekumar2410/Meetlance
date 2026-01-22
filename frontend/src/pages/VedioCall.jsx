import React, { useEffect, useRef, useState } from 'react';
import { io } from "socket.io-client";
import { TextField, Button } from '@mui/material';

const server_url = "http://localhost:3000";

const peerConfigConnections = {
    "iceServers": [{ "urls": "stun:stun.l.google.com:19302" }]
};

export default function VedioComponent() {
    const socketRef = useRef();
    const socketIdRef = useRef();
    const localVideoRef = useRef(null);
    const connections = useRef({}); 
    const localStreamRef = useRef(null);

    const [askForUsername, setAskForUsername] = useState(true);
    const [username, setUsername] = useState("");
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const getMedia = async () => {
            try {
                // Audio constraints ko optimize kiya gaya hai
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    video: true, 
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true
                    } 
                });
                localStreamRef.current = stream;
                if (localVideoRef.current) localVideoRef.current.srcObject = stream;
            } catch (err) { console.error("Media Error:", err); }
        };
        getMedia();
    }, []);

    const createPeerConnection = (targetSocketId) => {
        const pc = new RTCPeerConnection(peerConfigConnections);

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socketRef.current.emit("signal", targetSocketId, JSON.stringify({ ice: event.candidate }));
            }
        };

        pc.ontrack = (event) => {
            console.log("Receiving remote track...", event.track.kind);
            setVideos((prev) => {
                if (prev.find(v => v.socketId === targetSocketId)) return prev;
                // event.streams[0] mein audio aur video dono tracks hote hain
                return [...prev, { socketId: targetSocketId, stream: event.streams[0] }];
            });
        };

        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => {
                pc.addTrack(track, localStreamRef.current);
            });
        }

        return pc;
    };

    const connectToSocketServer = () => {
        socketRef.current = io.connect(server_url);

        socketRef.current.on("connect", () => {
            socketIdRef.current = socketRef.current.id;
            socketRef.current.emit("join-call", window.location.href);

            socketRef.current.on("signal", async (fromId, data) => {
                const signal = JSON.parse(data);
                if (!connections.current[fromId]) {
                    connections.current[fromId] = createPeerConnection(fromId);
                }
                const pc = connections.current[fromId];

                if (signal.sdp) {
                    await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
                    if (signal.sdp.type === "offer") {
                        const answer = await pc.createAnswer();
                        await pc.setLocalDescription(answer);
                        socketRef.current.emit("signal", fromId, JSON.stringify({ sdp: pc.localDescription }));
                    }
                } else if (signal.ice) {
                    await pc.addIceCandidate(new RTCIceCandidate(signal.ice));
                }
            });

            socketRef.current.on("user-joined", (id, clients) => {
                clients.forEach((targetSocketId) => {
                    if (targetSocketId === socketIdRef.current) return;
                    if (!connections.current[targetSocketId]) {
                        connections.current[targetSocketId] = createPeerConnection(targetSocketId);
                    }
                });

                if (id === socketIdRef.current) {
                    Object.keys(connections.current).forEach(async (id2) => {
                        const pc = connections.current[id2];
                        const offer = await pc.createOffer();
                        await pc.setLocalDescription(offer);
                        socketRef.current.emit("signal", id2, JSON.stringify({ sdp: pc.localDescription }));
                    });
                }
            });

            socketRef.current.on("user-left", (id) => {
                setVideos((prev) => prev.filter(v => v.socketId !== id));
                if (connections.current[id]) {
                    connections.current[id].close();
                    delete connections.current[id];
                }
            });
        });
    };

    const handleConnect = () => {
        if (username.trim()) {
            setAskForUsername(false);
            connectToSocketServer();
        }
    };

    useEffect(() => {
        if (!askForUsername && localVideoRef.current && localStreamRef.current) {
            localVideoRef.current.srcObject = localStreamRef.current;
        }
    }, [askForUsername]);

    return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            {askForUsername ? (
                <div>
                    <h2>Enter Name</h2>
                    <TextField value={username} onChange={e => setUsername(e.target.value)} label="Username" />
                    <Button onClick={handleConnect} variant="contained" style={{ margin: "10px" }}>Connect</Button>
                    <video ref={localVideoRef} autoPlay muted playsInline style={{ width: "300px", display: "block", margin: "auto" }} />
                </div>
            ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", justifyContent: "center" }}>
                    <div style={{ border: "2px solid #ccc", padding: "10px" }}>
                        <p>You: {username}</p>
                        {/* Local video hamesha muted hona chahiye */}
                        <video ref={localVideoRef} autoPlay muted playsInline style={{ width: "300px" }} />
                    </div>
                    {videos.map((v) => (
                        <div key={v.socketId} style={{ border: "2px solid #007bff", padding: "10px" }}>
                            <p>Remote User</p>
                            {/* Remote video MUTED NAHI hona chahiye */}
                            <video 
                                autoPlay 
                                playsInline 
                                ref={el => { if (el) el.srcObject = v.stream; }} 
                                style={{ width: "300px" }} 
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}