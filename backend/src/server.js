const express = require('express');
const http = require('http');
const app = express();
const cors = require('cors');
const setupChessWebSocketServer = require('./services/chessWebsocket');
const setupChatWebSocketServer = require('./services/chatWebSocket');
const simpleWebSocketServer = require('./services/exampleWebSocket');

// Middleware
const dbConnect = require('./middleware/dbConnect');
const errorHandler = require('./middleware/errorHandler');
const generateNonce = require('./middleware/nonceGenerator');
const useSessions = require('./middleware/sessions');

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors());
app.use(generateNonce);
// app.use(useSessions)

// Routes
const games = require('./routes/games');
const users = require('./routes/users');

app.use('/games', games);
app.use('/users', users);

// Database connection
dbConnect();

app.get('/', (req, res) => {
  res.send('Welcome to the backend!');
});

app.use(errorHandler);

const server = http.createServer(app);

// setupChessWebSocketServer(server);
// setupChatWebSocketServer(server);
simpleWebSocketServer(3003);

const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
