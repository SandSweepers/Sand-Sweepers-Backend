const dbConfig = require("../config/config.js");
const Sequelize = require("sequelize");

const db = {};

let sequelize;

try {
    sequelize = new Sequelize(
        dbConfig.database,
        dbConfig.username,
        dbConfig.password,
        {
            host: dbConfig.host,
            dialect: dbConfig.dialect,
            port: dbConfig.port,
            logging: dbConfig.logging
        }
    );

    console.log("Database connection established successfully.");
} catch (error) {
    console.error("Error: Sequelize failed to initialize:", error.message);
    process.exit(1);
}


//setup models


//association


module.exports = db;