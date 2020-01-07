import UserDao from '../dao/user';

function list() {
    return UserDao.listUsers();
}

function create({ username, email, password }) {
    UserDao.createUser(username, email, password);
}

function edit(username, updatedUser) {
    const user = UserDao.getUser(username);

    if (!user) {
        throw Error(`User with username ${username} was not found`);
    }

    UserDao.editUser(username, updatedUser);
}

function get(username) {
    const user = UserDao.getUser(username);

    if (!user) {
        throw Error(`User with username ${username} was not found`);
    }

    return user;
}

function deleteUser(username) {
    const user = UserDao.getUser(username);

    if (!user) {
        throw Error(`User with username ${username} was not found`);
    }

    UserDao.deleteUser(username);
}

export default {
    list,
    create,
    edit,
    get,
    deleteUser
}