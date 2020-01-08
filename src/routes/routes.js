import UserController from '../controller/user';
import { requestValidation } from '../middleware';

const getUserList = {
    path: '/api/user',
    middleware: [],
    handler: UserController.getUserList
};

const getUser = {
    path: '/api/user/:username',
    middleware: [],
    handler: UserController.getUserList
};
const postUser = {
    path: '/api/user',
    middleware: [ requestValidation ],
    handler: UserController.getUserList
};
const putUser = {
    path: '/api/user/:username',
    middleware: [ requestValidation ],
    handler: UserController.getUserList
};
const deleteUser = {
    path: '/api/user/:username',
    middleware: [],
    handler: UserController.getUserList
};

export default { 
    getUserList, 
    getUser, 
    postUser, 
    putUser, 
    deleteUser 
};
