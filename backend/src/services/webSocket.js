const { WebSocketServer } = require("ws");
const url = require("url");
const {
  setGameSessionId,
  updateGame,
  increaseNumPlayers,
  decreaseNumPlayers,
} = require("../controllers/games");
const { parse } = require("path");

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

    // console.log(sessionUsername, "is connnected");
    connection.on("message", (message) =>
      handleMessage(sessionId, sessionUsername, gameId, message)
    );

    // Handle connection close
    connection.on("close", async () => {
      if (games[gameId]) {
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

          // console.log(sessionUsername, "is disconnected");
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
      } else if (parsedMessage.type === "timeUpdate") {
        await updateGame(
          gameId,
          null,
          parsedMessage.whiteTime,
          parsedMessage.blackTime
        );
      } else if (parsedMessage.type === "gameOver") {
        console.log("INSIDE gameOver");
        await updateGame(
          gameId,
          null,
          parsedMessage.whiteTime,
          parsedMessage.blackTime,
          parsedMessage.winner
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
    const messageData = {
      type,
      sessionId: senderSessionId,
      sessionUsername: senderSessionUsername,
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
