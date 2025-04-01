require("dotenv").config();

module.exports = {
    development: {
      username: process.env.MYSQL_USER_DEV,
      password: process.env.MYSQL_PASSWORD_DEV,
      database: process.env.MYSQL_DATABASE_DEV,
      host: process.env.DB_HOST_DEV,
      dialect: 'mysql'
    }
  }