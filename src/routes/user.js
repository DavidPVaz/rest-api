/** 
 * @module UserRoutes
 * 
 * @file Defines user routes configuration objects.
 */
import userController from '../controller/user';
import { numberValidation, fieldsValidation, requiredFieldsValidation } from '../../utils/validation';

const list = {
    handler: userController.list
};

const get = {
    validate: {
        params: numberValidation()
    },
    handler: userController.get
};

const create = {
    validate: {
        payload: requiredFieldsValidation()
    },
    handler: userController.create
};

const edit = {
    validate: {
        params: numberValidation(),
        payload: fieldsValidation()
    },
    handler: userController.edit
};

const remove = {
    validate: {
        params: numberValidation()
    },
    handler: userController.remove
};

export default {
    list, 
    get, 
    create, 
    edit, 
    remove 
};
