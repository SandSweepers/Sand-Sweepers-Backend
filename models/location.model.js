const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new sequelize ('sqlite::memory:');

const Location = sequelize.define('Location', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  desciption: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  points: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
});
// Exportation
module.exports = {
  Location,
};  