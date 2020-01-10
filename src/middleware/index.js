import { loginFieldsValidation, requiredFieldsValidation, fieldsValidation } from '../../utils/validation';
import { generateHash } from '../../utils/hash';
import { compare } from '../../utils/authentication';

function loginParametersValidation(request, response, next) {

    const { error } = loginFieldsValidation(request);

    if (error) {
        return response.status(400).send(error.details[0].message);
    }

    next();
}

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

function isValidToken({ headers }, response, next) {

    const token = headers['authentication-jwt'];

    if (!token) {
        return response.status(401).send('No authentication token provided.');
    }

    try {
        compare(token);
        next();
    } catch (error) {
        return response.status(401).send(error.message);
    }

}

export { loginParametersValidation, requestValidation, hashPassword, isValidToken };
