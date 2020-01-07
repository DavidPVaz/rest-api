import UserDao from '../dao/user';

function list() {
    return UserDao.listUsers();
}

function create() {
    UserDao.createUser()
}