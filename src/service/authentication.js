import userService from './user';
import { validatePassword } from '../../utils/hash';
import { sign } from '../../utils/authentication';

async function authenticate(username, password) {

    let user;

    try {
        user = userService.get(username);

        const isValid = await validatePassword(password, user.getPassword());
        
        if (!isValid) {
            throw Error();
        }
        
    } catch (error) {
        throw Error('Invalid credentials.');
    }

    return sign(user.getUsername());
}

export default { 
    authenticate 
};
