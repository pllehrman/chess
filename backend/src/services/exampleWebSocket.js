const http = require('http');
const { WebSocketServer } = require('ws');
const url = require('url');

const server = http.createServer();
const wsServer = newWebSocketServer({ server });
const port = 3003

function simpleWebSocketServer(port) {
    wsServer.on("connection", (connection, request) => {
        // client side -> ws://localhost:8000?username=Alex
        const { username } = url.parse(request.url, true).query
        console.log(username)
    })

    server.listen(port, () => {
        console.log(`Chat WebSocket server listending on port ${port}`);
    })
};

module.exports = simpleWebSocketServer;