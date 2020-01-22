/**  
 * @module AuthenticationController 
 */
import authenticationService from '../service/authentication';
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
        return h.response().header('authentication-jwt', token);
        
    } catch (error) {
        return response.status(401).send(error.message); // will return a Boom
    }
}

export default {
    login
};
