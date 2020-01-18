import userController from '../controller/user';
import authenticationController from '../controller/authentication';
import { 
    loginCredentialsValidation, isValidToken, requestValidation, hashPassword, hasAuthorization 
} from '../middleware';

const login = {
    path: '/api/login',
    middleware: [ loginCredentialsValidation ],
    handler: authenticationController.login
};

const getUserList = {
    path: '/api/user',
    middleware: [ isValidToken ],
    handler: userController.list
};

const getUser = {
    path: '/api/user/:id',
    middleware: [ isValidToken ],
    handler: userController.get
};
const postUser = {
    path: '/api/user',
    middleware: [ isValidToken, hasAuthorization, requestValidation, hashPassword ],
    handler: userController.create
};
const putUser = {
    path: '/api/user/:id',
    middleware: [ isValidToken, hasAuthorization, requestValidation, hashPassword ],
    handler: userController.edit
};
const deleteUser = {
    path: '/api/user/:id',
    middleware: [ isValidToken, hasAuthorization ],
    handler: userController.deleteUser
};

export default {
    login, 
    getUserList, 
    getUser, 
    postUser, 
    putUser, 
    deleteUser 
};
