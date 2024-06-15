// hooks/ChessWebSocket.js
import { useEffect, useRef } from 'react';
import WebSocket from 'isomorphic-ws';
import { Chess } from 'chess.js';

export function ChessWebSocket(setGame, checkGameOver) {
  const wsRef = useRef(null);
  const gameRef = useRef();

  useEffect(() => {
    if (!wsRef.current) {
      const websocket = new WebSocket(process.env.NEXT_PUBLIC_WS_CHESS_URL);

      websocket.onopen = () => {
        console.log('Connected to WebSocket server.');
        wsRef.current = websocket;
      };

      websocket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log('Message received from WebSocket:', message); // Debug log
        if (message.type === 'move') {
          const { from, to, promotion } = message.move;
          const game = gameRef.current;
          game.move({ from, to, promotion });
          setGame(new Chess(game.fen()));
          checkGameOver();
        }
      };

      websocket.onclose = () => {
        console.log('Disconnected from WebSocket server');
        wsRef.current = null;
      };
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [setGame, checkGameOver]);

  const setGameRef = (game) => {
    gameRef.current = game;
  };

  return { ws: wsRef.current, setGameRef };
}
