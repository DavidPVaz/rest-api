import Joi from '@hapi/joi';

function requiredFieldsValidation({ body }) {

    const schema = Joi.object({
        username: Joi.string().alphanum().min(3).max(20).required(),
        email: Joi.string().max(30).email().required(),
        password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[.,!@#$%^&*])(?=.{8,})/).required().error(() => {
            const error = Error();
            error.details = [ { message: 'Password must have a minimum of 8 characters and contain at least: one lower case letter, one upper case letter, one number, one special character(.,!@#$%^&*)' } ];
            return error;
        })
    });
    
    return schema.validate(body);
}

function fieldsValidation({ body }) {

    const schema = Joi.object({
        username: Joi.string().alphanum().min(3).max(20),
        email: Joi.string().max(30).email(),
        password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[.,!@#$%^&*])(?=.{8,})/).error(() => {
            const error = Error();
            error.details = [ { message: 'Password must have a minimum of 8 characters and contain at least: one lower case letter, one upper case letter, one number, one special character(.,!@#$%^&*)' } ];
            return error;
        })
    });
    
    return schema.validate(body);
}

export { requiredFieldsValidation, fieldsValidation };
