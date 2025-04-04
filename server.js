require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const http = require("http");
const WebSocket = require("ws");
const path = require('path');
const db = require("./models/index.js");
const app = express();

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  let token = req.headers["authorization"];

  if (!token) return next();

  if (!req.body) {
    req.body = {};
  }

  if (token.startsWith("Basic ")) {
    const base64Credentials = token.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString("ascii");
    const [username, password] = credentials.split(":");
    req.body.username = username;
    req.body.password = password;
    return next();
  }

  token = token.replace("Bearer ", "");
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({
        error: true,
        message: "Invalid user.",
      });
    } else {
      req.user = user;
      req.token = token;
      next();
    }
  });
});

const routes = [
  "user",
];

routes.forEach((route) => require(`./routes/${route}.routes.js`)(app));

async function runSeeders() {
  const seeders = [
    require("./seeders/20250404073103-user.js")
  ];

  for (const seeder of seeders) {
    await seeder.up(db.sequelize.getQueryInterface(), db.Sequelize);
  }
}

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  ws.send(JSON.stringify({ message: "Welcome to the WebSocket server." }));

  ws.on("message", (message) => {

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", () => console.log("Client disconnected."));
  ws.on("error", (error) => console.error("WebSocket error:", error));
});

app.set("wss", wss);

db.sequelize
  .sync({ force: true })
  .then(async () => {

    console.log("Database synced: tables dropped and recreated.");
    await runSeeders();

    const PORT = process.env.HOST_PORT || 8080;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}.`);
      console.log(`WebSocket server running on port ${PORT}.`);
    });
  })
  .catch((error) => {
    console.error("Error syncing the database:", error);
  });
