import authenticationService from '../service/authentication';

async function login({ body: user }, response) {

    const { username, password } = user;

    try {
        const token = await authenticationService.authenticate(username, password);
        return response.status(200).append('authentication-jwt', token).send('Login successful.');
        
    } catch (error) {
        return response.status(401).send(error.message);
    }
}

export default {
    login
};
