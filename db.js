/** Database connection for messagely. */


const { Client } = require("pg");
const { DB_URI } = require("./config");

const client = new Client({
    database: DB_URI,
    user: 'robleo',
    password: 'pass',
});

client.connect();


module.exports = client;
