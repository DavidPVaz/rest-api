import userService from './user';
import { validatePassword } from '../../utils/hash';
import { sign } from '../../utils/authentication';

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

export default { 
    authenticate 
};
