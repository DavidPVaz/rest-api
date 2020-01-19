import authenticationService from '../service/authentication';
/**
 * API handler for user login.
 *
 * @param {Object} request      - Request object.
 * @param {Object} request.body - Body property of the request, renamed to user.
 * @param {Object} response     - Response object.
 * 
 * @return {*} A HTTPS response to the client with a 200 status code with a valid token in headers, or a 401 
 * with the error message.
 */
async function login({ body: user }, response) {

    const { username, password } = user;

    try {
        const token = await authenticationService.authenticate(username, password);
        return response.status(200).append('authentication-jwt', token).send('Login successful.');
        
    } catch (error) {
        return response.status(401).send(error.message);
    }
}
/**  
 * @module AuthenticationController 
 */
export default {
    login
};
