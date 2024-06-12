// services/chatWebSocket.js
const WebSocket = require('websocket').server;
const http = require('http');

function ChatWebSocketServer() {
  const server = http.createServer(function (request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
  });

  server.listen(3001, function () {
    console.log((new Date()) + ' Chat server is listening on port 3001');
  });

  const wsServer = new WebSocket({
    httpServer: server,
    autoAcceptConnections: false
  });

  function originIsAllowed(origin) {
    // put logic here to detect whether the specified origin is allowed.
    return true;
  }

  wsServer.on('request', function (request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }

    const connection = request.accept(null, request.origin);
    console.log((new Date()) + ' Connection accepted.');

    connection.on('message', function (message) {
      if (message.type === 'utf8') {
        console.log('Received Message: ' + message.utf8Data);
        // Broadcast the message to all connected clients
        wsServer.connections.forEach((client) => {
          client.sendUTF(message.utf8Data);
        });
      } else if (message.type === 'binary') {
        console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
        connection.sendBytes(message.binaryData);
      }
    });

    connection.on('close', function (reasonCode, description) {
      console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
  });
}

module.exports = ChatWebSocketServer;
