/**
 * @module UserRoutes
 * @file Defines user routes configuration objects.
 */
const validator = require('modules/authorization/validators/user');
const UserController = require('modules/authorization/controllers/user');
const AuthorizationController = require('modules/authorization/controllers/authorization');

const validationDescription = {
    id: ['id', 'The id of the user']
};

// GET /user
exports.list = {
    description: 'List all users',
    pre: [AuthorizationController.authorize()],
    handler: UserController.list
};

// GET /user/{id}
exports.get = {
    description: 'Get a specific user',
    pre: [AuthorizationController.authorize()],
    handler: UserController.get,
    validate: {
        params: validator.validateSingleId(...validationDescription.id)
    }
};

// POST /user
exports.create = {
    description: 'Create a new user',
    pre: [AuthorizationController.authorize()],
    handler: UserController.create,
    validate: {
        payload: validator.validateUserCreation()
    }
};

// PUT /user/{id}
exports.update = {
    description: 'Update an existing user',
    pre: [AuthorizationController.authorize()],
    handler: UserController.update,
    validate: {
        params: validator.validateSingleId(...validationDescription.id),
        payload: validator.validateUserUpdate()
    }
};

// DELETE /user/{id}
exports.remove = {
    description: 'Removes an existing user',
    pre: [AuthorizationController.authorize()],
    handler: UserController.remove,
    validate: {
        params: validator.validateSingleId(...validationDescription.id)
    }
};

// PUT /user/{id}/roles
exports.upsertRoles = {
    description: "Upsert a user's roles",
    pre: [AuthorizationController.authorize()],
    handler: UserController.upsertRoles,
    validate: {
        params: validator.validateSingleId(...validationDescription.id),
        payload: validator
            .validatePayloadArrayOrSingleId('roles', 'An array containing the role ids')
            .label('UpsertRolesSchema')
    }
};
