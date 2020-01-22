import authenticationController from '../controller/authentication';
import { loginValidation } from '../../utils/validation';

const login = {
    auth: false,
    validate: {
        payload: loginValidation()
    },
    handler: authenticationController.login
};

export default {
    login
};
