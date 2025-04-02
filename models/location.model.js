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
// Fonction d'initialisation
async function initializeDatabase() {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synchronized');
    return Location; // Ici le return est au bon endroit
  } catch (error) {
    console.error('Database sync failed:', error);
    throw error;
  }
}
// Exportation
module.exports = {
  Location,
  initializeDatabase
};  