/**
 * @module UserRoutes
 * @file Defines user routes configuration objects.
 */
const {
    numberValidation,
    fieldsValidation,
    requiredFieldsValidation
} = require('utils/validation');
const UserController = require('modules/authorization/controller/user');

exports.list = {
    handler: UserController.list
};

exports.get = {
    validate: {
        params: numberValidation()
    },
    handler: UserController.get
};

exports.create = {
    validate: {
        payload: requiredFieldsValidation()
    },
    handler: UserController.create
};

exports.edit = {
    validate: {
        params: numberValidation(),
        payload: fieldsValidation()
    },
    handler: UserController.edit
};

exports.remove = {
    validate: {
        params: numberValidation()
    },
    handler: UserController.remove
};
