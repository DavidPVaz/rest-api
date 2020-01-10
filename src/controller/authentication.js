import authenticationService from '../service/authentication';

async function login({ body }, response) {

    const { username, password } = body;

    try {
        const token = await authenticationService.authenticate(username, password);
        return response.header('authorization-header', token);
        
    } catch (error) {
        return response.status(401).send(error.message);
    }
}

export default {
    login
};
