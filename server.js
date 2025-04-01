require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./models/index.js");

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

const routes = [
    "user",
    "example1",
];

routes.forEach((route) => require(`./routes/${route}.routes.js`)(app));

db.sequelize
    .sync({ force: true })
    .then(async () => {
        console.log("Database synced: tables dropped and recreated.");

        const PORT = process.env.HOST_PORT_DEV || 8080;

        server.listen(PORT, () => {
            console.log(`Server on in port ${PORT}.`);
        });
    })
    .catch((error) => {
        console.error("Database error", error);
    });
