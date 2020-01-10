import { requiredFieldsValidation, fieldsValidation } from '../../utils/validation';
import { generateHash } from '../../utils/hash';

function requestValidation(request, response, next) {

    const { error } = request.method === 'POST' ? requiredFieldsValidation(request) : fieldsValidation(request);

    if (error) {
        return response.status(400).send(error.details[0].message);
    }

    next();
}

async function hashPassword(request, response, next) {

    const { password } = request.body;

    if (!password) {
        next();
    }

    request.body.password = await generateHash(password);
    next();
}

export { requestValidation, hashPassword };
