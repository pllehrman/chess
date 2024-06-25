const http = require('http');
const { WebSocketServer } = require('ws');
const url = require('url');
const uuidv4 = require("uuid").v4

const server = http.createServer();
const wsServer = new WebSocketServer({ server });

const users = {}
const connections = {}



function chatWebSocketServer(port) {
    wsServer.on("connection", (connection, request) => {
        // client side -> ws://localhost:8000?username=Alex
        const { username } = url.parse(request.url, true).query
        const uuid = uuidv4()

        console.log(`${username} is now connected to the web socket with ${uuid}.`)

        connections[uuid] = connection;
        users[uuid] = {
            username: username,
            state: {
                typing: false,
            },
        };

        connection.on('message', (message) => {
            // if (Buffer.isBuffer(message)) {
            //     message.toString('utf-8');
            // }
            console.log(`recieved message from ${username}: ${message}`);
            console.log(message);
            broadcastMessage(uuid, message);
        });

        connection.on('close', () => {
            console.log(`${username} disconnected`);
            delete connections[uuid];
            delete users[uuid];
        });
    });

    server.listen(port, () => {
        console.log(`Chat WebSocket server listending on port ${port}`);
    });
}

function broadcastMessage(senderUuid, message) {
    console.log(message);
    const messageData = {
        username: users[senderUuid].username,
        message: message,
    }

    const messageString = JSON.stringify(messageData);

    Object.keys(connections).forEach((uuid) => {
        // Don't want to broadcast the message to the sender
        if (uuid !== senderUuid) {
            connections[uuid].send(messageString);
        }
    });
}

module.exports = chatWebSocketServer;