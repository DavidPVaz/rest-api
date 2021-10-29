const Sinon = require('sinon');
const AuthorizationController = require('modules/authorization/controllers/authorization');
const AuthorizationService = require('modules/authorization/services/authorization');
const TestRunner = require('test/fixtures/test-runner');

const { describe, it, expect } = (exports.lab = TestRunner.script());

describe('Controller: authorization', () => {
    const action = 'read';
    const resource = 'role';
    const username = 'username';
    const fakeResult = 'ok';
    const fakeRoute = {
        path: '/',
        method: 'GET',
        config: {
            handler: () => fakeResult,
            pre: [AuthorizationController.authorize(resource, action)]
        }
    };

    it('authorizes user to access resource with explicit action', async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            AuthorizationService.canUser.restore();
        };
        // setup
        const authorizationStub = Sinon.stub(AuthorizationService, 'canUser')
            .withArgs(username, action, resource)
            .returns(Promise.resolve(true));

        // exercise
        server.route(fakeRoute);
        const response = await server.inject({
            url: '/',
            auth: {
                credentials: { username },
                strategy: 'default'
            }
        });

        // validate
        expect(authorizationStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equal(200);
        expect(response.result).to.equals(fakeResult);
    });

    it('does not authorize user to access resource', async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            AuthorizationService.canUser.restore();
        };

        // setup
        const authorizationStub = Sinon.stub(AuthorizationService, 'canUser')
            .withArgs(username, action, resource)
            .returns(Promise.resolve(false));

        // exercise
        server.route(fakeRoute);
        const response = await server.inject({
            url: '/',
            auth: {
                credentials: { username },
                strategy: 'default'
            }
        });

        // validate
        expect(authorizationStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equals(403);
        expect(response.statusMessage).to.equals('Forbidden');
        expect(response.result.message).to.equals('insufficient privileges');
    });

    it('does not authorize an inactive user to perform actions on resources', async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            AuthorizationService.canUser.restore();
        };

        // setup
        const authorizationStub = Sinon.stub(AuthorizationService, 'canUser')
            .withArgs('guest', action, resource)
            .returns(Promise.resolve(false));

        // exercise
        server.route(fakeRoute);
        const response = await server.inject({
            url: '/',
            auth: {
                credentials: { username: 'guest' },
                strategy: 'default'
            }
        });

        // validate
        expect(authorizationStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equals(403);
        expect(response.statusMessage).to.equal('Forbidden');
        expect(response.result.message).to.equal('insufficient privileges');
    });

    it('handles errors while authorizing', async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            AuthorizationService.canUser.restore();
        };

        // setup
        const authorizationStub = Sinon.stub(AuthorizationService, 'canUser')
            .withArgs(username, action, resource)
            .returns(Promise.reject(new Error()));

        // exercise
        server.route(fakeRoute);
        const response = await server.inject({
            url: '/',
            auth: {
                credentials: { username },
                strategy: 'default'
            }
        });

        // validate
        expect(authorizationStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equals(500);
        expect(response.statusMessage).to.equals('Internal Server Error');
        expect(response.result.message).to.equals('An internal server error occurred');
    });
});
