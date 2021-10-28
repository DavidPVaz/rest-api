/**
 * @module DatabasePlugin
 */
const Knex = require('knex');
const { Model } = require('objection');
const KnexConfig = require('knexfile');

/**
 * Plugin registration function
 * @param {Hapi.Server} server the hapi server
 */
const register = function (server) {
    const { config } = KnexConfig(process.env.NODE_ENV);
    const knex = Knex(config);
    Model.knex(knex);
    server.ext('onPostStop', () => knex.destroy());
};

module.exports = {
    name: 'database',
    register
};
