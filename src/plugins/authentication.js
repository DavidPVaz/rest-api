import HapiJWT from 'hapi-auth-jwt2';
import userService from '../service/user';
import Config from '../../config';

async function validate(decoded) {
    try {
        await userService.get('id', decoded.id);
        return { isValid: true };
    } catch (error) {
        return { isValid: false };
    }
}

async function register(server) {
    await server.register(HapiJWT);

    const key = Buffer.from(Config.secret, 'base64');
    const name = 'superAuthStrategy';

    server.auth.strategy(name, 'jwt', {
        key,
        validate,
        verifyOptions: { algorithms: [ 'HS256' ] }
    });

    server.auth.default(name);
}

export default {
    name: 'authentication',
    register
};
