import knex from 'knex';
const knexConfig = require('./../../knexfile');

const connection = knex(knexConfig[process.env.NODE_ENV || 'development']);

export default connection;
