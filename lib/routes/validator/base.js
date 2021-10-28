/**
 * @module BaseValidator
 * Api Common Request Validation
 */
const Joi = require('joi');
const Model = require('models/base');
const User = require('models/authorization/user');

const baseValidator = {};

baseValidator.Joi = Joi;
baseValidator.Model = Model;

/**
 * Validates a single id
 * @param {string} prop - the name of the property. examples: id, qid
 * @param {string} description - the property description
 * @returns {Object} the compiled Joi rules
 */
baseValidator.validateSingleId = function (prop, description) {
    return this.Joi.object({
        [prop]: this.Joi.number()
            .integer()
            .positive()
            .max(this.Model.MAX_ID)
            .required()
            .description(description)
    }).label('SingleIdSchema');
};

/**
 * Validates an id or array of ids received in payload
 * @param {string} prop - the name of the property. examples: id, qid
 * @param {string} description - the property description
 * @param {boolean} [required] - wether or not items are required
 * @returns {Object} the compiled Joi rules
 */
baseValidator.validatePayloadArrayOrSingleId = function (prop, description, required = true) {
    const rules = this.Joi.number()
        .integer()
        .positive()
        .max(this.Model.MAX_ID)
        .description(description);

    return this.Joi.object({
        [prop]: this.Joi.array()
            .single()
            .items(required ? rules.required() : rules)
            .unique()
    }).label('ArrayOrSinglePayloadIdSchema');
};

/**
 * Returns the base rules to validate a boolean
 * @param {string} prop - the boolean property name
 * @param {string}  description - the property description
 * @returns {Object} the compiled Joi rules
 */
baseValidator.validateBoolean = function (prop, description) {
    return this.Joi.object({
        [prop]: this.Joi.boolean().description(description)
    }).label('BooleanSchema');
};

/**
 * Returns the base rules to validate password
 * @param {string}  description - the property description
 * @param {boolean} [required] - wether or not password is required
 * @returns {Object} the Joi rules
 */
baseValidator.passwordRules = function (description) {
    return this.Joi.string()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[.,!@#$%^&*])(?=.{8,})/)
        .description(description);
};

/**
 * Validates email
 * @param {string}  description - the property description
 * @returns {Object} the Joi rules
 */
baseValidator.emailRules = function (description) {
    return this.Joi.string()
        .email()
        .max(User.EMAIL_MAX_LENGTH)
        .description(description)
        .error(new Error('Invalid email address'));
};

module.exports = baseValidator;
