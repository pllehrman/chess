const { WebSocketServer } = require('ws')
const url = require('url')
const uuidv4 = require('uuid').v4
const { joinGame, leaveGame, gameCapacity, updateGame } = require('../controllers/games')

class WebSocketManager {
  constructor (server) {
    this.wsServer = new WebSocketServer({ server })
    this.connections = {} // Store active WebSocket connections
    this.users = {} // Store user data by their UUID

    this.initialize()
  }

  initialize () {
    this.wsServer.on('connection', this.onConnection.bind(this))
    console.log('WebSocket initialized.')
  }

  async onConnection (connection, request) {
    const { username, gameId, orientation } = url.parse(request.url, true).query
    const userUuid = uuidv4()

    try {
      await this.handleJoinGame(gameId, orientation, connection, userUuid)
    } catch (error) {
      console.log(`Error joining game: ${error.message}`)
      connection.close()
      return
    }

    console.log(`${username} is now connected to the WebSocket with UUID: ${userUuid}.`)

    // Store the connection and user data
    this.connections[userUuid] = connection
    this.users[userUuid] = { gameId, orientation, username }

    connection.on('message', this.onMessage.bind(this, userUuid))
    connection.on('close', this.onClose.bind(this, userUuid))
  }

  async handleJoinGame (gameId, orientation, connection, userUuid) {
    // Join the game in the database
    await joinGame(gameId, orientation)

    // Notify the client of the join event
    const entryCapacity = await gameCapacity(gameId)
    this.broadcastMessage('capacityUpdate', null, { gameId, capacity: entryCapacity })

    // Resend the message on a delay to ensure all clients are up to date
    setTimeout(() => {
      this.broadcastMessage('capacityUpdate', null, { gameId, capacity: entryCapacity })
    }, 3000)

    console.log('Successfully joined the game')
  }

  async onMessage (userUuid, message) {
    const messageString = message.toString('utf-8')

    try {
      const parsedMessage = JSON.parse(messageString)
      const user = this.users[userUuid]

      console.log(parsedMessage)

      if (parsedMessage.type === 'chat') {
        this.broadcastMessage('chat', userUuid, parsedMessage.message)
      } else if (parsedMessage.type === 'move') {
        this.broadcastMessage('move', userUuid,
          { move: parsedMessage.move, whiteTime: parsedMessage.whiteTime, blackTime: parsedMessage.blackTime })

        await updateGame(user.gameId, parsedMessage.fen, parsedMessage.whiteTime, parsedMessage.blackTime)
      } else if (parsedMessage.type === 'sync') {
        this.broadcastMessage('sync', userUuid,
          { fen: parsedMessage.move, whiteTime: parsedMessage.whiteTime, blackTime: parsedMessage.blackTime })

        await updateGame(user.gameId, parsedMessage.fen, parsedMessage.whiteTime, parsedMessage.blackTime)
      }
    } catch (error) {
      console.error(`Error parsing message: ${error.message}`)
    }
  }

  async onClose (userUuid) {
    const user = this.users[userUuid]
    console.log(`${user.username} disconnected`)

    try {
      await leaveGame(user.gameId, user.orientation)
      console.log('Successfully left the game')
    } catch (error) {
      console.error(`Error leaving game: ${error.message}`)
    }

    const exitCapacity = await gameCapacity(user.gameId)
    this.broadcastMessage('capacityUpdate', null, { gameId: user.gameId, capacity: exitCapacity })

    // Resend the message on a delay to ensure all clients are up to date and clean up
    setTimeout(() => {
      this.broadcastMessage('capacityUpdate', null, { gameId: user.gameId, capacity: exitCapacity })
      this.removeUser(userUuid)
    }, 3000)
  }

  removeUser (userUuid) {
    delete this.connections[userUuid]
    delete this.users[userUuid]
  }

  broadcastMessage (type, senderUuid, message) {
    const messageData = {
      type,
      ...(this.users[senderUuid] && { username: this.users[senderUuid].username }),
      message
    }

    const messageString = JSON.stringify(messageData)

    Object.keys(this.connections).forEach((uuid) => {
      // Don't want to broadcast the message to the sender
      if (uuid !== senderUuid) {
        this.connections[uuid].send(messageString)
      }
    })
  }
}

module.exports = (server) => new WebSocketManager(server)
