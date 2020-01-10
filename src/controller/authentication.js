import authenticationService from '../service/authentication';

async function login({ body }, response) {

    const { username, password } = body;

    try {
        const token = await authenticationService.authenticate(username, password);
        return response.status(200).append('authentication-jwt', token).end();
        
    } catch (error) {
        return response.status(401).send(error.message);
    }
}

export default {
    login
};
