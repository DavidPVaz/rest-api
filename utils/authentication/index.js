import jsonWebToken from 'jsonwebtoken';
import { secret } from '../../config';

function sign(username) {
    return jsonWebToken.sign({ username }, secret, { expiresIn: '30m' });
}

function compare(token) {
    return jsonWebToken.verify(token, secret);
}

export { sign, compare };
