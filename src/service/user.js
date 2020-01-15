import { transaction } from 'objection';
import userDao from '../dao/user';

async function checkForExistingValues(user) {

    const { username, email } = user;

    let existsWithUsername;
    let existsWithEmail;

    try {
        existsWithUsername = await userDao.findBy('username', username);
        existsWithEmail = await userDao.findBy('email', email);
    } catch (error) {
        console.error(error.message);
    }

    if (existsWithUsername) {
        throw Error('That username already exists.');
    }

    if (existsWithEmail) {
        throw Error('That email already exists.');
    } 
}

async function checkIfUserExists(id) {

    let user;

    try {
        user = await userDao.findById(id);
    } catch (error) {
        console.error(error.message);
    }

    if (!user) {
        throw Error(`User ${id} was not found`);
    }
}

async function list() {

    let list;

    try {
        list = await userDao.list();
    } catch (error) {
        console.error(error.message);
    }

    if (list.length === 0) {
        throw Error('No users to list.');
    }

    return list;
}

async function get(field, value) {

    let user;

    try {
        user = await userDao.findBy(field, value);
    } catch (error) {
        console.error(error.message);
    }

    if (!user) {
        throw Error(`User ${value} was not found`);
    }

    return user;
}

function create(user) {
    return transaction(userDao.getModel(), async txUser => {
        await checkForExistingValues(user);
        return userDao.create(txUser, user);
    });
}

function edit(id, updatedUser) {
    return transaction(userDao.getModel(), async txUser => {
        await checkIfUserExists(id);
        await checkForExistingValues(updatedUser);
        return userDao.edit(txUser, id, updatedUser);
    });
}

function deleteUser(id) {
    return transaction(userDao.getModel(), async txUser => {
        await checkIfUserExists(id);
        return userDao.delete(txUser, id);
    });
}

export default {
    list,
    get,
    create,
    edit,
    deleteUser
};
