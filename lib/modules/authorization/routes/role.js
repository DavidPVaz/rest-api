/**
 * @module RoleRoutes
 * @file Defines role routes configuration objects.
 */
const validator = require('modules/authorization/validators/role');
const RoleController = require('modules/authorization/controllers/role');
const AuthorizationController = require('modules/authorization/controllers/authorization');
const { Actions, Resources } = require('enums');

const validationDescription = {
    id: ['id', 'The id of the role']
};

// GET /role
exports.list = {
    description: 'List all roles',
    pre: [AuthorizationController.authorize(Resources.ROLE, Actions.READ)],
    handler: RoleController.list
};

// GET /role/{id}
exports.get = {
    description: 'Get a specific role by id',
    pre: [AuthorizationController.authorize(Resources.ROLE, Actions.READ)],
    handler: RoleController.get,
    validate: {
        params: validator.validateSingleId(...validationDescription.id)
    }
};

// POST /role
exports.create = {
    description: 'Create a new role',
    pre: [AuthorizationController.authorize(Resources.ROLE, Actions.CREATE)],
    handler: RoleController.create,
    validate: {
        payload: validator.validateRoleCreation()
    }
};

// PUT /role/{id}
exports.update = {
    description: 'Update an existing role',
    pre: [AuthorizationController.authorize(Resources.ROLE, Actions.UPDATE)],
    handler: RoleController.update,
    validate: {
        params: validator.validateSingleId(...validationDescription.id),
        payload: validator.validateRoleUpdate()
    }
};

// PUT /role/{id}/permissions
exports.upsertPermissions = {
    description: "Upsert a role's permissions",
    pre: [AuthorizationController.authorize(Resources.ROLE, Actions.UPDATE)],
    handler: RoleController.upsertPermissions,
    validate: {
        params: validator.validateSingleId(...validationDescription.id),
        payload: validator.validatePayloadArrayOrSingleId(
            'permissions',
            'An array containing the permission ids'
        )
    }
};

// DELETE /role/{id}
exports.remove = {
    description: 'Removes an existing role',
    pre: [AuthorizationController.authorize(Resources.ROLE, Actions.DELETE)],
    handler: RoleController.remove,
    validate: {
        params: validator.validateSingleId(...validationDescription.id)
    }
};
