require("dotenv").config();

module.exports = {
  reactStrictMode: true,
  env: {
    mongodburl: "mongodb+srv://admin:Ntt141187@cluster0.eboyt.mongodb.net/loyalty-solana",
    appDomain: "app.sol-loyalty.com",
    apiVersion: "2021-10"
  }
};