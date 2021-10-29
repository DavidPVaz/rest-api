const Sinon = require('sinon');
const LoginController = require('modules/authorization/controllers/login');
const APIError = require('errors/api-error');
const UserService = require('modules/authorization/services/user');
const TestRunner = require('test/fixtures/test-runner');

const { describe, it, expect } = (exports.lab = TestRunner.script());

describe('Controller: login', () => {
    // created using npm run token
    const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MCwidmVyc2lvbiI6MSwiaWF0IjoxNTI5OTQ4MjgyLCJleHAiOjE1Mjk5NTE4ODIsImF1ZCI6WyJub2lyZTphdXRoIl19.9QZNHh9rn0KFMxmxu8g-3sC4_G0Ompgy28c_DgicljQ';

    it('rejects login with invalid username', async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            UserService.authenticate.restore();
        };

        // setup
        const credentials = { username: 'invalid', password: 'secret' };
        const authenticateStub = Sinon.stub(UserService, 'authenticate')
            .withArgs(credentials)
            .rejects(APIError.AUTH_INVALID_CREDENTIALS());
        server.route({
            method: 'POST',
            path: '/login',
            config: { handler: LoginController.login }
        });

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

    it('rejects login with invalid password', async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            UserService.authenticate.restore();
        };

        // setup
        const credentials = { username: 'test', password: '' };
        const authenticateStub = Sinon.stub(UserService, 'authenticate')
            .withArgs(credentials)
            .rejects(APIError.AUTH_INVALID_CREDENTIALS());
        server.route({
            method: 'POST',
            path: '/login',
            config: { handler: LoginController.login }
        });

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

    it('handles internal server errors', async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            UserService.authenticate.restore();
        };

        // setup
        const credentials = { username: 'test', password: 'test' };
        const authenticateStub = Sinon.stub(UserService, 'authenticate').rejects(new Error());
        server.route({
            method: 'POST',
            path: '/login',
            config: { handler: LoginController.login }
        });

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

    it('login user with valid credentials', async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            UserService.authenticate.restore();
        };

        // setup
        const credentials = { username: 'test', password: 'secret' };
        const authenticateStub = Sinon.stub(UserService, 'authenticate')
            .withArgs(credentials)
            .resolves(token);
        server.route({
            method: 'POST',
            path: '/login',
            config: { handler: LoginController.login }
        });

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
