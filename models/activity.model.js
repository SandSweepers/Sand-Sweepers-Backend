const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

// Définition du modèle
const Activity = sequelize.define('Activity', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  kg: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false,
  }
});

// Fonction d'initialisation
async function initializeDatabase() {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synchronized');
    return Activity; // Ici le return est au bon endroit
  } catch (error) {
    console.error('Database sync failed:', error);
    throw error;
  }
}

// Exportation
module.exports = {
  Activity,
  initializeDatabase
};
