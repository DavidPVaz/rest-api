import userDao from '../dao/user';

function list() {

    const list = userDao.listUsers();

    if (list.length === 0) {
        throw Error('No users to list.');
    }

    return list;
}

function get(username) {

    const user = userDao.getUser(username);

    if (!user) {
        throw Error(`Username ${username} was not found`);
    }

    return user;
}

function create({ username, email, password }) {

    const user = userDao.getUser(username);

    if (user) {
        throw Error('That username already exists.');
    }

    userDao.createUser(username, email, password);
}

function edit(username, updatedUser) {

    const user = userDao.getUser(username);

    if (!user) {
        throw Error(`Username ${username} was not found`);
    }

    userDao.editUser(username, updatedUser);
}

function deleteUser(username) {

    const user = userDao.getUser(username);

    if (!user) {
        throw Error(`Username ${username} was not found`);
    }

    userDao.deleteUser(username);
}

export default {
    list,
    get,
    create,
    edit,
    deleteUser
};
