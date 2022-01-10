const Role = require('models/authorization/role');
const baseValidator = require('routes/validator/base');

const validator = { ...baseValidator };

validator.validateRoleCreation = function () {
    return this.Joi.object({
        name: this.Joi.string()
            .min(Role.NAME_MIN_LENGTH)
            .max(Role.NAME_MAX_LENGTH)
            .required()
            .description('The name of the role'),
        description: this.Joi.string()
            .max(Role.DESC_MAX_LENGTH)
            .required()
            .description('The description of the role')
    }).label('RoleCreationSchema');
};

validator.validateRoleUpdate = function () {
    return this.Joi.object({
        name: this.Joi.string()
            .min(Role.NAME_MIN_LENGTH)
            .max(Role.NAME_MAX_LENGTH)
            .description('The name of the role'),
        description: this.Joi.string()
            .max(Role.DESC_MAX_LENGTH)
            .description('The description of the role')
    }).label('RoleUpdateSchema');
};

module.exports = validator;
