const { WebSocketServer } = require("ws");
const url = require("url");
const {
  setGameSessionId,
  increaseNumPlayers,
  decreaseNumPlayers,
  gameCapacity,
  updateGame,
} = require("../controllers/games");

class WebSocketManager {
  constructor(server) {
    this.wsServer = new WebSocketServer({ server });
    this.connections = {}; // Store multiple WebSocket connections by sessionId
    this.users = {}; // Store user data by sessionId

    this.initialize();
  }

  initialize() {
    this.wsServer.on("connection", this.onConnection.bind(this));
    console.log("WebSocket initialized.");
  }

  async onConnection(connection, request) {
    const { sessionId, username, gameId, orientation } = url.parse(
      request.url,
      true
    ).query;

    if (!sessionId) {
      console.log("Missing sessionId. Connection closed.");
      connection.close();
      return;
    }

    try {
      await this.handleJoinGame(gameId, orientation, connection, sessionId);
    } catch (error) {
      console.log(`Error joining game: ${error.message}`);
      connection.close();
      return;
    }

    console.log(
      `${username} is now connected to the WebSocket with sessionId: ${sessionId}.`
    );

    // Store the connection and user data by sessionId and gameId
    if (!this.connections[sessionId]) {
      this.connections[sessionId] = {}; // Initialize an object to hold connections per game
      this.users[sessionId] = { username }; // Initialize user data
    }

    // Store the connection for the specific game
    this.connections[sessionId][gameId] = connection;
    this.users[sessionId][gameId] = { gameId, orientation };

    connection.on("message", this.onMessage.bind(this, sessionId, gameId));
    connection.on("close", this.onClose.bind(this, sessionId, gameId));
  }

  async handleJoinGame(gameId, orientation, connection, sessionId) {
    // Join the game in the database
    await setGameSessionId(gameId, orientation, sessionId);
    const entryCapacity = await increaseNumPlayers(gameId);

    // Notify the client of the join event
    this.broadcastMessage("capacityUpdate", sessionId, gameId, {
      gameId,
      capacity: entryCapacity,
    });

    // Resend the message on a delay to ensure all clients are up to date
    setTimeout(() => {
      this.broadcastMessage("capacityUpdate", sessionId, gameId, {
        gameId,
        capacity: entryCapacity,
      });
    }, 3000);

    console.log("Successfully joined the game");
  }

  async onMessage(sessionId, gameId, message) {
    const messageString = message.toString("utf-8");

    try {
      const parsedMessage = JSON.parse(messageString);
      const user = this.users[sessionId][gameId];

      console.log(parsedMessage);

      if (parsedMessage.type === "chat") {
        this.broadcastMessage("chat", sessionId, gameId, parsedMessage.message);
      } else if (parsedMessage.type === "move") {
        this.broadcastMessage("move", sessionId, gameId, {
          move: parsedMessage.move,
          whiteTime: parsedMessage.whiteTime,
          blackTime: parsedMessage.blackTime,
        });

        await updateGame(
          user.gameId,
          parsedMessage.fen,
          parsedMessage.whiteTime,
          parsedMessage.blackTime
        );
      }
    } catch (error) {
      console.error(`Error parsing message: ${error.message}`);
    }
  }

  async onClose(sessionId, gameId) {
    const user = this.users[sessionId][gameId];
    if (!user) return;

    console.log(
      `${this.users[sessionId].username} disconnected from game ${gameId}`
    );

    try {
      const exitCapacity = await decreaseNumPlayers(user.gameId);
      console.log("Successfully left the game");
    } catch (error) {
      console.error(`Error leaving game: ${error.message}`);
    }

    this.broadcastMessage("capacityUpdate", sessionId, gameId, {
      gameId: user.gameId,
      capacity: exitCapacity,
    });

    // Resend the message on a delay to ensure all clients are up to date and clean up
    setTimeout(() => {
      this.broadcastMessage("capacityUpdate", sessionId, gameId, {
        gameId: user.gameId,
        capacity: exitCapacity,
      });
      this.removeUserFromGame(sessionId, gameId);
    }, 3000);
  }

  removeUserFromGame(sessionId, gameId) {
    if (this.connections[sessionId]) {
      delete this.connections[sessionId][gameId];
      delete this.users[sessionId][gameId];

      // If no more games are associated with the session, clean up the session data
      if (Object.keys(this.connections[sessionId]).length === 0) {
        delete this.connections[sessionId];
        delete this.users[sessionId];
      }
    }
  }

  broadcastMessage(type, senderSessionId, gameId, message) {
    const messageData = {
      type,
      ...(this.users[senderSessionId] && {
        username: this.users[senderSessionId].username,
      }),
      message,
    };

    const messageString = JSON.stringify(messageData);

    // Send the message only to the connections of the same game
    Object.keys(this.connections).forEach((sessionId) => {
      if (
        this.connections[sessionId][gameId] &&
        sessionId !== senderSessionId
      ) {
        this.connections[sessionId][gameId].send(messageString);
      }
    });
  }
}

module.exports = (server) => new WebSocketManager(server);
