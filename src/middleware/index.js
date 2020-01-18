import { loginValidation, requiredFieldsValidation, fieldsValidation } from '../../utils/validation';
import { generateHash } from '../../utils/hash';
import { compare } from '../../utils/authentication';
/**
 * Middleware to validate if the client request contains the necessary login credentials
 *
 * @param {Object} request - Request object
 * @param {Object} response - Response object
 * @param {Function} next - A reference to the next middleware function
 * @returns {*} A HTTPS response to the client with a 400 status code and the error message 
 * if the request is not properly formatted
 */
function loginCredentialsValidation(request, response, next) {

    const { error } = loginValidation(request);

    if (error) {
        return response.status(400).send(error.details[0].message);
    }

    next();
}
/**
 * Middleware to validate if the client request contains the required fields and comply with the API rules
 *
 * @param {Object} request - Request object
 * @param {Object} response - Response object
 * @param {Function} next - A reference to the next middleware function
 * @returns {*} A HTTPS response to the client with a 400 status code and the error message 
 * if the request is not properly formatted or does not comply with the API rules
 */
function requestValidation(request, response, next) {

    const { error } = request.method === 'POST' ? requiredFieldsValidation(request) : fieldsValidation(request);

    if (error) {
        return response.status(400).send(error.details[0].message);
    }

    next();
}
/**
 * Middleware to hash the client request's plain text password
 *
 * @param {Object} request - Request object
 * @param {Object} response - Response object
 * @param {Function} next - A reference to the next middleware function
 * @return {*} A HTTPS response to the client with a 500 status code and the error message 
 * if something went wrong while hashing
 */
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
/**
 * Middleware to validate if the client is authenticated
 *
 * @param {Object} request - Request object
 * @param {Object} request.headers - Headers property of the request
 * @param {Object} response - Response object
 * @param {Function} next - A reference to the next middleware function
 * @returns {*} A HTTPS response to the client with a 401 status code and the error message 
 * if the request does not contain the required header with a valid token
 */
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
/**
 * Middleware to validate if the client has authorization
 *
 * @param {Object} request - Request object
 * @param {Object} request.headers - Headers property of the request
 * @param {Object} response - Response object
 * @param {Function} next - A reference to the next middleware function
 * @returns {*} A HTTPS response to the client with a 403 status code and the error message 
 * if the client does not have enough permissions
 */
function hasAuthorization({ headers }, response, next) {

    const decoded = compare(headers['authentication-jwt']);

    if (!decoded.admin) {
        return response.status(403).send('Not enough permissions.');
    }

    next();
}
/** 
 * @module Middleware 
 */
export { loginCredentialsValidation, requestValidation, hashPassword, isValidToken, hasAuthorization };
