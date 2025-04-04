const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const prizes = sequelize.define("achievement", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        description: {
            type: DataTypes.STRING,
        },
    });

    return achievement;
};
