/**
 * @module RoleService
 */
const Repository = require('plugins/repository');
const APIError = require('errors/api-error');

const internals = {};
/**
 * Checks if the provided `name` already exist.
 * @async
 * @param {Object} role - Role data to verify.
 * @param {Object} txModel - model binded to a transaction
 * @throw Will throw an Error if any match is found in the database.
 */
internals.checkForEqualValues = async function ({ name, id }, txModel) {
    const result = name
        ? await txModel.query().skipUndefined().where({ name }).whereNot({ id })
        : [];

    APIError.assert(result.length === 0, APIError.RESOURCE_DUPLICATE);
};

/**
 * Checks if the provided `id` refers to an existing role.
 * @async
 * @param {number} id - Id number to verify.
 * @param {Object} txModel - model binded to a transaction
 * @throw Will throw an Error if a role with the provided `id` is not found in the database.
 */
internals.checkIfRoleExists = async function (id, txModel) {
    const role = await txModel.findById(id).withGraphFetched('permissions');
    APIError.assert(role, APIError.RESOURCE_NOT_FOUND);

    return role;
};

/**
 * Counts the number of roles
 * @returns {Promise<number>} the number of roles
 */
exports.count = async function () {
    return (await Repository.Role.count()).count;
};

/**
 * List roles from the database.
 * @return {Promise<Role[]>} An array with all the roles.
 */
exports.list = function () {
    return Repository.Role.findAll();
};

/**
 * Get a single role from the database.
 * @param {number} id - role id
 * @return {Promise<Role>} The queried role.
 */
exports.findById = function (id) {
    return Repository.Role.findById(id);
};

/**
 * Get a single role from the database.
 * @param {Object} value - the value to query for.
 * @return {Promise<Role>} The queried role.
 */
exports.findOne = function (value) {
    return Repository.Role.findOne(value);
};

/**
 * Creates a new role in the database.
 * @param {Object} role - role data to persist.
 * @return {Promise<Role>} The created role.
 */
exports.create = function (role) {
    return Repository.tx(Repository.Role.model, async txRole => {
        await internals.checkForEqualValues(role, txRole);

        return txRole.add(role);
    });
};

/**
 * Update an existing role in the database.
 * @param {number} id - id of the role.
 * @param {Object} updateRole - Updated role data.
 * @return {Promise<number>} The number of updated rows.
 */
exports.update = function (id, updatedRole) {
    return Repository.tx(Repository.Role.model, async txRole => {
        await internals.checkIfRoleExists(id, txRole);
        await internals.checkForEqualValues({ id, ...updatedRole }, txRole);

        return txRole.patch(id, updatedRole);
    });
};

/**
 * Removes an existing role from the database.
 * @param {number} id - Id number of the role.
 * @return {Promise<number>} The number of deleted rows.
 */
exports.remove = function (id) {
    return Repository.tx(Repository.Role.model, async txRole => {
        const role = await internals.checkIfRoleExists(id, txRole);

        // can't remove if there is still users with this role
        const userCount = await role.$relatedQuery('users').resultSize();
        APIError.assert(Number.parseInt(userCount) === 0, APIError.RESOURCE_RELATION);

        // removes all relations with this role's permissions
        if (role.permissions.length) {
            await role.$relatedQuery('permissions').unrelate();
        }

        return txRole.remove(id);
    });
};

/**
 * It will relate and/or unrelate a role and a set of permissions
 * @param {number} id the id of the role
 * @param {Array<number>} permissionIds the ids of the permissions
 * @returns {Promise<Role>} the updated role
 */
exports.upsertPermissions = function (id, permissionIds) {
    return Repository.tx(
        [Repository.Role.model, Repository.Permission.model],
        async (txRoleRepository, txPermissionRepository) => {
            const role = await internals.checkIfRoleExists(id, txRoleRepository);

            const getPermissionsById = permissionIds.map(permissionId =>
                txPermissionRepository.findById(permissionId)
            );

            const permissions = await Promise.all(getPermissionsById);

            APIError.assert(
                permissions.every(permission => permission),
                APIError.RESOURCE_NOT_FOUND
            );

            role.permissions = permissionIds.map(id => ({ id }));

            return txRoleRepository.query().upsertGraphAndFetch(role, {
                unrelate: true,
                relate: true,
                noDelete: true,
                noInsert: true,
                noUpdate: true
            });
        }
    );
};
