import { knex } from '../../db/knex';

(async function() {

    try {
        await knex.migrate.latest();
        await knex.seed.run();
    } catch (error) {
        console.log(error);
    } finally {
        await knex.destroy();
    }
})();
