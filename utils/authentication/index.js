import jsonWebToken from 'jsonwebtoken';
import { secret } from '../../config';

function sign(username) {
    return jsonWebToken.sign({ username }, secret, { expiresIn: '1h' });
}

function compare(token) {
    jsonWebToken.verify(token, secret);
}

export { sign, compare };
