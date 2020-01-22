import userController from '../controller/user';
import { numberValidation, fieldsValidation, requiredFieldsValidation } from '../../utils/validation';

const list = {
    handler: userController.list
};

const get = {
    handler: userController.get,
    validate: {
        params: numberValidation()
    }
};

const create = {
    handler: userController.create,
    validate: {
        payload: requiredFieldsValidation()
    }
};

const edit = {
    handler: userController.edit,
    validate: {
        params: numberValidation(),
        payload: fieldsValidation()
    }
};

const remove = {
    handler: userController.remove,
    validate: {
        params: numberValidation()
    }
};

export default {
    list, 
    get, 
    create, 
    edit, 
    remove 
};
