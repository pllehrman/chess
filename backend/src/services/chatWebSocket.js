const http = require('http');
const { WebSocketServer } = require('ws');
const url = require('url');
const uuidv4 = require("uuid").v4

const server = http.createServer();
const wsServer = new WebSocketServer({ server });
const { joinGame,leaveGame } = require('../controllers/games');

const users = {}
const connections = {}


async function chatWebSocketServer(port) {
    wsServer.on("connection", async (connection, request) => {
        // client side -> ws://localhost:8000?username=Alex
        const { username, gameId, orientation } = url.parse(request.url, true).query

        try {
            // Join the game in the db
            await joinGame(gameId, orientation);
            console.log("successfully joined the game");
        } catch (error) {
            console.log(`Error joining game: ${error.message}`);
            connection.close();
            return;
        }
        
        const uuid = uuidv4()
        console.log(`${username} is now connected to the web socket with ${uuid}.`)

        connections[uuid] = connection;
        users[uuid] = {
            gameId: gameId,
            orientation: orientation,
            username: username,
            state: {
                typing: false,
            },
        };

        connection.on('message', (message) => {
            const messageString = message.toString('utf-8');
            console.log(messageString);

            const parsedMessage = JSON.parse(messageString)
            if (parsedMessage.type === 'chat') {
                broadcastMessage(uuid, parsedMessage.message);
            } else if (parsedMessage.type === 'move') {
                broadcastMove(uuid, parsedMessage.move);
            }
        });

        connection.on('close', async () => {
            console.log(`${username} disconnected`);

            try {
                await leaveGame(users[uuid].gameId, users[uuid].orientation); 
                console.log("successfully left the game");
            } catch (error) {
                console.error(`Error leaving game: ${error.message}`)
            }
            // Call to leave game method in games controller;
            delete connections[uuid];
            delete users[uuid];
        });
    });

    server.listen(port, () => {
        console.log(`Chat WebSocket server listending on port ${port}`);
    });
}

function broadcastMessage(senderUuid, message) {
    const messageData = {
        type: 'chat',
        username: users[senderUuid].username,
        message: message,
    };

    const messageString = JSON.stringify(messageData);

    Object.keys(connections).forEach((uuid) => {
        // Don't want to broadcast the message to the sender
        if (uuid !== senderUuid) {
            connections[uuid].send(messageString);
        }
    });
}

function broadcastMove(senderUuid, move) {
    const moveData = {
        type: 'move',
        username: users[senderUuid].username,
        move: move,
    };

    const moveString = JSON.stringify(moveData);

    Object.keys(connections).forEach((uuid) => {
        // Don't want to broadcast the move to the sender
        if (uuid !== senderUuid) {
            connections[uuid].send(moveString);
        }
    });
}


module.exports = chatWebSocketServer;