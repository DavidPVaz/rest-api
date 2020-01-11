import userService from './user';
import { validatePassword } from '../../utils/hash';
import { sign } from '../../utils/authentication';

async function authenticate(username, password) {

    const user = userService.get(username);
    const validationResult = await validatePassword(password, user.getPassword());

    if (!user || !validationResult) {
        throw Error('Invalid credentials.');
    }

    return sign(user.getUsername());
}

export default { 
    authenticate 
};
