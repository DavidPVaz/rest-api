import UserService from '../service/user';

function list(request, response) {
    return response.status(200).send(UserService.list());
}

function get(request, response) {

    const username = request.params.username;

    try {
        const user = UserService.get(username);
        return response.status(200).send(user);

    } catch (error) {
        return response.status(404).send(error.message);
    }
}

function create(request, response) {
    UserService.create(request.body);
    return response.status(201).send(request.body);
}

export default {
    list,
    get,
    create
}