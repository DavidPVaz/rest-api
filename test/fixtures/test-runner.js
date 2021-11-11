const Lab = require('@hapi/lab');
const Hoek = require('@hapi/hoek');
const DatabaseFixture = require('test/fixtures/database');
const ServerFixture = require('test/fixtures/server');
/**
 * Generates a test script.
 * @see {@link https://hapi.dev/module/lab/api/?v=24.1.1#labscriptoptions|@hapi/lab Documentation}
 * @returns the generated test script.
 */
exports.script = function () {
    const lab = Lab.script();
    const [describe, it, before, after, beforeEach, afterEach] = [
        lab.describe,
        lab.it,
        lab.before,
        lab.after,
        lab.beforeEach,
        lab.afterEach
    ].map(method => Hoek.clone(method));

    let knex;
    const options = {};
    const callbacks = {};

    lab.describe = (title, content, { seeds = [], models = [] } = {}) => {
        options.seeds = seeds;
        options.models = models;

        describe(title, () => {
            content();

            before(async flags => {
                knex = await DatabaseFixture.init();

                if (callbacks.before) {
                    await callbacks.before(flags, knex);
                }
            });

            beforeEach(async flags => {
                if (callbacks.beforeEach) {
                    await callbacks.beforeEach(flags, knex);
                }
            });

            afterEach(async () => {
                if (callbacks.afterEach) {
                    callbacks.afterEach(knex);
                }
            });

            after(async flags => {
                if (callbacks.after) {
                    await callbacks.after(flags, knex);
                }

                await DatabaseFixture.destroy(knex);
            });
        });
    };

    lab.it = (title, test, { seeds, models, overwrite = false } = {}) => {
        const toMerge = { seeds, models };
        const [seedsToUse, modelsToUse] = Object.entries(toMerge).map(([key, values]) =>
            !!values && overwrite ? values : [...(values || []), ...options[key]]
        );

        // used by controllers
        if (!seedsToUse.length && !modelsToUse.length) {
            it(title, async flags => {
                const server = await ServerFixture.init();
                try {
                    await test(server, flags);
                } finally {
                    await ServerFixture.destroy(server);
                }
            });
            return;
        }

        // used by services
        it(title, async flags => {
            const server = await ServerFixture.init(modelsToUse);
            await DatabaseFixture.populate(knex, seedsToUse);

            try {
                await test(knex, flags);
            } finally {
                await DatabaseFixture.truncate(knex);
                await ServerFixture.destroy(server);
            }
        });
    };

    lab.before = callback => {
        callbacks.before = callback;
    };

    lab.after = callback => {
        callbacks.after = callback;
    };

    lab.beforeEach = callback => {
        callbacks.beforeEach = callback;
    };

    lab.afterEach = callback => {
        callbacks.afterEach = callback;
    };

    return lab;
};
