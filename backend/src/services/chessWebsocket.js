const WebSocketServer = require('ws').Server;

function setupChessWebSocketServer(server) {
  const wss = new WebSocketServer({ server, path: '/game' });

  wss.on('connection', (ws) => {
    console.log('New game client connected');

    ws.on('message', (message) => {
      console.log('Received message:', message);
      // Broadcast the message to all connected clients
      wss.clients.forEach((client) => {
        if (client.readyState === ws.OPEN) {
          client.send(message);
        }
      });
    });

    ws.on('close', () => {
      console.log('Game client disconnected');
    });
  });
}

module.exports = setupChessWebSocketServer;
