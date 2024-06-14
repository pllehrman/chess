const WebSocketServer = require('ws').Server;

function setupChatWebSocketServer(server) {
  const wss = new WebSocketServer({ server, path: '/chat' });

  wss.on('connection', (ws) => {
    console.log('New chat client connected');

    ws.on('message', (message) => {
      console.log('Received chat message:', message);
      // Broadcast the message to all connected clients
      wss.clients.forEach((client) => {
        if (client.readyState === ws.OPEN) {
          client.send(message);
        }
      });
    });

    ws.on('close', () => {
      console.log('Chat client disconnected');
    });
  });
}

module.exports = setupChatWebSocketServer;
