/** 
 * @file Holds the single instance of the knex module with the correct environment configuration.
 * 
 * {@link http://knexjs.org/}
 */

import Knex from 'knex';
import KnexConfig from '../knexfile';

const knex = Knex(KnexConfig[process.env.NODE_ENV || 'development']);

export { knex };
