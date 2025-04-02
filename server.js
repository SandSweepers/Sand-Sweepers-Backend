require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const fs = require('fs');
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

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

const uploadsDir = path.resolve(__dirname, 'public/uploads');

const clearUploadsFolder = () => {
  if (fs.existsSync(uploadsDir)) {
    try {
      const files = fs.readdirSync(uploadsDir);
      for (const file of files) {
        const filePath = path.join(uploadsDir, file);
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      console.error('Error deleting files from uploads:', err);
    }
  }
};

process.on('SIGINT', async () => {
  console.log('\nShutting down server... Cleaning up uploads folder.');
  clearUploadsFolder();
  setTimeout(() => process.exit(), 1000);
});

process.on('SIGTERM', async () => {
  console.log('\nServer is shutting down... Cleaning up uploads folder.');
  clearUploadsFolder();
  setTimeout(() => process.exit(), 1000);
});

app.use((req, res, next) => {
  let token = req.headers["authorization"];

  if (!token) return next();

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

const server = http.createServer(app);

db.sequelize
  .sync({ force: true })
  .then(async () => {
    console.log("Database synced: tables dropped and recreated.");
    const PORT = process.env.HOST_PORT || 8080;
    server.listen(PORT, () => {
      console.log(`Server Working on ${PORT}.`);
    });
  })
  .catch((error) => {
    console.error("DB failed to initiate:", error);
  });