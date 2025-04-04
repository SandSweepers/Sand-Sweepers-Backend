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
db.friendList = require("./friend.model.js")(sequelize, Sequelize);
db.location = require("./location.model.js")(sequelize, Sequelize);
db.activity = require("./activity.model.js")(sequelize, Sequelize);
db.prizes = require("./achievement.model.js")(sequelize, Sequelize);


db.user.hasOne(db.friendList, {
  foreignKey: "userId",
  sourceKey: "id",
  onDelete: "CASCADE",
});

db.friendList.belongsTo(db.user, {
  foreignKey: "userId",
  targetKey: "id",
});


db.user.belongsToMany(db.location, {
  through: "UserLocations", // Table intermédiaire
  foreignKey: "userId",
  otherKey: "locationId",
});

db.location.belongsToMany(db.user, {
  through: "UserLocations", // Table intermédiaire
  foreignKey: "locationId",
  otherKey: "userId",
});

// Relation Location <-> Activity (1:N)
db.location.hasMany(db.activity, {
  foreignKey: "locationId",
  sourceKey: "id",
  onDelete: "CASCADE",
});

db.activity.belongsTo(db.location, {
  foreignKey: "locationId",
  targetKey: "id",
});

// Relation User <-> Activity (N:N)
db.user.belongsToMany(db.activity, {
  through: "UserActivities", // Table intermédiaire
  foreignKey: "userId",
  otherKey: "activityId",
});

db.activity.belongsToMany(db.user, {
  through: "UserActivities", // Table intermédiaire
  foreignKey: "activityId",

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
