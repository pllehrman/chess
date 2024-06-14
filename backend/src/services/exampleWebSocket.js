const http = require('http');
const { WebSocketServer } = require('ws');
const url = require('url');
const uuidv4 = require("uuid").v4

const server = http.createServer();
const wsServer = new WebSocketServer({ server });

const rooms = {}
const users = {}



function simpleWebSocketServer(port) {
    wsServer.on("connection", (connection, request) => {
        // client side -> ws://localhost:8000?username=Alex
        const { username } = url.parse(request.url, true).query
        const uuid = uuidv4()

        console.log(username)
        console.log(uuid);

        // broadcast // fan out

        // connections[uuid] = connection

        // users[uuid] = {
        //     username: username,
        //     state: {
        //         typing: true,
        //         onlineStatus: true
        //     }
        // }
    })

    server.listen(port, () => {
        console.log(`Chat WebSocket server listending on port ${port}`);
    })
};

module.exports = simpleWebSocketServer;