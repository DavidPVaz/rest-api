/**  
 * @module AuthenticationController 
 */
import Boom from '@hapi/boom';
import authenticationService from '../authorization/service/authentication';
/**
 * API handler for user `login`.
 *
 * @param {Object} request         - Request object.
 * @param {Object} request.payload - Payload property of the request, renamed to user.
 * @param {Object} h               - Response toolkit.
 * 
 * @return {*} A HTTPS `response` to the client with a `200` status code and a valid token in the headers, or a `401` 
 * with the error message.
 */
async function login({ payload: user }, h) {

    const { username, password } = user;

    try {
        const token = await authenticationService.authenticate(username, password);
        return h.response().header('Server-Authorization', token);
        
    } catch (error) {
        return Boom.unauthorized(error.message);
    }
}

export default {
    login
};
