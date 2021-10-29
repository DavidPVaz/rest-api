const Lab = require('@hapi/lab');
const Hapi = require('@hapi/hapi');
const Sinon = require('sinon');
const LoginCtrl = require('modules/authorization/controllers/login');
const APIError = require('errors/api-error');
const Logger = require('test/fixtures/logger-plugin');
const UserService = require('modules/authorization/services/user');

const { beforeEach, describe, expect, it } = (exports.lab = Lab.script());

describe('Controller: login', () => {
    // created using npm run token
    const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MCwidmVyc2lvbiI6MSwiaWF0IjoxNTI5OTQ4MjgyLCJleHAiOjE1Mjk5NTE4ODIsImF1ZCI6WyJub2lyZTphdXRoIl19.9QZNHh9rn0KFMxmxu8g-3sC4_G0Ompgy28c_DgicljQ';

    let server;

    beforeEach(async () => {
        // make server quiet, 500s are rethrown and logged by default..
        server = Hapi.server({ debug: { log: false, request: false } });
        await server.register(Logger);

        server.route({
            method: 'POST',
            path: '/login',
            config: { handler: LoginCtrl.login }
        });
    });

    it('rejects login with invalid username', async flags => {
        // cleanup
        flags.onCleanup = function () {
            UserService.authenticate.restore();
        };

        // setup
        const credentials = { username: 'invalid', password: 'secret' };
        const authenticateStub = Sinon.stub(UserService, 'authenticate')
            .withArgs(credentials)
            .rejects(APIError.AUTH_INVALID_CREDENTIALS());

        // exercise
        const response = await server.inject({
            method: 'POST',
            url: '/login',
            payload: credentials
        });

        // validate
        expect(authenticateStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equal(401);
        expect(response.statusMessage).to.equal('Unauthorized');
        expect(response.result.message).to.equal(APIError.AUTH_INVALID_CREDENTIALS().message);
    });

    it('rejects login with invalid password', async flags => {
        // cleanup
        flags.onCleanup = function () {
            UserService.authenticate.restore();
        };

        // setup
        const credentials = { username: 'test', password: '' };
        const authenticateStub = Sinon.stub(UserService, 'authenticate')
            .withArgs(credentials)
            .rejects(APIError.AUTH_INVALID_CREDENTIALS());

        // exercise
        const response = await server.inject({
            method: 'POST',
            url: '/login',
            payload: credentials
        });

        // validate
        expect(authenticateStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equal(401);
        expect(response.statusMessage).to.equal('Unauthorized');
        expect(response.result.message).to.equal(APIError.AUTH_INVALID_CREDENTIALS().message);
    });

    it('handles internal server errors', async flags => {
        // cleanup
        flags.onCleanup = function () {
            UserService.authenticate.restore();
        };

        // setup
        const credentials = { username: 'test', password: 'test' };
        const authenticateStub = Sinon.stub(UserService, 'authenticate').rejects(
            APIError.AUTH_ERROR()
        );

        // exercise
        const response = await server.inject({
            method: 'POST',
            url: '/login',
            payload: credentials
        });

        expect(authenticateStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equal(500);
        expect(response.statusMessage).to.equal('Internal Server Error');
        expect(response.result.message).to.equal('An internal server error occurred');
    });

    it('login user with valid credentials', async flags => {
        // cleanup
        flags.onCleanup = function () {
            UserService.authenticate.restore();
        };

        // setup
        const credentials = { username: 'test', password: 'secret' };
        const authenticateStub = Sinon.stub(UserService, 'authenticate')
            .withArgs(credentials)
            .resolves(token);

        // exercise
        const response = await server.inject({
            method: 'POST',
            url: '/login',
            payload: credentials
        });

        expect(authenticateStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equal(204);
        expect(response.statusMessage).to.equal('No Content');
        expect(response.headers['server-authorization']).to.exist();
        expect(response.headers['server-authorization']).to.equals(token);
    });
});
