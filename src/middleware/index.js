import { requiredFieldsValidation, fieldsValidation } from '../../utils/validation';

function requestValidation(request, response, next) {

    const { error } = request.method === 'POST' ? requiredFieldsValidation(request) : fieldsValidation(request);

    if (error) {
        return response.status(400).send(error.details[0].message);
    }

    next();
}

export { requestValidation };
