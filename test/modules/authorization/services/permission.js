const TestRunner = require('test/fixtures/test-runner');
const PermissionService = require('modules/authorization/services/permission');
const PermissionModel = require('models/authorization/permission');
const APIError = require('errors/api-error');

const { describe, it, expect } = (exports.lab = TestRunner.script());

describe(
    'Service: permission',
    () => {
        it('should count permissions', async () => {
            // setup
            const expectedCount = 11;

            // exercise
            const result = await PermissionService.count();

            // verify
            expect(result).to.be.number();
            expect(result).to.be.equal(expectedCount);
        });

        it('should list permissions', async () => {
            // setup
            const expectedIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

            // exercise
            const result = await PermissionService.list();

            // verify
            expect(result).to.be.array();
            expect(result).to.have.length(expectedIds.length);
            result.forEach(({ id }) => expect(expectedIds.includes(id)).to.be.true());
        });

        it('should find a permission by id', async () => {
            // setup
            const expectedPermission = {
                id: 1,
                action: 'create',
                description: 'Create a new user'
            };

            // exercise
            const result = await PermissionService.findById(expectedPermission.id);

            // verify
            expect(result).to.be.instanceOf(PermissionModel);
            expect(result.resourceId).to.be.undefined();
            Object.entries(expectedPermission).forEach(([property, value]) =>
                expect(result[property]).to.be.equal(value)
            );
        });

        it('should not find a permission that does not exist', async () => {
            // setup
            const id = 0;

            // exercise and verify
            await expect(PermissionService.findById(id)).to.reject(
                Error,
                APIError.RESOURCE_NOT_FOUND().message
            );
        });

        it('should find a permission by some value', async () => {
            // setup
            const expectedPermission = {
                id: 1,
                action: 'create',
                description: 'Create a new user'
            };

            // exercise
            const result = await PermissionService.findOne({
                description: expectedPermission.description
            });

            // verify
            expect(result).to.be.instanceOf(PermissionModel);
            expect(result.resourceId).to.be.undefined();
            Object.entries(expectedPermission).forEach(([property, value]) =>
                expect(result[property]).to.be.equal(value)
            );
        });

        it(
            'should create a new permission',
            async () => {
                // setup
                const newPermission = {
                    action: 'create',
                    description: 'some description',
                    resource: 'user'
                };

                const expectedPermission = {
                    id: 1,
                    action: 'create',
                    description: 'some description',
                    resourceId: 1
                };

                // exercise
                const result = await PermissionService.create(newPermission);

                // verify
                expect(result).to.be.instanceOf(PermissionModel);
                expect(result.id).to.be.number();
                Object.entries(expectedPermission).forEach(([property, value]) =>
                    expect(result[property]).to.be.equal(value)
                );
            },
            { seeds: ['resources'], overwrite: true }
        );

        it(
            'should not create a new permission if we already have an action for the same resource',
            async () => {
                // setup
                const newPermission = {
                    action: 'create',
                    resource: 'user'
                };

                // exercise and verify
                await expect(PermissionService.create(newPermission)).to.reject(
                    Error,
                    APIError.RESOURCE_DUPLICATE().message
                );
            },
            {
                seeds: ['resources']
            }
        );

        it(
            'should not create a new permission if the action is invalid',
            async () => {
                // setup
                const newPermission = {
                    action: 'invalid',
                    resource: 'user'
                };

                // exercise and verify
                await expect(PermissionService.create(newPermission)).to.reject(
                    Error,
                    'Invalid action'
                );
            },
            { seeds: [], overwrite: true }
        );

        it('should not create a new permission if the resource is invalid', async () => {
            // setup
            const newPermission = {
                action: 'create',
                resource: 'invalid'
            };

            // exercise and verify
            await expect(PermissionService.create(newPermission)).to.reject(
                Error,
                'Invalid resource'
            );
        });

        it('should remove a permission', async () => {
            // setup
            const id = 1;

            // exercise
            const result = await PermissionService.remove(id);

            // verify
            expect(result).to.be.equal(1);
        });

        it(
            'should not remove a permission that does not exist',
            async () => {
                // setup
                const id = 0;

                // exercice and verify
                await expect(PermissionService.remove(id)).to.reject(
                    Error,
                    APIError.RESOURCE_NOT_FOUND().message
                );
            },
            { seeds: [], overwrite: true }
        );

        it(
            'should not remove a permission that is still related to role',
            async () => {
                // setup
                const id = 1;

                // exercice and verify
                await expect(PermissionService.remove(id)).to.reject(
                    Error,
                    APIError.RESOURCE_RELATION().message
                );
            },
            { seeds: ['roles', 'roles_permissions'] }
        );
    },
    {
        seeds: ['permissions'],
        models: ['authorization/permission', 'authorization/resource']
    }
);
