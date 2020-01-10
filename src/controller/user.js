import userService from '../service/user';

function list(request, response) {

    try {
        const list = userService.list();
        return response.status(200).send(list);
        
    } catch (error) {
        return response.status(204).send(error.message);
    }
}

function get({ params }, response) {

    const { username } = params;

    try {
        const user = userService.get(username);
        return response.status(200).send(user);

    } catch (error) {
        return response.status(404).send(error.message);
    }
}

function create({ body: user }, response) {

    try {
        userService.create(user);
        return response.status(201).end();
        
    } catch (error) {
        return response.status(400).send(error.message);
    }
}

function edit({ params, body: user }, response) {

    const { username } = params;

    try {
        userService.edit(username, user);
        return response.status(204).end();
        
    } catch (error) {
        return response.status(404).send(error.message);
    }
}

function deleteUser({ params }, response) {

    const { username } = params;

    try {
        userService.deleteUser(username);
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
