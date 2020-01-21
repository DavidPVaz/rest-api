/** 
 * @module AuthenticationService 
 */
import userService from './user';
import { validatePassword } from '../../utils/hash';
import { sign } from '../../utils/authentication';
/**
 * Authenticates an existing user.
 *
 * @param {string} username - Username to validate.
 * @param {string} password - Password to validate.
 * 
 * @return {string} An authentication token (JWT).
 * 
 * @throw Will throw an Error if any of the passed arguments is not valid.
 */
async function authenticate(username, password) {

    let user;

    try {
        user = await userService.get('username', username);

        const isValid = await validatePassword(password, user.password);
        
        if (!isValid) {
            throw Error();
        }
        
        return sign(user.id, user.username, user.admin);
        
    } catch (error) {
        throw Error('Invalid credentials.');
    }

}

export default { 
    authenticate 
};
