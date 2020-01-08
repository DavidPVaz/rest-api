import { User } from '../model/user';

let inMemoyDb = [ new User('david', 'david@gmail.com', '1234'), new User('rute', 'rute@gmail.com', '5678') ];

function listUsers() {
    return inMemoyDb;
}

function getUser(username) {
    return inMemoyDb.find(user => user.getUsername() === username);
}

function createUser(username, email, password) {
    inMemoyDb.push(new User(username, email, password));
}

function editUser(username, updatedUser) {
    
    inMemoyDb.forEach(function(user) {
        if (user.getUsername() === username) {
            Object.assign(user, updatedUser);
        }
    });
}

function deleteUser(username) {
    inMemoyDb = inMemoyDb.filter(user => user.username !== username);
}

export default {
    listUsers,
    getUser,
    createUser,
    editUser,
    deleteUser
};
