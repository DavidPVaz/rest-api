/**
 * @module AuthorizationService
 */
const UserService = require('modules/authorization/services/user');
const RoleService = require('modules/authorization/services/role');
const ResourceService = require('modules/authorization/services/resource');
const APIError = require('errors/api-error');

/**
 * Gets if a role has the required authorization to perform a specific action on a given resource
 * @async
 * @param {string} roleName the role name
 * @param {string} action the action
 * @param {string} resourceName the resource name
 * @returns {boolean} true if authorized
 */
exports.canRole = async function (roleName, action, resourceName) {
    const [role, resource] = await Promise.all([
        RoleService.findOne({ name: roleName }),
        ResourceService.findOne({ name: resourceName })
    ]);

    APIError.assert(role && resource, APIError.RESOURCE_NOT_FOUND);

    // look for permission with provided action pointing to specified resource
    const permissions = await role
        .$relatedQuery('permissions')
        .withGraphFetched('resource')
        .where({ action })
        .andWhere({ resourceId: resource.id });

    return permissions.length > 0;
};

/**
 * Gets if a user has the required authorization to perform a specific action on a given resource
 * @async
 * @param {any} username the username
 * @param {any} action the action
 * @param {any} resourceName the resource name
 * @returns {boolean} true if authorized
 */
exports.canUser = async function (username, action, resourceName) {
    const user = await UserService.findOne({ username }, { withRoles: true });

    // an inactive user cannot perform actions on resources
    if (!user || !user.active) {
        return false;
    }

    return (
        await Promise.all(user.roles.map(role => exports.canRole(role.name, action, resourceName)))
    ).some(result => result);
};
