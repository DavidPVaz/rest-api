import userService from './user';
import { validatePassword } from '../../utils/hash';
import { sign } from '../../utils/authentication';
/**
 * Authenticate an existing user
 *
 * @param {string} username - Username to validate
 * @param {string} password - Password to validate
 * @returns {string} An authentication token (JWT)
 * @throws Will throw an error if any of the passed arguments are not valid
 */
async function authenticate(username, password) {

    let user;

    try {
        user = await userService.get('username', username);

        const isValid = await validatePassword(password, user.password);
        
        if (!isValid) {
            throw Error();
        }
        
    } catch (error) {
        throw Error('Invalid credentials.');
    }

    return sign(user.id, user.username, user.admin);
}
/** 
 * @module AuthenticationService 
 */
export default { 
    authenticate 
};
