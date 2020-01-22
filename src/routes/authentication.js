import authenticationController from '../controller/authentication';
import { loginValidation } from '../../utils/validation';

const login = {
    auth: false,
    handler: authenticationController.login,
    validate: {
        payload: loginValidation()
    }
};

export default {
    login
};
