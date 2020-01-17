import { transaction } from 'objection';
import userDao from '../dao/user';
/**
 * Check if already exist any user with provided username or password
 * 
 * @param {Object} user - Object received in the request body
 * @throws Will throw an error if any match is found in database
 */
async function checkForExistingValues(user) {

    const { username, email } = user;

    let existsWithUsername;
    let existsWithEmail;

    try {
        existsWithUsername = await userDao.findBy('username', username);
        existsWithEmail = await userDao.findBy('email', email);
    } catch (error) {
        console.error(error.message);
    }

    if (existsWithUsername) {
        throw Error('That username already exists.');
    }

    if (existsWithEmail) {
        throw Error('That email already exists.');
    } 
}
/**
 * Check if a user with a given id really exists
 *
 * @param {number} id - Number received in request parameters
 * @throws Will throw an error if an user with provided id is not found in database
 */
async function checkIfUserExists(id) {

    let user;

    try {
        user = await userDao.findById(id);
    } catch (error) {
        console.error(error.message);
    }

    if (!user) {
        throw Error(`User ${id} was not found`);
    }
}
/**
 * Fetch all users from the database
 *
 * @returns {Object[]} An array with all the users
 * @throws Will throw an error if there are no users in the database
 */
async function list() {

    let list;

    try {
        list = await userDao.list();
    } catch (error) {
        console.error(error.message);
    }

    if (list.length === 0) {
        throw Error('No users to list.');
    }

    return list;
}
/**
 * Fetch a single user from the database
 *
 * @param {string} field - The column name in database
 * @param {(number|string)} value - Value associated with that column. It can be a number if fetching by id, 
 * or a string, if fetching by username or email 
 * @returns {Object} A user object
 * @throws Will throw an error if there is no user to match the given value
 */
async function get(field, value) {

    let user;

    try {
        user = await userDao.findBy(field, value);
    } catch (error) {
        console.error(error.message);
    }

    if (!user) {
        throw Error(`User ${value} was not found`);
    }

    return user;
}
/**
 * Create a new user in the database
 *
 * @param {Object} user - Object received in the request body
 * @returns {Promise<Object>} A Promise
 * @throws Will throw an error if the provided username or email properties of the user object already exists in the database 
 */
function create(user) {
    return transaction(userDao.getModel(), async txUser => {
        await checkForExistingValues(user);
        return userDao.create(txUser, user);
    });
}
/**
 * Edit an existing user in the database
 *
 * @param {number} id - Number received in request parameters 
 * @param {Object} updatedUser - Object received in the request body
 * @returns {Promise<Object>} A Promise
 * @throws Will throw an error if an user with the provided id is not found in database, or the provided username or email 
 * properties of the user object already exist in the database
 */
function edit(id, updatedUser) {
    return transaction(userDao.getModel(), async txUser => {
        await checkIfUserExists(id);
        await checkForExistingValues(updatedUser);
        return userDao.edit(txUser, id, updatedUser);
    });
}
/**
 * Deletes an existing user from the database
 *
 * @param {number} id - Number received in request parameters
 * @returns {Promise<Object>} A promise
 * @throws Will throw an error if an user with the provided id is not found in database
 */
function deleteUser(id) {
    return transaction(userDao.getModel(), async txUser => {
        await checkIfUserExists(id);
        return userDao.delete(txUser, id);
    });
}

/**  
* @module UserService 
*/
export default {
    list,
    get,
    create,
    edit,
    deleteUser
};
