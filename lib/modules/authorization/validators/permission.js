const Permission = require('models/authorization/permission');
const Resource = require('models/authorization/resource');
const baseValidator = require('routes/validator/base');
const { Actions } = require('enums');

const validator = { ...baseValidator };

validator.validatePermissionCreation = function () {
    return this.Joi.object({
        action: this.Joi.string()
            .valid(...Object.values(Actions))
            .required()
            .description('The action associated with the permission'),
        resource: this.Joi.string()
            .min(Resource.NAME_MIN_LENGTH)
            .max(Resource.NAME_MAX_LENGTH)
            .required()
            .description('The resource the permission refers to'),
        description: this.Joi.string()
            .max(Permission.DESCRIPTION_MAX_LENGTH)
            .required()
            .description('The description of the permission')
    }).label('PermissionCreationSchema');
};

module.exports = validator;
