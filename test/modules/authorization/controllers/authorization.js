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
        server.route(fakeRoute);

        // exercise
        const response = await server.inject({
            url: '/',
            auth: {
                credentials: { username },
                strategy: 'default'
            }
        });

        // verify
        expect(authorizationStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equal(200);
        expect(response.statusMessage).to.equal('OK');
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
        server.route(fakeRoute);

        // exercise
        const response = await server.inject({
            url: '/',
            auth: {
                credentials: { username },
                strategy: 'default'
            }
        });

        // verify
        expect(authorizationStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equals(403);
        expect(response.statusMessage).to.equals('Forbidden');
        expect(response.result.message).to.equals('insufficient privileges');
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
        server.route(fakeRoute);

        // exercise
        const response = await server.inject({
            url: '/',
            auth: {
                credentials: { username },
                strategy: 'default'
            }
        });

        // verify
        expect(authorizationStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equals(500);
        expect(response.statusMessage).to.equals('Internal Server Error');
        expect(response.result.message).to.equals('An internal server error occurred');
    });
});
