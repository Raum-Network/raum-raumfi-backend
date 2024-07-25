const { Pool } = require('pg');
const config = require("../config");

const pool = new Pool({
    user: config.database.USER,
    host: config.database.HOST,
    database: config.database.DATABASE,
    password: config.database.PASSWORD,
    port: config.database.PORT,
});

pool.on('connect', () => {
    console.log('Connected to the PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});

const query = (text, params) => pool.query(text, params);

module.exports = {
    query,
    pool,
};
