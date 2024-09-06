const { WebSocketServer } = require("ws");
const url = require("url");
const {
  setGameSessionId,
  updateGame,
  increaseNumPlayers,
  decreaseNumPlayers,
} = require("../controllers/games");

function setupWebSocket(server) {
  const wsServer = new WebSocketServer({ server });
  const connections = {}; // Map to track user connections by sessionId
  const games = {};

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

    if (!games[gameId]) {
      games[gameId] = { white: null, black: null };
    }

    if (games[gameId][orientation]) {
      console.error("error joining a game: tried to join a full game");
      connection.close();
      return;
    }
    games[gameId][orientation] = sessionId;

    const numPlayers = Object.values(games[gameId]).filter(Boolean).length;
    for (let i = 0; i < 3; i++) {
      broadcastMessage("capacityUpdate", sessionId, gameId, {
        capacity: numPlayers,
      });
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
      if (games[gameId] && games[gameId][orientation] === sessionId) {
        games[gameId][orientation] = null;
        console.log(`${sessionUsername} disconnected from game ${gameId}`);

        const updatedNumPlayers = Object.values(games[gameId]).filter(
          Boolean
        ).length;
        // const numPlayers = await decreaseNumPlayers(gameId, orientation);
        for (let i = 0; i < 3; i++) {
          broadcastMessage("capacityUpdate", sessionId, gameId, {
            capacity: updatedNumPlayers,
          });
        }

        delete connections[sessionId]; // Remove user connection
      }
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
      // Even send to senderSessionId when type === "capacityUpdate"
      if (
        type === "capacityUpdate" &&
        connections[sessionId].gameId === gameId
      ) {
        connections[sessionId].connection.send(messageString);
      } else if (
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
