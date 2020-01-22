/** 
 * @module UserController 
 */
import Boom from '@hapi/boom';
import userService from '../service/user';
import mailer from '../../utils/mail';
/**
 * API handler to `fetch` the list of users.
 * 
 * @return {*} A HTTPS `response` to the client with a `200` status code and the list of users, or a `404` 
 * with the error message.
 */
async function list() {

    try {
        return await userService.list();
    
    } catch (error) {
        return Boom.notFound(error.message);
    }
}
/**
 * API handler to `fetch` a single user.
 * 
 * @param {Object} request        - Request object.
 * @param {Object} request.params - Params property of the request.
 * 
 * @return {*} A HTTPS `response` to the client with a `200` status code and the user, or a `404` 
 * with the error message.
 */
async function get({ params }) {

    const { id } = params;

    try {
        return await userService.get('id', id);
        
    } catch (error) {
        return Boom.notFound(error.message);
    }
}
/**
 * API handler to `create` an user.
 * 
 * @param {Object} request         - Request object.
 * @param {Object} request.payload - Payload property of the request, renamed to user.
 * @param {Object} h               - Response toolkit.
 * 
 * @return {*} A HTTPS `response` to the client with a `201` status code and the `path` to the new resource, 
 * or a `409` with the error message.
 */
async function create({ payload: user }, h) {

    try {
        const { id, username } = await userService.create(user);
        mailer.reportUserCreated({ username, email: process.env.SMTP_FAKE_MAIL }); // fake email for testing purposes. 
        return h.response().created(`Resource created at: /api/user/${id}`);
        
    } catch (error) {
        return Boom.conflict(error.message);
    }
}
/**
 * API handler to `update` an user.
 * 
 * @param {Object} request         - Request object.
 * @param {Object} request.params  - Params property of the request.
 * @param {Object} request.payload - Payload property of the request, renamed to user.
 * @param {Object} response        - Response toolkit.
 * 
 * @return {*} A HTTPS `response` to the client with a `204` status code, or a `404` / `409` with the error message, 
 * depending on the failure cause.
 */
async function edit({ params, payload: user }, h) {

    const { id } = params;

    try {
        const transactionResult = await userService.edit(id, user);
        console.log('transaction:', transactionResult); // need to remove this console.log
        return h.response().code(204);
        
    } catch (error) {
        const boom = error.message.startsWith('User') ? Boom.notFound : Boom.conflict;
        return boom(error.message);
    }
}
/**
 * API handler to `delete` an user.
 * 
 * @param {Object} request        - Request object.
 * @param {Object} request.params - Params property of the request.
 * @param {Object} h              - Response toolkit.
 * 
 * @return {*} A HTTPS `response` to the client with a `204` status code, or a `404` with the error message.
 */
async function remove({ params }, h) {

    const { id } = params;

    try {
        await userService.remove(id);
        return h.response().code(204);

    } catch (error) {
        return Boom.notFound(error.message);
    }
}

export default {
    list,
    get,
    create,
    edit,
    remove
};
