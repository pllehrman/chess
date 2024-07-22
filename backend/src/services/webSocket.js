const http = require('http');
const { WebSocketServer } = require('ws');
const url = require('url');
const uuidv4 = require("uuid").v4;
const { joinGame, leaveGame, gameCapacity, updateGame } = require('../controllers/games');
const { exit } = require('process');

const users = {};
const connections = {};

async function webSocketServer(server) {
    const wsServer = new WebSocketServer({ server });

    wsServer.on("connection", async (connection, request) => {
        // client side -> ws://localhost:8000?username=Alex
        const { username, gameId, orientation } = url.parse(request.url, true).query;

        let userUuid;

        try {
            // Join the game in the db
            await joinGame(gameId, orientation);

            // Notify the client of the join event
            const entryCapacity = await gameCapacity(gameId);
            console.log("Entry capacity:", entryCapacity)
            
            broadcastMessage('capacityUpdate', null, { gameId, capacity: entryCapacity });
           
            // Resend the message on a delay to ensure all clients are up to date.
            setTimeout(() => {
                broadcastMessage('capacityUpdate', null, { gameId, capacity: entryCapacity });
            }, 3000);

            console.log("successfully joined the game");
        } catch (error) {
            console.log(`Error joining game: ${error.message}`);
            connection.close();
            return;
        }

        userUuid = uuidv4();
        console.log(`${username} is now connected to the web socket with ${userUuid}.`);

        connections[userUuid] = connection;
        users[userUuid] = {
            gameId: gameId,
            orientation: orientation,
            username: username,
        };

        connection.on('message', async (message) => {
            const messageString = message.toString('utf-8');

            try {
                const parsedMessage = JSON.parse(messageString);
                if (parsedMessage.type === 'chat') {
                    broadcastMessage('chat', userUuid, parsedMessage.message);
                } else if (parsedMessage.type === 'move') {
                    broadcastMessage('move', userUuid, parsedMessage.move);
                    await updateGame(users[userUuid].gameId, parsedMessage.fen, parsedMessage.whiteTime, parsedMessage.blackTime);
                }
            } catch (error) {
                console.error(`Error parsing message: ${error.message}`);
            }
        });

        connection.on('close', async () => {
            console.log(`${username} disconnected`);

            try {
                await leaveGame(users[userUuid].gameId, users[userUuid].orientation);
                console.log("successfully left the game");
            } catch (error) {
                console.error(`Error leaving game: ${error.message}`);
            }
            const exitCapacity = await gameCapacity(users[userUuid].gameId);
            console.log("Exit capacity:", exitCapacity);
            broadcastMessage('capacityUpdate', null, { gameId: users[userUuid].gameId, capacity: exitCapacity });
            
            // Resend the message on a delay to ensure all clients are up to date.
            setTimeout(() => {
                broadcastMessage('capacityUpdate', null, { gameId: users[userUuid].gameId, capacity: exitCapacity });
                // Clean up
                delete connections[userUuid];
                delete users[userUuid];
            }, 3000);
            
        });
    });

    console.log('WebSocket initialized.');
}

function broadcastMessage(type, senderUuid, message) {
    const messageData = {
        type: type,
        ...(users[senderUuid] && { username: users[senderUuid].username }),
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

module.exports = webSocketServer;
