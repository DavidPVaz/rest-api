import UserDao from '../dao/user';

function list() {

    const list = UserDao.listUsers();

    if (list.length === 0) {
        throw Error('No users to list.');
    }

    return list;
}

function get(username) {

    const user = UserDao.getUser(username);

    if (!user) {
        throw Error(`Username ${username} was not found`);
    }

    return user;
}

function create({ username, email, password }) {
    UserDao.createUser(username, email, password);
}

function edit(username, updatedUser) {

    const user = UserDao.getUser(username);

    if (!user) {
        throw Error(`Username ${username} was not found`);
    }

    UserDao.editUser(username, updatedUser);
}

function deleteUser(username) {

    const user = UserDao.getUser(username);

    if (!user) {
        throw Error(`Username ${username} was not found`);
    }

    UserDao.deleteUser(username);
}

export default {
    list,
    get,
    create,
    edit,
    deleteUser
};
