require('dotenv').config();

module.exports = {
    "database": {
        DB_HOST: process.env.DB_HOST,
        DB_USER: process.env.DB_USER,
        DB_PASSWORD: process.env.DB_PASSWORD
    },
    "stellar": {
        SOROBAN_RPC: "https://soroban-testnet.stellar.org"
    },
    "raumNetwork": {
        FACTORY_ADDRESS: "",
        ROUTER_ADDRESS: "CBNPQTURFVN4GQGJQFJFZ6PAW6KTE3PF4YUQ4NVKFLOHEWWAHKFNKBTN"
    }
};
