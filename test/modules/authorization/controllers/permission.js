const Sinon = require('sinon');
const PermissionController = require('modules/authorization/controllers/permission');
const PermissionService = require('modules/authorization/services/permission');
const TestRunner = require('test/fixtures/test-runner');
const APIError = require('errors/api-error');

const { describe, it, expect } = (exports.lab = TestRunner.script());

describe('Controller: permission', () => {
    const permissions = [
        { id: 1, action: 'create', description: 'create' },
        { id: 2, action: 'read', description: 'read' }
    ];
    const statusCodeMessage = 'Internal Server Error';
    const resultMessage = 'An internal server error occurred';

    it('lists permissions', async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            PermissionService.list.restore();
        };

        // setup
        const listStub = Sinon.stub(PermissionService, 'list').returns(permissions);
        server.route({
            method: 'GET',
            path: '/permission',
            config: {
                handler: PermissionController.list
            }
        });

        // exercise
        const response = await server.inject({
            method: 'GET',
            url: '/permission'
        });

        // verify
        expect(listStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equal(200);
        expect(response.statusMessage).to.equal('OK');
        expect(response.result).to.equals(permissions);
    });

    it('handles server errors while listing permissions', async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            PermissionService.list.restore();
        };

        // setup
        const listStub = Sinon.stub(PermissionService, 'list').rejects(APIError.RESOURCE_FETCH());
        server.route({
            method: 'GET',
            path: '/permission',
            config: {
                handler: PermissionController.list
            }
        });

        // exercise
        const response = await server.inject({
            method: 'GET',
            url: '/permission'
        });

        // verify
        expect(listStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equal(500);
        expect(response.statusMessage).to.equal(statusCodeMessage);
        expect(response.result.message).to.equal(resultMessage);
    });

    it('gets a permission', async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            PermissionService.findById.restore();
        };

        // setup
        const getStub = Sinon.stub(PermissionService, 'findById').returns(permissions[0]);
        server.route({
            method: 'GET',
            path: '/permission/{id}',
            config: {
                handler: PermissionController.get
            }
        });

        // exercise
        const response = await server.inject({
            method: 'GET',
            url: '/permission/1'
        });

        // verify
        expect(getStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equal(200);
        expect(response.statusMessage).to.equal('OK');
        expect(response.result).to.equals(permissions[0]);
    });

    it('handles server errors when fetching a permission', async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            PermissionService.findById.restore();
        };

        // setup
        const getStub = Sinon.stub(PermissionService, 'findById').rejects(
            APIError.RESOURCE_FETCH()
        );
        server.route({
            method: 'GET',
            path: '/permission/{id}',
            config: {
                handler: PermissionController.get
            }
        });

        // exercise
        const response = await server.inject({
            method: 'GET',
            url: '/permission/1'
        });

        // verify
        expect(getStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equal(500);
        expect(response.statusMessage).to.equal(statusCodeMessage);
        expect(response.result.message).to.equal(resultMessage);
    });

    it('creates a permission', async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            PermissionService.create.restore();
        };

        // setup
        const fakeId = 1;
        const entity = {};
        const createStub = Sinon.stub(PermissionService, 'create').returns({
            id: fakeId,
            ...entity
        });
        server.route({
            method: 'POST',
            path: '/permission',
            config: {
                handler: PermissionController.create
            }
        });

        // exercise
        const response = await server.inject({
            method: 'POST',
            url: '/permission',
            payload: entity
        });

        // verify
        expect(createStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equals(201);
        expect(response.statusMessage).to.equal('Created');
        expect(response.headers.location).to.equals(`/api/permission/${fakeId}`);
        expect(response.result).to.be.null();
    });

    it('does not create a permission with already existing action for a resource', async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            PermissionService.create.restore();
        };

        // setup
        const entity = {};
        const createStub = Sinon.stub(PermissionService, 'create').rejects(
            APIError.RESOURCE_DUPLICATE()
        );
        server.route({
            method: 'POST',
            path: '/permission',
            config: {
                handler: PermissionController.create
            }
        });

        // exercise
        const response = await server.inject({
            method: 'POST',
            url: '/permission',
            payload: entity
        });

        // verify
        expect(createStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equals(409);
        expect(response.statusMessage).to.equal('Conflict');
        expect(response.result.message).to.equal(APIError.RESOURCE_DUPLICATE().message);
    });

    it('handles server errors when creating a permission', async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            PermissionService.create.restore();
        };

        // setup
        const entity = {};
        const createStub = Sinon.stub(PermissionService, 'create').rejects(
            APIError.RESOURCE_FETCH()
        );
        server.route({
            method: 'POST',
            path: '/permission',
            config: {
                handler: PermissionController.create
            }
        });

        // exercise
        const response = await server.inject({
            method: 'POST',
            url: '/permission',
            payload: entity
        });

        //verify
        expect(createStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equal(500);
        expect(response.statusMessage).to.equal(statusCodeMessage);
        expect(response.result.message).to.equal(resultMessage);
    });

    it('deletes a role', async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            PermissionService.remove.restore();
        };

        // setup
        const removeStub = Sinon.stub(PermissionService, 'remove').returns(Promise.resolve());
        server.route({
            method: 'DELETE',
            path: '/permission/{id}',
            config: {
                handler: PermissionController.remove
            }
        });

        // exercise
        const response = await server.inject({
            method: 'DELETE',
            url: '/permission/1'
        });

        // verify
        expect(removeStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equals(204);
        expect(response.statusMessage).to.equal('No Content');
        expect(response.result).to.be.null();
    });

    it('does not delete a permission if the permission does not exist', async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            PermissionService.remove.restore();
        };

        // setup
        const removeStub = Sinon.stub(PermissionService, 'remove').rejects(
            APIError.RESOURCE_NOT_FOUND()
        );
        server.route({
            method: 'DELETE',
            path: '/permission/{id}',
            config: {
                handler: PermissionController.remove
            }
        });

        // exercise
        const response = await server.inject({
            method: 'DELETE',
            url: '/permission/0'
        });

        // verify
        expect(removeStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equals(404);
        expect(response.statusMessage).to.equal('Not Found');
        expect(response.result.message).to.equal(APIError.RESOURCE_NOT_FOUND().message);
    });

    it('handles server errors when deleting a permission', async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            PermissionService.remove.restore();
        };

        // setup
        const removeStub = Sinon.stub(PermissionService, 'remove').rejects(
            APIError.RESOURCE_FETCH()
        );
        server.route({
            method: 'DELETE',
            path: '/permission/{id}',
            config: {
                handler: PermissionController.remove
            }
        });

        // exercise
        const response = await server.inject({
            method: 'DELETE',
            url: '/permission/1'
        });

        //verify
        expect(removeStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equal(500);
        expect(response.statusMessage).to.equal(statusCodeMessage);
        expect(response.result.message).to.equal(resultMessage);
    });
});
