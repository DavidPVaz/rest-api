const Sinon = require('sinon');
const RoleController = require('modules/authorization/controllers/role');
const RoleService = require('modules/authorization/services/role');
const TestRunner = require('test/fixtures/test-runner');
const APIError = require('errors/api-error');

const { describe, it, expect } = (exports.lab = TestRunner.script());

describe('Controller: role', () => {
    const roles = [
        { id: 1, name: 'admin', description: 'admin' },
        { id: 2, name: 'guest', description: 'guest' }
    ];
    const statusCodeMessage = 'Internal Server Error';
    const resultMessage = 'An internal server error occurred';

    it('lists roles', async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            RoleService.list.restore();
        };

        // setup
        const listStub = Sinon.stub(RoleService, 'list').returns(roles);
        server.route({
            method: 'GET',
            path: '/role',
            config: {
                handler: RoleController.list
            }
        });

        // exercise
        const response = await server.inject({
            method: 'GET',
            url: '/role'
        });

        // verify
        expect(listStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equal(200);
        expect(response.statusMessage).to.equal('OK');
        expect(response.result).to.equals(roles);
    });

    it('handles server errors while listing roles', async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            RoleService.list.restore();
        };

        // setup
        const listStub = Sinon.stub(RoleService, 'list').rejects(APIError.RESOURCE_FETCH());
        server.route({
            method: 'GET',
            path: '/role',
            config: {
                handler: RoleController.list
            }
        });

        // exercise
        const response = await server.inject({
            method: 'GET',
            url: '/role'
        });

        // verify
        expect(listStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equal(500);
        expect(response.statusMessage).to.equal(statusCodeMessage);
        expect(response.result.message).to.equal(resultMessage);
    });

    it('gets a role', async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            RoleService.findById.restore();
        };

        // setup
        const getStub = Sinon.stub(RoleService, 'findById').returns(roles[0]);
        server.route({
            method: 'GET',
            path: '/role/{id}',
            config: {
                handler: RoleController.get
            }
        });

        // exercise
        const response = await server.inject({
            method: 'GET',
            url: '/role/1'
        });

        // verify
        expect(getStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equal(200);
        expect(response.statusMessage).to.equal('OK');
        expect(response.result).to.equals(roles[0]);
    });

    it('handles server errors when fetching a role', async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            RoleService.findById.restore();
        };

        // setup
        const getStub = Sinon.stub(RoleService, 'findById').rejects(APIError.RESOURCE_FETCH());
        server.route({
            method: 'GET',
            path: '/role/{id}',
            config: {
                handler: RoleController.get
            }
        });

        // exercise
        const response = await server.inject({
            method: 'GET',
            url: '/role/1'
        });

        // verify
        expect(getStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equal(500);
        expect(response.statusMessage).to.equal(statusCodeMessage);
        expect(response.result.message).to.equal(resultMessage);
    });

    it('creates a role', async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            RoleService.create.restore();
        };

        // setup
        const fakeId = 1;
        const entity = { name: 'new role', description: 'new role' };
        const createStub = Sinon.stub(RoleService, 'create').returns({ id: fakeId, ...entity });
        server.route({
            method: 'POST',
            path: '/role',
            config: {
                handler: RoleController.create
            }
        });

        // exercise
        const response = await server.inject({
            method: 'POST',
            url: '/role',
            payload: entity
        });

        // verify
        expect(createStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equals(201);
        expect(response.statusMessage).to.equal('Created');
        expect(response.headers.location).to.equals(`/api/role/${fakeId}`);
        expect(response.result).to.be.null();
    });

    it('does not create a role with already existing fields', async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            RoleService.create.restore();
        };

        // setup
        const entity = {};
        const createStub = Sinon.stub(RoleService, 'create').rejects(APIError.RESOURCE_DUPLICATE());
        server.route({
            method: 'POST',
            path: '/role',
            config: {
                handler: RoleController.create
            }
        });

        // exercise
        const response = await server.inject({
            method: 'POST',
            url: '/role',
            payload: entity
        });

        // verify
        expect(createStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equals(409);
        expect(response.statusMessage).to.equal('Conflict');
        expect(response.result.message).to.equal(APIError.RESOURCE_DUPLICATE().message);
    });

    it('handles server errors when creating a role', async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            RoleService.create.restore();
        };

        // setup
        const entity = {};
        const createStub = Sinon.stub(RoleService, 'create').rejects(APIError.RESOURCE_FETCH());
        server.route({
            method: 'POST',
            path: '/role',
            config: {
                handler: RoleController.create
            }
        });

        // exercise
        const response = await server.inject({
            method: 'POST',
            url: '/role',
            payload: entity
        });

        //verify
        expect(createStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equal(500);
        expect(response.statusMessage).to.equal(statusCodeMessage);
        expect(response.result.message).to.equal(resultMessage);
    });

    it('updates a role', async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            RoleService.update.restore();
        };

        // setup
        const entity = {};
        const editStub = Sinon.stub(RoleService, 'update').returns(entity);
        server.route({
            method: 'PUT',
            path: '/role/{id}',
            config: {
                handler: RoleController.update
            }
        });

        // exercise
        const response = await server.inject({
            method: 'PUT',
            url: '/role/1',
            payload: entity
        });

        // verify
        expect(editStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equals(204);
        expect(response.statusMessage).to.equal('No Content');
        expect(response.result).to.be.null();
    });

    it('does not update a role if the role does not exist', async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            RoleService.update.restore();
        };

        // setup
        const entity = {};
        const editStub = Sinon.stub(RoleService, 'update').rejects(APIError.RESOURCE_NOT_FOUND());
        server.route({
            method: 'PUT',
            path: '/role/{id}',
            config: {
                handler: RoleController.update
            }
        });

        // exercise
        const response = await server.inject({
            method: 'PUT',
            url: '/role/0',
            payload: entity
        });

        // verify
        expect(editStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equals(404);
        expect(response.statusMessage).to.equal('Not Found');
        expect(response.result.message).to.equal(APIError.RESOURCE_NOT_FOUND().message);
    });

    it('does not update a role with already existing values', async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            RoleService.update.restore();
        };

        // setup
        const entity = {};
        const editStub = Sinon.stub(RoleService, 'update').rejects(APIError.RESOURCE_DUPLICATE());
        server.route({
            method: 'PUT',
            path: '/role/{id}',
            config: {
                handler: RoleController.update
            }
        });

        // exercise
        const response = await server.inject({
            method: 'PUT',
            url: '/role/1',
            payload: entity
        });

        // verify
        expect(editStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equals(409);
        expect(response.statusMessage).to.equal('Conflict');
        expect(response.result.message).to.equal(APIError.RESOURCE_DUPLICATE().message);
    });

    it('handles server errors when updating a role', async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            RoleService.update.restore();
        };

        // setup
        const entity = {};
        const editStub = Sinon.stub(RoleService, 'update').rejects(APIError.RESOURCE_FETCH());
        server.route({
            method: 'PUT',
            path: '/role/{id}',
            config: {
                handler: RoleController.update
            }
        });

        // exercise
        const response = await server.inject({
            method: 'PUT',
            url: '/role/1',
            payload: entity
        });

        //verify
        expect(editStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equal(500);
        expect(response.statusMessage).to.equal(statusCodeMessage);
        expect(response.result.message).to.equal(resultMessage);
    });

    it('deletes a role', async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            RoleService.remove.restore();
        };

        // setup
        const removeStub = Sinon.stub(RoleService, 'remove').returns(Promise.resolve());
        server.route({
            method: 'DELETE',
            path: '/role/{id}',
            config: {
                handler: RoleController.remove
            }
        });

        // exercise
        const response = await server.inject({
            method: 'DELETE',
            url: '/role/1'
        });

        // verify
        expect(removeStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equals(204);
        expect(response.statusMessage).to.equal('No Content');
        expect(response.result).to.be.null();
    });

    it('does not delete a role if the role does not exist', async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            RoleService.remove.restore();
        };

        // setup
        const removeStub = Sinon.stub(RoleService, 'remove').rejects(APIError.RESOURCE_NOT_FOUND());
        server.route({
            method: 'DELETE',
            path: '/role/{id}',
            config: {
                handler: RoleController.remove
            }
        });

        // exercise
        const response = await server.inject({
            method: 'DELETE',
            url: '/role/0'
        });

        // verify
        expect(removeStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equals(404);
        expect(response.statusMessage).to.equal('Not Found');
        expect(response.result.message).to.equal(APIError.RESOURCE_NOT_FOUND().message);
    });

    it('handles server errors when deleting a role', async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            RoleService.remove.restore();
        };

        // setup
        const removeStub = Sinon.stub(RoleService, 'remove').rejects(APIError.RESOURCE_FETCH());
        server.route({
            method: 'DELETE',
            path: '/role/{id}',
            config: {
                handler: RoleController.remove
            }
        });

        // exercise
        const response = await server.inject({
            method: 'DELETE',
            url: '/role/1'
        });

        //verify
        expect(removeStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equal(500);
        expect(response.statusMessage).to.equal(statusCodeMessage);
        expect(response.result.message).to.equal(resultMessage);
    });

    it("updates a role's permissions", async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            RoleService.upsertPermissions.restore();
        };

        // setup
        const entity = {};
        const editStub = Sinon.stub(RoleService, 'upsertPermissions').returns(Promise.resolve());
        server.route({
            method: 'PUT',
            path: '/role/{id}/permissions',
            config: {
                handler: RoleController.upsertPermissions
            }
        });

        // exercise
        const response = await server.inject({
            method: 'PUT',
            url: '/role/1/permissions',
            payload: entity
        });

        // verify
        expect(editStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equals(204);
        expect(response.statusMessage).to.equal('No Content');
        expect(response.result).to.be.null();
    });

    it("does not update a role's permissions if the role does not exist", async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            RoleService.upsertPermissions.restore();
        };

        // setup
        const entity = {};
        const editStub = Sinon.stub(RoleService, 'upsertPermissions').rejects(
            APIError.RESOURCE_NOT_FOUND()
        );
        server.route({
            method: 'PUT',
            path: '/role/{id}/permissions',
            config: {
                handler: RoleController.upsertPermissions
            }
        });

        // exercise
        const response = await server.inject({
            method: 'PUT',
            url: '/role/0/permissions',
            payload: entity
        });

        // verify
        expect(editStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equals(404);
        expect(response.statusMessage).to.equal('Not Found');
        expect(response.result.message).to.equal(APIError.RESOURCE_NOT_FOUND().message);
    });

    it("handles server errors when updating a role's permissions", async (server, flags) => {
        // cleanup
        flags.onCleanup = function () {
            RoleService.upsertPermissions.restore();
        };

        // setup
        const entity = {};
        const editStub = Sinon.stub(RoleService, 'upsertPermissions').rejects(
            APIError.RESOURCE_FETCH()
        );
        server.route({
            method: 'PUT',
            path: '/role/{id}/permissions',
            config: {
                handler: RoleController.upsertPermissions
            }
        });

        // exercise
        const response = await server.inject({
            method: 'PUT',
            url: '/role/1/permissions',
            payload: entity
        });

        //verify
        expect(editStub.calledOnce).to.be.true();
        expect(response.statusCode).to.equal(500);
        expect(response.statusMessage).to.equal(statusCodeMessage);
        expect(response.result.message).to.equal(resultMessage);
    });
});
