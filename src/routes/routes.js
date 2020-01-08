import UserController from '../controller/user';
import { requestValidation } from '../middleware';

const getUserList = {
    path: '/api/user',
    middleware: [],
    handler: UserController.list
};

const getUser = {
    path: '/api/user/:username',
    middleware: [],
    handler: UserController.get
};
const postUser = {
    path: '/api/user',
    middleware: [ requestValidation ],
    handler: UserController.create
};
const putUser = {
    path: '/api/user/:username',
    middleware: [ requestValidation ],
    handler: UserController.edit
};
const deleteUser = {
    path: '/api/user/:username',
    middleware: [],
    handler: UserController.deleteUser
};

export default { 
    getUserList, 
    getUser, 
    postUser, 
    putUser, 
    deleteUser 
};
