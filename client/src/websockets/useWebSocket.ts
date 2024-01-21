import { useEffect, useState } from 'react';

const useWebSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const [lastMessage, setLastMessage] = useState<string>('');


  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000');

    ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.onmessage = (event) => {
      setLastMessage(event.data);
      if (Notification.permission === 'granted') {
        new Notification('Nová notifikace', { body: event.data });
      }
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    setSocket(ws);

    return () => {
      if (ws.readyState === 1) {
        ws.close();
      }
    };
  }, []);

  return { socket, lastMessage };
};

export default useWebSocket;
