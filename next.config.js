require("dotenv").config();

module.exports = {
  reactStrictMode: true,
  env: {
    mongodburl: process.env.MONGO_DB_URL,
    appDomain: "app.sol-loyalty.com",
    apiVersion: "2021-10"
  }
};