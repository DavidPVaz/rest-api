/**
 * @file Where knex configuration object for different node environments is defined.
 * {@link http://knexjs.org/}
 */
const dotenv = require('dotenv');
const { useMappers } = require('utils/knex-mappers');

const { activateMappers, deactivateMappers, ...mappers } = useMappers();
dotenv.config();

const KnexConfig = {
    testing: {
        client: 'sqlite3',
        connection: ':memory:',
        migrations: {
            directory: './db/migrations/development'
        },
        useNullAsDefault: true,
        log: {
            warn() {} // discards all warnings. https://knexjs.org/#Installation-log
        },
        ...mappers
    },

    development: {
        client: 'pg',
        connection: {
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASS
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            directory: './db/migrations/development'
        },
        seeds: {
            directory: './db/seeds/development/importer'
        },
        acquireConnectionTimeout: 1000,
        ...mappers
    }
};

module.exports = function (environment) {
    const config = KnexConfig[environment];
    return { config, activateMappers, deactivateMappers };
};
