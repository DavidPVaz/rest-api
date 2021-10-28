const User = require('models/authorization/user');
const baseValidator = require('routes/validator/base');

const validator = { ...baseValidator };

validator.validateCredentials = function () {
    return this.Joi.object({
        username: this.Joi.string()
            .min(User.USERNAME_MIN_LENGTH)
            .max(User.USERNAME_MAX_LENGTH)
            .required()
            .description('The username of the user to login'),
        password: this.Joi.string()
            .min(User.PASSWORD_MIN_LENGTH)
            .max(User.PASSWORD_MAX_LENGTH)
            .required()
            .description('The password of the user')
    }).label('CredentialsSchema');
};

module.exports = validator;
