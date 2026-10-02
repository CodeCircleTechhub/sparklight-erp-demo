import { io, Socket } from 'socket.io-client';

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  (import.meta.env.DEV ? 'http://localhost:5000' : 'https://sparklightbackend-8aa5.onrender.com');

let socket: Socket | null = null;

/** Connect (or reuse) the realtime socket using the stored JWT. */
export function connectSocket(): Socket | null {
  const token = localStorage.getItem('token');
  if (!token) return null;

  if (socket) {
    if (socket.disconnected) {
      socket.auth = { token };
      socket.connect();
    }
    return socket;
  }

  socket = io(SOCKET_URL, {
    auth: { token },
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 2000,
    transports: ['websocket', 'polling'],
  });

  return socket;
}

export function getSocket(): Socket | null {
  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
}

/** Fire-and-forget listener registration that cleans itself up. */
export function onSocketEvent<T = any>(
  event: string,
  handler: (payload: T) => void
): () => void {
  const s = connectSocket();
  if (!s) return () => undefined;
  s.on(event, handler);
  return () => {
    s.off(event, handler);
  };
}
