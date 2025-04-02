const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const friendList = sequelize.define("friendList", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
    });

    return friendList;
};
