const express = require("express");
const http = require("http");
const app = express();
const cors = require("cors");
const webSocketServer = require("./services/webSocket");

// Middleware
const dbConnect = require("./middleware/dbConnect");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");

app.use(express.json()); // Middleware to parse JSON bodies
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "UPDATE", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());

// Routes
const games = require("./routes/games");
const sessions = require("./routes/session");
app.use("/games", games);
app.use("/session", sessions);

// Database connection
dbConnect();

// app.get("/health", async (req, res) => {
//   const dbHealth = await checkDatabaseConnection(); // Hypothetical function
//   if (dbHealth) {
//     res.status(200).json({ status: "Ok", database: "Connected" });
//   } else {
//     res.status(500).json({ status: "Error", database: "Disconnected" });
//   }
// });

app.get("/", (req, res) => {
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
