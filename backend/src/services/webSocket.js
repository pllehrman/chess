const { WebSocketServer } = require("ws");
const { URL } = require("url");
const { updateGame } = require("../controllers/games");

function setupWebSocket(server) {
  const wsServer = new WebSocketServer({ server });
  const connections = {}; // Map to track user connections by sessionId
  const games = {}; // To store the current game participants

  wsServer.on("connection", async (connection, request) => {
    const requestUrl = new URL(request.url, `wss://${request.headers.host}`);
    const sessionId = requestUrl.searchParams.get("sessionId");
    const sessionUsername = requestUrl.searchParams.get("sessionUsername");
    const gameId = requestUrl.searchParams.get("gameId");
    const gameType = requestUrl.searchParams.get("gameType");
    const orientation = requestUrl.searchParams.get("orientation");

    if (!sessionId || !gameId || !orientation) {
      console.error(
        "Missing sessionId, gameId, or orientation. Connection closed."
      );
      connection.close();
      return;
    }

    // Ensure game is initialized in the games object
    if (!games[gameId]) {
      games[gameId] = { white: null, black: null };
    }

    // If the game is full (both white and black are assigned), close the connection
    if (games[gameId][orientation]) {
      console.error("Error joining a game: tried to join a full game.");
      broadcastError(connection, "tried to join a full game");
      connection.close();
      return;
    }

    games[gameId][orientation] = sessionId;

    if (gameType === "pvp") {
      broadcastCapacityUpdate(sessionId, sessionUsername, gameId);
    }

    if (!connections[sessionId]) {
      connections[sessionId] = {}; // Initialize connections[sessionId] if it doesn't exist
    }

    // Store user connection by sessionId and gameId
    connections[sessionId][gameId] = {
      connection,
      gameId,
      gameType,
      orientation,
    };

    connection.on("message", (message) =>
      handleMessage(sessionId, sessionUsername, gameId, message, orientation)
    );

    // Handle connection close
    connection.on("close", async () => {
      // Remove the player from the game
      if (games[gameId]) {
        games[gameId][orientation] = null;

        const { gameType } = connections[sessionId][gameId];
        if (gameType === "pvp") {
          broadcastCapacityUpdate(sessionId, sessionUsername, gameId);
        }

        // Cleanup the user's connection to this game
        if (connections[sessionId]) {
          delete connections[sessionId][gameId];
          if (Object.keys(connections[sessionId]).length === 0) {
            delete connections[sessionId]; // Remove the session entirely if no games are left
          }
        }

        // If no players remain in the game, remove the game
        if (!games[gameId].white && !games[gameId].black) {
          delete games[gameId];
        }
      }
    });
  });

  function broadcastCapacityUpdate(sessionId, sessionUsername, gameId) {
    const gameCapacity = Object.values(games[gameId]).filter(Boolean).length;

    // Broadcast capacity update twice with a 2-second delay between broadcasts
    for (let i = 0; i < 2; i++) {
      setTimeout(() => {
        broadcastMessage("capacityUpdate", sessionId, sessionUsername, gameId, {
          capacity: gameCapacity,
        });
      }, i * 2000); // Delay by 2 seconds (2000 milliseconds)
    }
  }

  async function handleMessage(
    sessionId,
    sessionUsername,
    gameId,
    message,
    orientation
  ) {
    try {
      const parsedMessage = JSON.parse(message);

      if (parsedMessage.type === "move") {
        broadcastMessage(
          "move",
          sessionId,
          sessionUsername,
          gameId,
          parsedMessage
        );
        await updateGame(
          gameId,
          parsedMessage.fen,
          parsedMessage.whiteTime,
          parsedMessage.blackTime,
          null,
          null,
          sessionId,
          orientation
        );
      } else if (parsedMessage.type === "chat") {
        broadcastMessage(
          "chat",
          sessionId,
          sessionUsername,
          gameId,
          parsedMessage
        );
      } else if (parsedMessage.type === "timeUpdate") {
        await updateGame(
          gameId,
          null,
          parsedMessage.whiteTime,
          parsedMessage.blackTime,
          null,
          null,
          null,
          null
        );
      } else if (parsedMessage.type === "gameOver") {
        broadcastMessage(
          "gameOver",
          sessionId,
          sessionUsername,
          gameId,
          parsedMessage
        );
        await updateGame(
          gameId,
          null,
          parsedMessage.whiteTime,
          parsedMessage.blackTime,
          parsedMessage.winner,
          parsedMessage.result,
          null,
          null
        );
      } else if (parsedMessage.type === "drawOffer") {
        broadcastMessage(
          "drawOffer",
          sessionId,
          sessionUsername,
          gameId,
          parsedMessage
        );
      } else {
        console.error(`Unknown message type: ${parsedMessage.type}`);
      }
    } catch (error) {
      console.error(`Error handling message: ${error.message}`);
    }
  }

  function broadcastMessage(
    type,
    senderSessionId,
    senderSessionUsername,
    gameId,
    message
  ) {
    const messageData = {
      type,
      sessionId: senderSessionId,
      sessionUsername: senderSessionUsername,
      message,
    };

    const messageString = JSON.stringify(messageData);

    Object.keys(connections).forEach((sessionId) => {
      if (connections[sessionId][gameId]) {
        // Send to all players if type is "capacityUpdate"
        if (type === "capacityUpdate" || sessionId !== senderSessionId) {
          connections[sessionId][gameId].connection.send(messageString);
        }
      }
    });
  }
  function broadcastError(connection, details) {
    const errorMessage = {
      type: "error",
      message: details, // Details about the error
    };

    // Send the error message to the individual who triggered the error
    connection.send(JSON.stringify(errorMessage));
  }
}

module.exports = setupWebSocket;
