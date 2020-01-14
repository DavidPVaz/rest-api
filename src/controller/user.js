import userService from '../service/user';

async function list(request, response) {

    try {
        const list = await userService.list();
        return response.status(200).send(list);
        
    } catch (error) {
        return response.status(204).send(error.message);
    }
}

async function get({ params }, response) {

    const { id } = params;

    try {
        const user = await userService.get('id', id);
        return response.status(200).send(user);

    } catch (error) {
        return response.status(400).send(error.message);
    }
}

async function create({ body: user }, response) {

    try {
        const { id } = await userService.create(user);
        return response.status(201).send(`Resource created at: /api/user/${id}`);
        
    } catch (error) {
        return response.status(400).send(error.message);
    }
}

async function edit({ params, body: user }, response) {

    const { id } = params;

    try {
        await userService.edit(id, user);
        return response.status(204).end();
        
    } catch (error) {
        return response.status(400).send(error.message);
    }
}

async function deleteUser({ params }, response) {

    const { id } = params;

    try {
        await userService.deleteUser(id);
        return response.status(204).end();

    } catch (error) {
        return response.status(400).send(error.message);
    }
}

export default {
    list,
    get,
    create,
    edit,
    deleteUser
};
