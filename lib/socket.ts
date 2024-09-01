// socket.ts
import { io, Socket } from "socket.io-client";

const socket: Socket = io(); // Connect to your Socket.IO server

export default socket;
