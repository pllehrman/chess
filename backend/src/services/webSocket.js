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
    games[gameId][orientation] = { sessionId, sessionUsername };

    for (let i = 0; i < 2; i++) {
      setTimeout(() => {
        if (games[gameId]) {
          broadcastMessage(
            "capacityUpdate",
            sessionId,
            sessionUsername,
            gameId,
            {
              capacity: Object.values(games[gameId]).filter(Boolean).length,
            }
          );
        } else {
          console.error(`Game with ID ${gameId} no longer exists.`);
        }
      }, i * 2000);
    }

    // Store user connection by sessionId
    connections[sessionId] = { connection, gameId, gameType, orientation };

    connection.on("message", (message) =>
      handleMessage(sessionId, sessionUsername, gameId, message)
    );

    // Handle connection close
    connection.on("close", async () => {
      if (games[gameId] && games[gameId][orientation].sessionId === sessionId) {
        games[gameId][orientation] = null;

        for (let i = 0; i < 2; i++) {
          setTimeout(() => {
            if (games[gameId]) {
              broadcastMessage(
                "capacityUpdate",
                sessionId,
                sessionUsername,
                gameId,
                {
                  capacity: Object.values(games[gameId]).filter(Boolean).length,
                }
              );
            } else {
              console.error(`Game with ID ${gameId} no longer exists.`);
            }
          }, i * 2000);

          // Cleanup
          delete connections[sessionId];
          if (games[gameId] && !games[gameId].white && !games[gameId].black) {
            delete games[gameId];
          }
        }
      }
    });
  });

  async function handleMessage(sessionId, sessionUsername, gameId, message) {
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
          parsedMessage.blackTime
        );
      } else if (parsedMessage.type === "chat") {
        broadcastMessage(
          "chat",
          sessionId,
          sessionUsername,
          gameId,
          parsedMessage.message
        );
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
    let opponentUsername = null;
    if (games[gameId]["white"] && games[gameId]["black"]) {
      if (games[gameId]["white"].sessionId === senderSessionId) {
        opponentUsername = games[gameId]["black"]?.sessionUsername || "Unknown";
      } else if (games[gameId]["black"].sessionId === senderSessionId) {
        opponentUsername = games[gameId]["white"]?.sessionUsername || "Unknown";
      }
    }

    const messageData = {
      type,
      sessionId: senderSessionId,
      sessionUsername: senderSessionUsername,
      opponentUsername,
      message,
    };

    const messageString = JSON.stringify(messageData);

    Object.keys(connections).forEach((sessionId) => {
      // Send to all players if type is "capacityUpdate"
      if (
        type === "capacityUpdate" &&
        connections[sessionId].gameId === gameId
      ) {
        connections[sessionId].connection.send(messageString);
      }
      // Send to all players except the sender for other message types
      else if (
        connections[sessionId].gameId === gameId &&
        sessionId !== senderSessionId
      ) {
        connections[sessionId].connection.send(messageString);
      }
    });
  }
}

module.exports = setupWebSocket;
