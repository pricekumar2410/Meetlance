import { Server } from "socket.io";

let connections = {};
let message = {};
let timeOnline = {};

export const connnectToSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["*"],
            credentials: true
        }
    });

    // FIX 1: "connection" (not "connections")
    io.on("connection", (socket) => {
        console.log("User Connected:", socket.id);

        socket.on("join-call", (path) => {
            if (connections[path] === undefined) {
                connections[path] = [];
            }
            connections[path].push(socket.id);
            timeOnline[socket.id] = new Date();

            // Sabhi users ko batao ki naya banda aaya hai aur list bhejo
            connections[path].forEach((socketId) => {
                io.to(socketId).emit("user-joined", socket.id, connections[path]);
            });

            // Purane messages bhejna
            if (message[path] !== undefined) {
                message[path].forEach((msg) => {
                    io.to(socket.id).emit(
                        "chat-message",
                        msg.data,
                        msg.sender,
                        msg["socket-id-sender"]
                    );
                });
            }
        });

        socket.on("signal", (toId, message) => {
            // Signaling data ko sahi user tak pahunchana
            io.to(toId).emit("signal", socket.id, message);
        });

        socket.on("chat-message", (data, sender) => {
            // Find user's room
            const [matchingRoom, found] = Object.entries(connections)
                .reduce(([room, isFound], [roomKey, roomValue]) => {
                    if (!isFound && roomValue.includes(socket.id)) {
                        return [roomKey, true];
                    }
                    return [room, isFound];
                }, ["", false]);

            if (found) {
                if (message[matchingRoom] === undefined) {
                    message[matchingRoom] = [];
                }
                message[matchingRoom].push({ "sender": sender, "data": data, "socket-id-sender": socket.id });
                
                connections[matchingRoom].forEach((elem) => {
                    io.to(elem).emit("chat-message", data, sender, socket.id);
                });
            }
        });

        socket.on("disconnect", () => {
            console.log("User Disconnected:", socket.id);
            let diffTime = Math.abs(timeOnline[socket.id] - new Date());
            
            // Cleanup connections
            for (const key in connections) {
                const index = connections[key].indexOf(socket.id);
                if (index !== -1) {
                    // Baaki users ko notification bhejo
                    connections[key].forEach((id) => {
                        io.to(id).emit("user-left", socket.id);
                    });
                    
                    connections[key].splice(index, 1);
                    
                    if (connections[key].length === 0) {
                        delete connections[key];
                    }
                }
            }
            delete timeOnline[socket.id];
        });
    });

    return io;
};