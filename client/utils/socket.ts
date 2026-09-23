import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030";

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
});
