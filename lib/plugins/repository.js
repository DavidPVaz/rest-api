/**
 * @module RepositoryPlugin
 */
const Package = require('package.json');
const { transaction } = require('objection');

const internals = {};

/**
 * Class representing a Repository for a specific model
 */
internals.ModelRepository = class {
    /**
     * Create a new Repository
     * @param {Objection.Model} Model the model to create the repository for
     */
    constructor(Model) {
        this.model = Model;
    }

    /**
     * Performs a query that `fetch` all rows of this Model database tables
     * @return {Objection.QueryBuilder} The associated query.
     */
    findAll() {
        return this.model.query();
    }

    /**
     * Retrieves an entity by its id
     * @param {number} id the entity id
     * @param {Knex.transaction} [tx] optional transaction to bind to
     * @returns {Objection.QueryBuilder} the associated query
     */
    findById(id, tx) {
        return this.model.query(tx).findById(id);
    }

    /**
     * Retrieves an entity by some value
     * @param {Object} value - any value used to query.
     * @param {Knex.transaction} [tx] optional transaction to bind to
     * @returns {Objection.QueryBuilder} the associated query
     */
    findOne(value, tx) {
        return this.model.query(tx).findOne(value);
    }

    /**
     * Saves the given entity
     * @param {Objection.Model} entity the entity to save
     * @param {Knex.transaction} [tx] optional transaction to bind to
     * @returns {Objection.QueryBuilder} the associated query
     */
    add(entity, tx) {
        return this.model.query(tx).insert(entity);
    }

    /**
     * Patch an existing entity
     * @param {number} id the entity id
     * @param {Objection.Model} entity the entity to update
     * @param {Knex.transaction} [tx] optional transaction to bind to
     * @returns {Objection.QueryBuilder} the associated query
     */
    patch(id, entity, tx) {
        return this.model.query(tx).patchAndFetchById(id, entity);
    }

    /**
     * Removes an existing entity by its id
     * @param {number} id the entity id
     * @param {Knex.transaction} [tx] optional transaction to bind to
     * @returns {Objection.QueryBuilder} the associated query
     */
    remove(id, tx) {
        return this.model.query(tx).deleteById(id);
    }

    /**
     * Counts the number of entity instances
     * @returns {Objection.QueryBuilder} the associated query
     */
    count() {
        return this.model.query().count('* as count').first();
    }

    /**
     * Creates a query for the model
     * @params {Knex.Transaction} [tx] optional transaction to bind query to
     * @returns {Objection.QueryBuilder} the model query
     */
    query(tx) {
        return this.model.query(tx);
    }
};

/**
 * Creates a new repository for a model
 * @param {string} model the model file name
 * @returns {ModelRepository} the created repository
 */
internals.create = function (model) {
    const Model = require(`models/${model}`);
    return new internals.ModelRepository(Model);
};

/**
 * Binds a set of model repositories to a transaction
 * @example
 * Repository.tx([UserModel, RoleModel], (userTxRepo, roleTxRepo) => {
 *     // both remove operations are executed on a newly created db transaction
 *     txUserRepo.remove(1);
 *     txRoleRepo.remove(1);
 * });
 *
 * @param {Objection.Model|Objection.Model[])} the models to create transaction bounded repositories
 * @param {Function)} cb callback function to call with transaction bounded repositories
 * @returns {Promise} resolved if the transaction was committed with success
 */
exports.tx = function (models, cb) {
    models = Array.isArray(models) ? models : [models];

    // adds a new callback, to be invoked by the orm after binding models to transaction
    const next = (...args) => {
        // obtain transacting repositories from orm
        const txRepos = args.map(txModel => new internals.ModelRepository(txModel));

        // invoke the original callback with transactional bounded repos
        return cb.apply(null, txRepos);
    };

    return transaction.apply(null, [...models, next]);
};

/**
 * Plugin registration function
 * @param {Hapi.Server} server the hapi server
 * @param {Object} options the plugin registration options
 */
const register = function (server, options) {
    if (!options.models) {
        return;
    }

    // attach each model repository to this module for easy consumption by services
    options.models.forEach(model => {
        const repo = internals.create(model);
        const { name } = repo.model;
        exports[name] = repo;

        server.logger.child({ plugin: exports.plugin.name, model: name }).debug('model');
    });

    server.logger.child({ plugin: exports.plugin.name }).debug('plugin');
};

exports.plugin = {
    name: 'repository',
    pkg: Package,
    register
};
