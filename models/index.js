const dbConfig = require("../config/config.js");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");

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

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Op = Op;

db.user = require("./user.model.js")(sequelize, Sequelize);
db.friendList = require("./friendList.model.js")(sequelize, Sequelize);
db.prizes = require("./prizes.model.js")(sequelize, Sequelize);

db.user.hasOne(db.friendList, {
  foreignKey: "userId",
  sourceKey: "id",
  onDelete: "CASCADE",
});

db.friendList.belongsTo(db.user, {
  foreignKey: "userId",
  targetKey: "id",
});

db.user.belongsToMany(db.prizes, {
  through: "user_prizes", 
  foreignKey: "userId",
  otherKey: "prizeId",
});

db.prizes.belongsToMany(db.user, {
  through: "user_prizes", 
  foreignKey: "prizeId",
  otherKey: "userId",
});

module.exports = db;
