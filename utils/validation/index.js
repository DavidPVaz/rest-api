/** 
 * @module Validation-Util
 */
import Joi from '@hapi/joi';
/**
 * Defines a schema with required fields and its constraints.
 * 
 * @return {Object} A schema to be used by Hapi.
 */
function requiredFieldsValidation() {

    return Joi.object({
        username: Joi.string().alphanum().min(3).max(20).required(),
        email: Joi.string().max(30).email().required(),
        password: Joi.string()
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[.,!@#$%^&*])(?=.{8,})/)
            .required()
            .error(() => {
                const error = Error();
                error.details = [ { message: 'Password field is required and must have a minimum of 8 characters and contain'
                + ' at least: one lowercase letter, one uppercase letter, one number and one special character(.,!@#$%^&*)' } ];
                return error;
            }),
        admin: Joi.boolean()
    });
}
/**
 * Defines a schema with optional fields and its constraints.
 *
 * @return {Object} A schema to be used by Hapi.
 */
function fieldsValidation() {

    return Joi.object({
        username: Joi.string().alphanum().min(3).max(20),
        email: Joi.string().max(30).email(),
        admin: Joi.boolean()
    });
}
/** 
 * Defines a schema with required fields.
 *
 * @return {Object} A schema to be used by Hapi.
 */
function loginValidation() {

    return Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    });
}
/** 
 * Defines a schema with required number.
 *
 * @return {Object} A schema to be used by Hapi.
 */
function numberValidation() {

    return Joi.object({
        id: Joi.number().required()
    });
}

export { requiredFieldsValidation, fieldsValidation, loginValidation, numberValidation };
