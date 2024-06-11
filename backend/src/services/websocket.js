const WebSocket = require('ws');

function setupWebSocketServer(server) {
    const wss = new WebSocket.Server({server});

    wss.on('connection', (ws) => {
        console.log("New client connected");
        
        wss.on('message', (message) => {
            console.log(`Recieved message => ${message}`);

            // Broadcast the message to all clients
            wss.clients.forEach((client) => {
                if(client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });
        });
        ws.on('close', () => {
            console.log('Client disconnected');
        });

        ws.send('Welcome to the chess game');
    });

}

module.exports = setupWebSocketServer;