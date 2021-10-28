const User = require('models/authorization/user');
const baseValidator = require('routes/validator/base');

const validator = { ...baseValidator };

validator.validateUserCreation = function () {
    return this.Joi.object({
        username: this.Joi.string()
            .min(User.USERNAME_MIN_LENGTH)
            .max(User.USERNAME_MAX_LENGTH)
            .required()
            .description('The username of the user'),
        name: this.Joi.string()
            .min(User.NAME_MIN_LENGTH)
            .max(User.NAME_MAX_LENGTH)
            .required()
            .description('The name of the user'),
        email: validator.emailRules('The email of the user').required(),
        password: validator.passwordRules('The password of the user').required()
    }).label('UserCreationSchema');
};

validator.validateUserUpdate = function () {
    return this.Joi.object({
        id: this.Joi.forbidden(),
        username: this.Joi.string()
            .min(User.USERNAME_MIN_LENGTH)
            .max(User.USERNAME_MAX_LENGTH)
            .description('The username of the user'),
        name: this.Joi.string()
            .min(User.NAME_MIN_LENGTH)
            .max(User.NAME_MAX_LENGTH)
            .description('The name of the user'),
        email: validator.emailRules('The email of the user'),
        password: validator.passwordRules('The password of the user'),
        active: this.Joi.boolean().description('If the user is active'),
        roles: this.Joi.forbidden()
    }).label('UserUpdateSchema');
};

module.exports = validator;
