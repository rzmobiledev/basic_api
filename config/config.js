require("dotenv").config();

module.exports = {
  "development": {
    "username": process.env.DBUSER,
    "password": process.env.DBPASSWORD,
    "database": process.env.DBNAME,
    "host": process.env.HOST,
    "dialect": "postgres"
  },
  "test": {
    "username": process.env.DBUSER,
    "password": process.env.DBPASSWORD,
    "database": process.env.DBNAMETEST,
    "host": process.env.HOST,
    "dialect": "postgres"
  },
  "production": {
    "username": process.env.DBUSER,
    "password": process.env.DBPASSWORD,
    "database": process.env.DBNAME,
    "host": process.env.HOST,
    "dialect": "postgres"
  }
}
