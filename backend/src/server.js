const express = require('express');
const http = require('http');
const cors = require('cors');
const app = express();

// Services
const setupWebSocketServer = require('./services/websocket');
const chatWebSocketServer = require('./services/chatWebSocket');

// Routes
const games = require('./routes/games');
const users = require('./routes/users');

// Middleware 
const dbConnect = require('./middleware/dbConnect');
const errorHandler = require('./middleware/errorHandler');
const generateNonce = require('./middleware/nonceGenerator');

app.use(express.json()); // middleware to parse JSON bodies
app.use(cors());
app.use(generateNonce);

app.get('/api/nonce', (req, res) => {
  res.json({ nonce: res.locals.nonce });
});

// Serving routes
app.use('/games', games);
app.use('/users', users);

// Establishing DB connection
dbConnect();

app.get('/', (req, res) => {
  res.send('Welcome to the backend!');
});

app.use(errorHandler);

// WebSocket setup
const server = http.createServer(app);
setupWebSocketServer(server);

if (require.main === module) {
  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

// Let's add the microservices down here for websockets
chatWebSocketServer();

module.exports = app;
