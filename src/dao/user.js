import { User } from "../model/user";

const inMemoyDb = [new User('david', 'david@gmail.com', '1234'), new User('rute', 'rute@gmail.com', '5678')];

function listUsers() {
    return inMemoyDb;
}

function getUser(username) {
    return inMemoyDb.find(function (user) {
        return user.getUsername() === username;
    });
}

function deleteUser(username) {
    inMemoyDb = inMemoyDb.filter(function (user) {

        if (user.getUsername() === username) {
            User.delete(user);
        }

        return user.getUsername() !== username;
    });
}

function editUser(username, updatedUser) {
    for (let user in inMemoyDb) {
        if (user.getUsername() === username) {
            Object.assign(user, updatedUser);
        }
    }
}

function createUser(username, email, password) {
    inMemoyDb.push(new User(username, email, password));
}

export default {
    listUsers,
    getUser,
    deleteUser,
    editUser,
    createUser
}