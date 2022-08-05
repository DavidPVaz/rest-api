/**
 * @module UserService
 */
const Config = require('config');
const Repository = require('plugins/repository');
const Authentication = require('utils/auth');
const APIError = require('errors/api-error');

const internals = {};

/**
 * Add eager fetching for roles
 * @param {boolean} withRoles - whether or not to include roles
 * @param {Objection.QueryBuilder} query - the query builder
 * @return {Objection.QueryBuilder} the query builder
 */
internals.withRoles = (withRoles, query) => (withRoles ? query.withGraphFetched('roles') : query);

/**
 * Checks if the provided `username` or `email` already exist.
 * @async
 * @param {Object} user - User data to verify.
 * @param {Object} txModel - model binded to a transaction
 * @throw Will throw an Error if any match is found in the database.
 */
internals.checkForEqualValues = async function ({ username, email, id }, txModel) {
    const result =
        username || email
            ? await txModel
                  .query()
                  .skipUndefined()
                  .whereNot({ id })
                  .where(builder => builder.skipUndefined().where({ username }).orWhere({ email }))
            : [];

    if (result.length > 0) {
        const field = result[0].username === username ? 'username' : 'email';
        const message = `That ${field} already exists`;
        throw APIError.RESOURCE_DUPLICATE(message);
    }
};
/**
 * Checks if the provided `id` refers to an existing user.
 * @async
 * @param {number} id - Id number to verify.
 * @param {Object} txModel - model binded to a transaction
 * @throw Will throw an Error if an user with the provided `id` is not found in the database.
 */
internals.checkIfUserExists = async function (id, txModel) {
    const user = await txModel.findById(id);
    APIError.assert(user, APIError.RESOURCE_NOT_FOUND);

    return user;
};

/**
 * Authenticates an existing user.
 * @async
 * @param {Object} user - user to validate.
 * @return {string} An authentication token (JWT).
 */
exports.authenticate = async function ({ username, password }) {
    const user = await Repository.User.findOne({ username });
    APIError.assert(user, APIError.AUTH_INVALID_CREDENTIALS);
    const isValid = await Authentication.validatePassword(password, user.password);
    APIError.assert(isValid, APIError.AUTH_INVALID_CREDENTIALS);

    return Authentication.getToken(user.id, Config.authentication.renewIn);
};

/**
 * Counts the number of users
 * @returns {Promise<number>} the number of users
 */
exports.count = async function () {
    return (await Repository.User.count()).count;
};

/**
 * List users from the database.
 * @return {Promise<User[]>} An array with all the users.
 */
exports.list = function () {
    return Repository.User.findAll().omit('password');
};

/**
 * Get a single user from the database.
 * @param {number} id - user id
 * @return {Promise<User>} The queried user.
 */
exports.findById = function (id) {
    return Repository.User.findById(id).omit('password');
};

/**
 * Get a single user from the database.
 * @param {Object|string|number} values - the values to query for.
 * @param {Object} [criteria] - criteria object
 * @return {Promise<User>} The queried user.
 */
exports.findOne = function (value, criteria = {}) {
    const query = Repository.User.findOne(value).omit('password');
    internals.withRoles(criteria.withRoles, query);

    return query;
};

/**
 * Creates a new user in the database.
 * @param {Object} user - User data to persist.
 * @return {Promise<Object>} The created user.
 */
exports.create = function (user) {
    return Repository.tx(Repository.User.model, async txUser => {
        await internals.checkForEqualValues(user, txUser);
        user.password = await Authentication.generateHash(user.password);

        return txUser.add(user);
    });
};

/**
 * Update an existing user in the database.
 * @param {number} id - id of the user.
 * @param {Object} updatedUser - Updated user data.
 * @return {Promise<number>} The number of updated rows.
 */
exports.update = function (id, updatedUser) {
    return Repository.tx(Repository.User.model, async txUser => {
        await internals.checkIfUserExists(id, txUser);
        await internals.checkForEqualValues({ id, ...updatedUser }, txUser);

        if (updatedUser.password) {
            updatedUser.password = await Authentication.generateHash(updatedUser.password);
        }

        return txUser.patch(id, updatedUser);
    });
};

/**
 * Removes an existing user from the database.
 * @param {number} id - Id number of the user.
 * @return {Promise<number>} The number of deleted rows.
 */
exports.remove = function (id) {
    return Repository.tx(Repository.User.model, async txUser => {
        const user = await internals.checkIfUserExists(id, txUser);
        // remove all roles from user
        await user.$relatedQuery('roles').unrelate();

        return txUser.remove(id);
    });
};

/**
 * It will relate and/or unrelate a user and a set of roles
 * @param {number} id the id of the user
 * @param {Array<number>} roleIds the ids of the roles
 * @returns {Promise<User>} the updated user
 */
exports.upsertRoles = function (id, roleIds) {
    return Repository.tx(
        [Repository.User.model, Repository.Role.model],
        async (txUserRepository, txRoleRepository) => {
            const user = await internals.checkIfUserExists(id, txUserRepository);

            const getRolesById = roleIds.map(roleId => txRoleRepository.findById(roleId));
            const roles = await Promise.all(getRolesById);

            APIError.assert(
                roles.every(permission => permission),
                APIError.RESOURCE_NOT_FOUND
            );

            user.roles = roleIds.map(id => ({ id }));

            return txUserRepository.query().upsertGraphAndFetch(user, {
                unrelate: true,
                relate: true,
                noDelete: true,
                noInsert: true,
                noUpdate: true
            });
        }
    );
};
