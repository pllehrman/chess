const { WebSocketServer } = require("ws");
const url = require("url");
const {
  setGameSessionId,
  validateMove,
  updateGame,
  increaseNumPlayers,
  decreaseNumPlayers,
} = require("../controllers/games");

function setupWebSocket(server) {
  const wsServer = new WebSocketServer({ server });
  const connections = {}; // Map to track user connections by sessionId

  wsServer.on("connection", async (connection, request) => {
    const { sessionId, sessionUsername, gameId, gameType, orientation } =
      url.parse(request.url, true).query;

    if (!sessionId || !gameId || !orientation) {
      console.log(
        "Missing sessionId or gameId or orientation. Connection closed."
      );
      connection.close();
      return;
    }

    // Handle game join logic
    try {
      if (gameType === "pvp") {
        await increaseNumPlayers(gameId);
      }
    } catch (error) {
      console.error(`Error joining game: ${error.message}`);
      connection.close();
      return;
    }

    console.log(
      `${sessionUsername} connected to game ${gameId} with sessionId: ${sessionId}`
    );

    // Store user connection by sessionId
    connections[sessionId] = { connection, gameId, gameType, orientation };

    // Handle incoming messages
    connection.on("message", (message) =>
      handleMessage(sessionId, gameId, message)
    );

    // Handle connection close
    connection.on("close", async () => {
      console.log(`${sessionUsername} disconnected from game ${gameId}`);
      if (gameType === "pvp") {
        await decreaseNumPlayers(gameId);
      }
      delete connections[sessionId]; // Remove user connection
    });
  });

  async function handleMessage(sessionId, gameId, message) {
    try {
      const parsedMessage = JSON.parse(message);
      // console.log("Received message:", parsedMessage);

      if (parsedMessage.type === "move") {
        broadcastMessage("move", sessionId, gameId, parsedMessage);
        await updateGame(
          gameId,
          parsedMessage.fen,
          parsedMessage.whiteTime,
          parsedMessage.blackTime
        );
      } else if (parsedMessage.type === "chat") {
        broadcastMessage("chat", sessionId, gameId, parsedMessage.message);
      }
    } catch (error) {
      console.error(`Error handling message: ${error.message}`);
    }
  }

  function broadcastMessage(type, senderSessionId, gameId, message) {
    const messageData = {
      type,
      sessionId: senderSessionId,
      message,
    };

    const messageString = JSON.stringify(messageData);

    // Broadcast the message to all players except the sender
    Object.keys(connections).forEach((sessionId) => {
      if (
        connections[sessionId].gameId === gameId &&
        sessionId !== senderSessionId
      ) {
        connections[sessionId].connection.send(messageString);
      }
    });
  }

  console.log("WebSocket server initialized.");
}

module.exports = setupWebSocket;
