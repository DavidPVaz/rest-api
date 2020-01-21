/** 
 * @module UserController 
 */
import userService from '../service/user';
import mailer from '../../utils/mail';
/**
 * API handler to `fetch` the list of users.
 *
 * @param {Object} request  - Request object.
 * @param {Object} response - Response object.
 * 
 * @return {*} A HTTPS `response` to the client with a `200` status code and the list of users, or a `404` 
 * with the error message.
 */
async function list(request, response) {

    try {
        const list = await userService.list();
        return response.status(200).send(list);
        
    } catch (error) {
        return response.status(404).send(error.message);
    }
}
/**
 * API handler to `fetch` a single user.
 * 
 * @param {Object} request        - Request object.
 * @param {Object} request.params - Params property of the request.
 * @param {Object} response       - Response object.
 * 
 * @return {*} A HTTPS `response` to the client with a `200` status code and the user, or a `404` 
 * with the error message.
 */
async function get({ params }, response) {

    const { id } = params;

    try {
        const user = await userService.get('id', id);
        return response.status(200).send(user);

    } catch (error) {
        return response.status(404).send(error.message);
    }
}
/**
 * API handler to `create` an user.
 * 
 * @param {Object} request      - Request object.
 * @param {Object} request.body - Body property of the request, renamed to user.
 * @param {Object} response     - Response object.
 * 
 * @return {*} A HTTPS `response` to the client with a `201` status code and the `path` to the new resource, 
 * or a `400` with the error message.
 */
async function create({ body: user }, response) {

    try {
        const { id, username } = await userService.create(user);
        mailer.reportUserCreated({ username, email: process.env.SMTP_FAKE_MAIL }); // fake email for testing purposes. 
        return response.status(201).send(`Resource created at: /api/user/${id}`);
        
    } catch (error) {
        return response.status(400).send(error.message);
    }
}
/**
 * API handler to `update` an user.
 * 
 * @param {Object} request        - Request object.
 * @param {Object} request.params - Params property of the request.
 * @param {Object} request.body   - Body property of the request, renamed to user.
 * @param {Object} response       - Response object.
 * 
 * @return {*} A HTTPS `response` to the client with a `204` status code, or a `400` / `404` with the error message, 
 * depending on the failure cause.
 */
async function edit({ params, body: user }, response) {

    const { id } = params;

    try {
        await userService.edit(id, user);
        return response.status(204).end();
        
    } catch (error) {
        return error.message.startsWith('User') 
            ? response.status(404).send(error.message) 
            : response.status(400).send(error.message);
    }
}
/**
 * API handler to `delete` an user.
 * 
 * @param {Object} request        - Request object.
 * @param {Object} request.params - Params property of the request.
 * @param {Object} response       - Response object.
 * 
 * @return {*} A HTTPS `response` to the client with a `204` status code, or a `404` with the error message.
 */
async function deleteUser({ params }, response) {

    const { id } = params;

    try {
        await userService.deleteUser(id);
        return response.status(204).end();

    } catch (error) {
        return response.status(404).send(error.message);
    }
}

export default {
    list,
    get,
    create,
    edit,
    deleteUser
};
