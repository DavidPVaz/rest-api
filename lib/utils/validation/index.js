/**
 * @module Validation-Util
 */
const Joi = require('joi');
/**
 * Defines a schema with required fields and its constraints.
 *
 * @return {Object} A schema to be used by Hapi.
 */
exports.requiredFieldsValidation = () =>
    Joi.object({
        username: Joi.string().min(3).max(20).required(),
        email: Joi.string().max(30).email().required(),
        password: Joi.string()
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[.,!@#$%^&*])(?=.{8,})/)
            .required()
    });
/**
 * Defines a schema with optional fields and its constraints.
 *
 * @return {Object} A schema to be used by Hapi.
 */
exports.fieldsValidation = () =>
    Joi.object({
        username: Joi.string().min(3).max(20),
        email: Joi.string().max(30).email()
    });

/**
 * Defines a schema with required fields.
 *
 * @return {Object} A schema to be used by Hapi.
 */
exports.loginValidation = () =>
    Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    });

/**
 * Defines a schema with required number.
 *
 * @return {Object} A schema to be used by Hapi.
 */
exports.numberValidation = () =>
    Joi.object({
        id: Joi.number().integer().positive().required()
    });
