const dotenv =  require('dotenv');
const env = dotenv.config();
module.exports = {
  development: {
    host: process.env.DB_HOST,
    username: process.env.DB_USER_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    dialect: process.env.DB_DIALECT,
  },
};