import UserService from '../service/user';

function list(request, response) {

    try {
        const list = UserService.list();
        return response.status(200).send(list);
        
    } catch (error) {
        return response.status(404).send(error.message);
    }
}

function get({ params }, response) {

    const { username } = params;

    try {
        const user = UserService.get(username);
        return response.status(200).send(user);

    } catch (error) {
        return response.status(404).send(error.message);
    }
}

function create({ body }, response) {
    UserService.create(body);
    return response.status(201).end();
}

function edit({ params, body }, response) {

    const { username } = params;

    try {
        UserService.edit(username, body);
        return response.status(204).end();
        
    } catch (error) {
        return response.status(404).send(error.message);
    }
}

function deleteUser({ params }, response) {

    const { username } = params;

    try {
        UserService.deleteUser(username);
        return response.status(204).end();

    } catch (error) {
        return response.status(404).send(error.message);
    }
}

export default {
    list,
    get,
    create,
    edit,
    deleteUser
};
