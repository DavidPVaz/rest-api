import endpoints from '../routes';

function register(server) {
    server.route(endpoints);
}

export default {
    name: 'enpoints',
    register
};
