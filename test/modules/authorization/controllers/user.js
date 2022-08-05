const Sinon = require('sinon');
const UserController = require('modules/authorization/controllers/user');
const UserService = require('modules/authorization/services/user');
const TestRunner = require('test/fixtures/test-runner');
const APIError = require('errors/api-error');

const { describe, it, expect } = (exports.lab = TestRunner.script());

describe('Controller: user', () => {
    const users = [
        { id: 1, username: 'admin' },
        { id: 2, username: 'guest' }
    ];
    const statusCodeMessage = 'Internal Server Error';
    const resultMessage = 'An internal server error occurred';

    it('lists users', async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            UserService.list.restore();
        };

        // setup
        const listStub = Sinon.stub(UserService, 'list').returns(users);
        server.route({
            method: 'GET',
            path: '/user',
            config: {
                handler: UserController.list
            }
        });

        // exercise
        const response = await server.inject({
            method: 'GET',
            url: '/user'
        });

        // verify
        expect(listStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equal(200);
        expect(response.statusMessage).to.equal('OK');
        expect(response.result).to.equals(users);
    });

    it('handles server errors while listing users', async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            UserService.list.restore();
        };

        // setup
        const listStub = Sinon.stub(UserService, 'list').rejects(APIError.RESOURCE_FETCH());
        server.route({
            method: 'GET',
            path: '/user',
            config: {
                handler: UserController.list
            }
        });

        // exercise
        const response = await server.inject({
            method: 'GET',
            url: '/user'
        });

        // verify
        expect(listStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equal(500);
        expect(response.statusMessage).to.equal(statusCodeMessage);
        expect(response.result.message).to.equal(resultMessage);
    });

    it('gets a user', async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            UserService.findById.restore();
        };

        // setup
        const getStub = Sinon.stub(UserService, 'findById').returns(users[0]);
        server.route({
            method: 'GET',
            path: '/user/{id}',
            config: {
                handler: UserController.get
            }
        });

        // exercise
        const response = await server.inject({
            method: 'GET',
            url: '/user/1'
        });

        // verify
        expect(getStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equal(200);
        expect(response.statusMessage).to.equal('OK');
        expect(response.result).to.equals(users[0]);
    });

    it('handles server errors when fetching a user', async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            UserService.findById.restore();
        };

        // setup
        const getStub = Sinon.stub(UserService, 'findById').rejects(APIError.RESOURCE_FETCH());
        server.route({
            method: 'GET',
            path: '/user/{id}',
            config: {
                handler: UserController.get
            }
        });

        // exercise
        const response = await server.inject({
            method: 'GET',
            url: '/user/1'
        });

        // verify
        expect(getStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equal(500);
        expect(response.statusMessage).to.equal(statusCodeMessage);
        expect(response.result.message).to.equal(resultMessage);
    });

    it('creates a user', async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            UserService.create.restore();
        };

        // setup
        const fakeId = 1;
        const entity = { username: 'username', email: 'email', password: 'password', name: 'name' };
        const createStub = Sinon.stub(UserService, 'create').returns({ id: fakeId, ...entity });
        server.route({
            method: 'POST',
            path: '/user',
            config: {
                handler: UserController.create
            }
        });

        // exercise
        const response = await server.inject({
            method: 'POST',
            url: '/user',
            payload: entity
        });

        // verify
        expect(createStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equals(201);
        expect(response.statusMessage).to.equal('Created');
        expect(response.headers.location).to.equals(`/api/user/${fakeId}`);
        expect(response.result).to.be.null();
    });

    it('does not create a user with already existing fields', async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            UserService.create.restore();
        };

        // setup
        const entity = { username: 'username', email: 'email', password: 'password', name: 'name' };
        const createStub = Sinon.stub(UserService, 'create').rejects(APIError.RESOURCE_DUPLICATE());
        server.route({
            method: 'POST',
            path: '/user',
            config: {
                handler: UserController.create
            }
        });

        // exercise
        const response = await server.inject({
            method: 'POST',
            url: '/user',
            payload: entity
        });

        // verify
        expect(createStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equals(409);
        expect(response.statusMessage).to.equal('Conflict');
        expect(response.result.message).to.equal(APIError.RESOURCE_DUPLICATE().message);
    });

    it('handles server errors when creating an user', async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            UserService.create.restore();
        };

        // setup
        const entity = { username: 'username', email: 'email', password: 'password', name: 'name' };
        const createStub = Sinon.stub(UserService, 'create').rejects(APIError.RESOURCE_FETCH());
        server.route({
            method: 'POST',
            path: '/user',
            config: {
                handler: UserController.create
            }
        });

        // exercise
        const response = await server.inject({
            method: 'POST',
            url: '/user',
            payload: entity
        });

        //verify
        expect(createStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equal(500);
        expect(response.statusMessage).to.equal(statusCodeMessage);
        expect(response.result.message).to.equal(resultMessage);
    });

    it('updates a user', async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            UserService.update.restore();
        };

        // setup
        const entity = { username: 'username', name: 'name' };
        const editStub = Sinon.stub(UserService, 'update').returns(entity);
        server.route({
            method: 'PUT',
            path: '/user/{id}',
            config: {
                handler: UserController.update
            }
        });

        // exercise
        const response = await server.inject({
            method: 'PUT',
            url: '/user/1',
            payload: entity
        });

        // verify
        expect(editStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equals(204);
        expect(response.statusMessage).to.equal('No Content');
        expect(response.result).to.be.null();
    });

    it('does not update an user if the user does not exist', async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            UserService.update.restore();
        };

        // setup
        const entity = { username: 'username', name: 'name' };
        const editStub = Sinon.stub(UserService, 'update').rejects(APIError.RESOURCE_NOT_FOUND());
        server.route({
            method: 'PUT',
            path: '/user/{id}',
            config: {
                handler: UserController.update
            }
        });

        // exercise
        const response = await server.inject({
            method: 'PUT',
            url: '/user/0',
            payload: entity
        });

        // verify
        expect(editStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equals(404);
        expect(response.statusMessage).to.equal('Not Found');
        expect(response.result.message).to.equal(APIError.RESOURCE_NOT_FOUND().message);
    });

    it('does not update an user with already existing values', async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            UserService.update.restore();
        };

        // setup
        const entity = { username: 'username', name: 'name' };
        const editStub = Sinon.stub(UserService, 'update').rejects(APIError.RESOURCE_DUPLICATE());
        server.route({
            method: 'PUT',
            path: '/user/{id}',
            config: {
                handler: UserController.update
            }
        });

        // exercise
        const response = await server.inject({
            method: 'PUT',
            url: '/user/1',
            payload: entity
        });

        // verify
        expect(editStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equals(409);
        expect(response.statusMessage).to.equal('Conflict');
        expect(response.result.message).to.equal(APIError.RESOURCE_DUPLICATE().message);
    });

    it('handles server errors when updating an user', async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            UserService.update.restore();
        };

        // setup
        const entity = { username: 'username', name: 'name' };
        const editStub = Sinon.stub(UserService, 'update').rejects(APIError.RESOURCE_FETCH());
        server.route({
            method: 'PUT',
            path: '/user/{id}',
            config: {
                handler: UserController.update
            }
        });

        // exercise
        const response = await server.inject({
            method: 'PUT',
            url: '/user/1',
            payload: entity
        });

        //verify
        expect(editStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equal(500);
        expect(response.statusMessage).to.equal(statusCodeMessage);
        expect(response.result.message).to.equal(resultMessage);
    });

    it('deletes a user', async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            UserService.remove.restore();
        };

        // setup
        const removeStub = Sinon.stub(UserService, 'remove').returns(Promise.resolve());
        server.route({
            method: 'DELETE',
            path: '/user/{id}',
            config: {
                handler: UserController.remove
            }
        });

        // exercise
        const response = await server.inject({
            method: 'DELETE',
            url: '/user/1'
        });

        // verify
        expect(removeStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equals(204);
        expect(response.statusMessage).to.equal('No Content');
        expect(response.result).to.be.null();
    });

    it('does not delete an user if the user does not exist', async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            UserService.remove.restore();
        };

        // setup
        const removeStub = Sinon.stub(UserService, 'remove').rejects(APIError.RESOURCE_NOT_FOUND());
        server.route({
            method: 'DELETE',
            path: '/user/{id}',
            config: {
                handler: UserController.remove
            }
        });

        // exercise
        const response = await server.inject({
            method: 'DELETE',
            url: '/user/0'
        });

        // verify
        expect(removeStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equals(404);
        expect(response.statusMessage).to.equal('Not Found');
        expect(response.result.message).to.equal(APIError.RESOURCE_NOT_FOUND().message);
    });

    it('handles server errors when deleting an user', async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            UserService.remove.restore();
        };

        // setup
        const removeStub = Sinon.stub(UserService, 'remove').rejects(APIError.RESOURCE_FETCH());
        server.route({
            method: 'DELETE',
            path: '/user/{id}',
            config: {
                handler: UserController.remove
            }
        });

        // exercise
        const response = await server.inject({
            method: 'DELETE',
            url: '/user/1'
        });

        //verify
        expect(removeStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equal(500);
        expect(response.statusMessage).to.equal(statusCodeMessage);
        expect(response.result.message).to.equal(resultMessage);
    });

    it("updates a user's roles", async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            UserService.upsertRoles.restore();
        };

        // setup
        const entity = {};
        const editStub = Sinon.stub(UserService, 'upsertRoles').returns(Promise.resolve());
        server.route({
            method: 'PUT',
            path: '/user/{id}/roles',
            config: {
                handler: UserController.upsertRoles
            }
        });

        // exercise
        const response = await server.inject({
            method: 'PUT',
            url: '/user/1/roles',
            payload: entity
        });

        // verify
        expect(editStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equals(204);
        expect(response.statusMessage).to.equal('No Content');
        expect(response.result).to.be.null();
    });

    it("does not update a user's roles if the user does not exist", async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            UserService.upsertRoles.restore();
        };

        // setup
        const entity = {};
        const editStub = Sinon.stub(UserService, 'upsertRoles').rejects(
            APIError.RESOURCE_NOT_FOUND()
        );
        server.route({
            method: 'PUT',
            path: '/user/{id}/roles',
            config: {
                handler: UserController.upsertRoles
            }
        });

        // exercise
        const response = await server.inject({
            method: 'PUT',
            url: '/user/0/roles',
            payload: entity
        });

        // verify
        expect(editStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equals(404);
        expect(response.statusMessage).to.equal('Not Found');
        expect(response.result.message).to.equal(APIError.RESOURCE_NOT_FOUND().message);
    });

    it("handles server errors when updating a user's roles", async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            UserService.upsertRoles.restore();
        };

        // setup
        const entity = {};
        const editStub = Sinon.stub(UserService, 'upsertRoles').rejects(APIError.RESOURCE_FETCH());
        server.route({
            method: 'PUT',
            path: '/user/{id}/roles',
            config: {
                handler: UserController.upsertRoles
            }
        });

        // exercise
        const response = await server.inject({
            method: 'PUT',
            url: '/user/1/roles',
            payload: entity
        });

        //verify
        expect(editStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equal(500);
        expect(response.statusMessage).to.equal(statusCodeMessage);
        expect(response.result.message).to.equal(resultMessage);
    });
});
