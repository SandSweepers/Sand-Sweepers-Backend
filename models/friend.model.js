const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const friendList = sequelize.define("friend", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
    });

    return friendList;
};
