/**
 * @module UserRoutes
 * @file Defines user routes configuration objects.
 */
const validator = require('modules/authorization/validators/user');
const UserController = require('modules/authorization/controllers/user');
const AuthorizationController = require('modules/authorization/controllers/authorization');
const { Actions, Resources } = require('enums');

const validationDescription = {
    id: ['id', 'The id of the user']
};

// GET /user
exports.list = {
    description: 'List all users',
    pre: [AuthorizationController.authorize(Resources.USER, Actions.LIST)],
    handler: UserController.list
};

// GET /user/{id}
exports.get = {
    description: 'Get a specific user',
    pre: [AuthorizationController.authorize(Resources.USER, Actions.READ)],
    handler: UserController.get,
    validate: {
        params: validator.validateSingleId(...validationDescription.id)
    }
};

// POST /user
exports.create = {
    description: 'Create a new user',
    pre: [AuthorizationController.authorize(Resources.USER, Actions.CREATE)],
    handler: UserController.create,
    validate: {
        payload: validator.validateUserCreation()
    }
};

// PUT /user/{id}
exports.edit = {
    description: 'Update an existing user',
    pre: [AuthorizationController.authorize(Resources.USER, Actions.UPDATE)],
    handler: UserController.update,
    validate: {
        params: validator.validateSingleId(...validationDescription.id),
        payload: validator.validateUserUpdate()
    }
};

// DELETE /user/{id}
exports.remove = {
    description: 'Removes an existing user',
    pre: [AuthorizationController.authorize(Resources.USER, Actions.DELETE)],
    handler: UserController.remove,
    validate: {
        params: validator.validateSingleId(...validationDescription.id)
    }
};
