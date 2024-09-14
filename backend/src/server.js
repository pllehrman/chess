const express = require("express");
const http = require("http");
const app = express();
const cors = require("cors");
const webSocketServer = require("./services/webSocket");

// Middleware
const {
  dbConnect,
  checkDatabaseConnection,
} = require("./middleware/dbConnect");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");

app.use(express.json()); // Middleware to parse JSON bodies
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "UPDATE", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());

// Routes
const games = require("./routes/games");
const sessions = require("./routes/sessions");
app.use("/api/games", games);
app.use("/api/sessions", sessions);

// Database connection
dbConnect();

app.get("/api/health", async (req, res) => {
  const dbHealth = await checkDatabaseConnection(); // Hypothetical function
  if (dbHealth) {
    res.status(200).json({ status: "Ok", database: "Connected" });
  } else {
    res.status(500).json({ status: "Error", database: "Disconnected" });
  }
});

app.get("/api", (req, res) => {
  res.status(200).json({
    status: "Ok",
    name: "chessGambit backend",
    version: "1.0.0",
  });
});

app.use(errorHandler);

const server = http.createServer(app);
webSocketServer(server);

const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
