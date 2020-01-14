import Knex from 'knex';
import KnexConfig from '../knexfile';

const knex = Knex(KnexConfig[process.env.NODE_ENV || 'development']);

export { knex };
