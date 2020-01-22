import { Model } from 'objection';
import { knex } from '../../db/knex';

function register(server) {
    Model.knex(knex);
    server.ext('onPostStop', () => knex.destroy());
}

export default {
    name: 'database',
    register
};
