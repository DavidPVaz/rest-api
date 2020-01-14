import { transaction } from 'objection';
import { UserDao } from '../dao/user';

async function list() {

    let list;

    try {
        list = await UserDao.list();
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
        user = await UserDao.findBy(field, value);
    } catch (error) {
        console.error(error.message);
    }

    if (!user) {
        throw Error(`User ${value} was not found`);
    }

    return user;
}

function create(user) {

    return transaction(UserDao.getModel(), async txUser => {

        const { username, email } = user;

        let existsWithUsername;
        let existsWithEmail;

        try {
            existsWithUsername = await UserDao.findBy('username', username);
            existsWithEmail = await UserDao.findBy('email', email);
        } catch (error) {
            console.error(error.message);
        }

        if (existsWithUsername) {
            throw Error('That username already exists.');
        }

        if (existsWithEmail) {
            throw Error('That email already exists.');
        }

        return UserDao.create(txUser, user);
    });

}

function edit(id, updatedUser) {

    return transaction(UserDao.getModel(), async txUser => {

        let user;

        try {
            user = await UserDao.findById(id);
        } catch (error) {
            console.error(error.message);
        }

        if (!user) {
            throw Error(`User ${id} was not found`);
        }

        return UserDao.edit(txUser, id, updatedUser);
    });
}

function deleteUser(id) {

    return transaction(UserDao.getModel(), async txUser => {

        let user;

        try {
            user = await UserDao.findById(id);
        } catch (error) {
            console.error(error.message);
        }

        if (!user) {
            throw Error(`User ${id} was not found`);
        }

        return UserDao.delete(txUser, id);
    });
}

export default {
    list,
    get,
    create,
    edit,
    deleteUser
};
