/**
 * @module PermissionRoutes
 * @file Defines perrmission routes configuration objects.
 */
const validator = require('modules/authorization/validators/permission');
const PermissionController = require('modules/authorization/controllers/permission');
const AuthorizationController = require('modules/authorization/controllers/authorization');
const { Actions, Resources } = require('enums');

const validationDescription = {
    id: ['id', 'The id of the permission']
};

// GET /permission
exports.list = {
    description: 'List all permissions',
    pre: [AuthorizationController.authorize(Resources.PERMISSION, Actions.READ)],
    handler: PermissionController.list
};

// GET /permission/{id}
exports.get = {
    description: 'Get a specific permission by id',
    pre: [AuthorizationController.authorize(Resources.PERMISSION, Actions.READ)],
    handler: PermissionController.get,
    validate: {
        params: validator.validateSingleId(...validationDescription.id)
    }
};

// POST /permission
exports.create = {
    description: 'Create a new permission',
    pre: [AuthorizationController.authorize(Resources.PERMISSION, Actions.CREATE)],
    handler: PermissionController.create,
    validate: {
        payload: validator.validatePermissionCreation()
    }
};

// DELETE /permission/{id}
exports.remove = {
    description: 'Removes an existing permission',
    pre: [AuthorizationController.authorize(Resources.PERMISSION, Actions.DELETE)],
    handler: PermissionController.remove,
    validate: {
        params: validator.validateSingleId(...validationDescription.id)
    }
};
