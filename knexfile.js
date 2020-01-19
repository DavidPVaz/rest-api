/** 
 * @file Where knex configuration object for different node environments is defined.
 * 
 * {@link http://knexjs.org/}
 */

const dotenv = require('dotenv');

dotenv.config();

const KnexConfig = {

    development: {
        client: 'pg',
        connection: process.env.DB_URI,
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            directory: './db/migrations'
        },
        seeds: {
            directory: './db/seeds'
        },
        acquireConnectionTimeout: 1000
    }
};

module.exports = KnexConfig;
