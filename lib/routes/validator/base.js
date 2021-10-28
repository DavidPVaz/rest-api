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
baseValidator.validateSingleId = (prop, description) =>
    this.Joi.object({
        [prop]: this.Joi.number()
            .integer()
            .positive()
            .max(this.Model.MAX_ID)
            .required()
            .description(description)
    }).label('SingleIdSchema');

/**
 * Validates double ids
 * @param {string} propOne - the name of the first property. example: id
 * @param {string} firstDescrip - the first property description
 * @param {string} propTwo - the name of the second property. example: qid
 * @param {string} secondDescrip - the second property description
 * @returns {Object} the compiled Joi rules
 */
baseValidator.validateDoubleId = (propOne, firstDescrip, propTwo, secondDescrip) =>
    this.Joi.object({
        [propOne]: this.Joi.number()
            .integer()
            .positive()
            .max(this.Model.MAX_ID)
            .required()
            .description(firstDescrip),
        [propTwo]: this.Joi.number()
            .integer()
            .positive()
            .max(this.Model.MAX_ID)
            .required()
            .description(secondDescrip)
    }).label('DoubleIdSchema');

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
 * Validates email
 * @param {string}  description - the property
 * @param {boolean} [required] - wether or not email is required
 * @returns {Object} the compiled Joi rules
 */
baseValidator.validateEmail = function (description, required = true) {
    const rules = this.Joi.string()
        .email()
        .max(User.EMAIL_MAX_LENGTH)
        .description(description)
        .error(new Error('Invalid email address'));

    return this.Joi.object({
        email: required ? rules.required() : rules
    }).label('EmailSchema');
};

/**
 * Returns the base rules to validate a boolean
 * @param {string} prop - the boolean property name
 * @returns {Object} the Joi rules
 */
baseValidator.validateBoolean = prop =>
    this.Joi.object({
        [prop]: this.Joi.boolean()
    }).label('BooleanSchema');

/**
 * Returns the base rules to validate password
 * @returns {Object} the Joi rules
 */
baseValidator.validateBoolean = () =>
    this.Joi.object({
        passeord: this.Joi.string()
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[.,!@#$%^&*])(?=.{8,})/)
            .required()
    }).label('PasswordSchema');

module.exports = baseValidator;
