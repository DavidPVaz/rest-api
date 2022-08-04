/**
 * @module PermissionService
 */
const Repository = require('plugins/repository');
const APIError = require('errors/api-error');
const { Actions } = require('enums');

const internals = {};
/**
 * Checks if the provided `action` + `resourceId` already exist.
 * @async
 * @param {Object} permission - Permission data to verify.
 * @param {Object} txModel - model binded to a transaction
 * @throw Will throw an Error if any match is found in the database.
 */
internals.checkForEqualValues = async function ({ id, action, resourceId }, txModel) {
    const result =
        action && resourceId
            ? await txModel.query().skipUndefined().where({ action, resourceId }).whereNot({ id })
            : [];

    APIError.assert(result.length === 0, APIError.RESOURCE_DUPLICATE);
};

/**
 * Checks if the provided `id` refers to an existing permission.
 * @async
 * @param {number} id - Id number to verify.
 * @param {Object} txModel - model binded to a transaction
 * @throw Will throw an Error if a permission with the provided `id` is not found in the database.
 */
internals.checkIfPermissionExists = async function (id, txModel) {
    const permission = await txModel.findById(id);
    APIError.assert(permission, APIError.RESOURCE_NOT_FOUND);

    return permission;
};

/**
 * Counts the number of permissions
 * @returns {Promise<number>} the number of permissions
 */
exports.count = async function () {
    return (await Repository.Permission.count()).count;
};

/**
 * List permissions from the database.
 * @return {Promise<Permission[]>} An array with all the permissions.
 */
exports.list = function () {
    return Repository.Permission.findAll().omit('resourceId');
};

/**
 * Get a single permission from the database.
 * @param {number} id - permission id
 * @return {Promise<Permission>} The queried permission.
 */
exports.findById = function (id) {
    return Repository.Permission.findById(id).omit('resourceId');
};

/**
 * Get a single permission from the database.
 * @param {Object} value - the value to query for.
 * @return {Promise<Permission>} The queried permission.
 */
exports.findOne = function (value) {
    return Repository.Permission.findOne(value).omit('resourceId');
};

/**
 * Creates a new permission in the database.
 * @param {Object} permission - permission data to persist.
 * @return {Promise<Permission>} The created permission.
 */
exports.create = function (permission) {
    return Repository.tx(
        [Repository.Permission.model, Repository.Resource.model],
        async (txPermission, txResource) => {
            const { action, description, resource } = permission;

            APIError.assert(
                Object.values(Actions).includes(action),
                APIError.RESOURCE_NOT_FOUND('Invalid action')
            );

            const fetchedResource = await txResource.findOne({ name: resource });
            APIError.assert(fetchedResource, APIError.RESOURCE_NOT_FOUND('Invalid resource'));

            await internals.checkForEqualValues(
                { action, resourceId: fetchedResource.id },
                txPermission
            );

            return txPermission.add({ action, resourceId: fetchedResource.id, description });
        }
    );
};

/**
 * Removes an existing permission from the database.
 * @param {number} id - Id number of the permission.
 * @return {Promise<number>} The number of deleted rows.
 */
exports.remove = function (id) {
    return Repository.tx(Repository.Permission.model, async txPermission => {
        const permission = await internals.checkIfPermissionExists(id, txPermission);

        // can't remove if there is still a role that uses this permission
        const rolesCount = await permission.$relatedQuery('roles').resultSize();
        APIError.assert(Number.parseInt(rolesCount) === 0, APIError.RESOURCE_RELATION);

        return txPermission.remove(id);
    });
};
