const express = require("express");
const http = require("http");
const app = express();
const cors = require("cors");
const webSocketServer = require("./services/webSocket");

// Middleware
const dbConnect = require("./middleware/dbConnect");
const errorHandler = require("./middleware/errorHandler");
const generateNonce = require("./middleware/nonceGenerator");

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors());
app.use(generateNonce);

// Routes
const games = require("./routes/games");
app.use("/games", games);

// Database connection
dbConnect();

app.get("/", (req, res) => {
  res.send("Welcome to the backend!");
});

app.use(errorHandler);

const server = http.createServer(app);
webSocketServer(server);

const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
