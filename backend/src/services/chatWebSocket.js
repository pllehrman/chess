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
            // if (Buffer.isBuffer(message)) {
            //     message.toString('utf-8');
            // }
            console.log(`recieved message from ${username}: ${message}`);
            console.log(message);
            broadcastMessage(uuid, message);
        });

        // connection.on('move', (move) => {
        //     console.log(`recieved move from ${username}: ${move}`);
        //     console.log();
        //     broadcastMove(uuid, move);
        // });

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

function broadcastMove(senderUuid, move) {

}

module.exports = chatWebSocketServer;