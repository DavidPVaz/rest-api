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
        return next();
    }

    try {
        request.body.password = await generateHash(password);
    } catch (error) {
        return response.status(500).send(error.message);
    }

    next();
}

function isValidToken({ headers }, response, next) {

    const token = headers['authentication-jwt'];

    if (!token) {
        return response.status(401).send('No authentication token provided. Login first at: /api/login');
    }

    try {
        compare(token);
    } catch (error) {
        return response.status(401).send(error.message);
    }

    next();
}

export { loginParametersValidation, requestValidation, hashPassword, isValidToken };
