import jsonWebToken from 'jsonwebtoken';
import { secret } from '../../config';

function sign(id, username, admin) {
    return jsonWebToken.sign({ id, username, admin }, secret, { expiresIn: '30m' });
}

function compare(token) {
    return jsonWebToken.verify(token, secret);
}

export { sign, compare };
