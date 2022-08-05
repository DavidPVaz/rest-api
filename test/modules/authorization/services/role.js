const TestRunner = require('test/fixtures/test-runner');
const RoleService = require('modules/authorization/services/role');
const PermissionModel = require('models/authorization/permission');
const RoleModel = require('models/authorization/role');
const APIError = require('errors/api-error');

const { describe, it, expect } = (exports.lab = TestRunner.script());

describe(
    'Service: role',
    () => {
        it('should count roles', async () => {
            // setup
            const expectedCount = 2;

            // exercise
            const result = await RoleService.count();

            // verify
            expect(result).to.be.number();
            expect(result).to.be.equal(expectedCount);
        });

        it('should list roles', async () => {
            // setup
            const expectedIds = [1, 2];

            // exercise
            const result = await RoleService.list();

            // verify
            expect(result).to.be.array();
            expect(result).to.have.length(expectedIds.length);
            result.forEach(({ id }) => expect(expectedIds.includes(id)).to.be.true());
        });

        it('should find a role by id', async () => {
            // setup
            const expectedRole = {
                id: 1,
                name: 'admin',
                description: 'administrator'
            };

            // exercise
            const result = await RoleService.findById(expectedRole.id);

            // verify
            expect(result).to.be.instanceOf(RoleModel);
            expect(result.password).to.be.undefined();
            Object.entries(expectedRole).forEach(([property, value]) =>
                expect(result[property]).to.be.equal(value)
            );
        });

        it('should not find a role that does not exist', async () => {
            // setup
            const id = 0;

            // exercise and verify
            await expect(RoleService.findById(id)).to.reject(
                Error,
                APIError.RESOURCE_NOT_FOUND().message
            );
        });

        it('should find a role by some value', async () => {
            // setup
            const expectedRole = {
                id: 1,
                name: 'admin',
                description: 'administrator'
            };

            // exercise
            const result = await RoleService.findOne({ name: expectedRole.name });

            // verify
            expect(result).to.be.instanceOf(RoleModel);
            expect(result.password).to.be.undefined();
            Object.entries(expectedRole).forEach(([property, value]) =>
                expect(result[property]).to.be.equal(value)
            );
        });

        it(
            'should create a new role',
            async () => {
                // setup
                const newRole = {
                    name: 'new role',
                    description: 'some description'
                };

                // exercise
                const result = await RoleService.create(newRole);

                // verify
                expect(result).to.be.instanceOf(RoleModel);
                expect(result.id).to.be.number();
                Object.entries(newRole).forEach(([property, value]) =>
                    expect(result[property]).to.be.equal(value)
                );
            },
            { seeds: [], overwrite: true }
        );

        it('should not create a new role if we already have a role with the same name', async () => {
            // setup
            const newRole = {
                name: 'guest',
                description: 'some description'
            };

            // exercise and verify
            await expect(RoleService.create(newRole)).to.reject(
                Error,
                APIError.RESOURCE_DUPLICATE().message
            );
        });

        it('should update a role', async () => {
            // setup
            const id = 2;
            const role = {
                name: 'other guest',
                description: 'description'
            };

            // exercise
            const result = await RoleService.update(id, role);

            // verify
            expect(result).to.be.instanceOf(RoleModel);
            expect(result.id).to.be.equal(id);
            Object.entries(role).forEach(([property, value]) =>
                expect(result[property]).to.be.equal(value)
            );
        });

        it(
            'should not update a role that does not exist',
            async () => {
                // setup
                const id = 0;
                const role = {};

                // exercise and verify
                await expect(RoleService.update(id, role)).to.reject(
                    Error,
                    APIError.RESOURCE_NOT_FOUND().message
                );
            },
            { seeds: [], overwrite: true }
        );

        it('should not update a role if we already have a role with the same name', async () => {
            // setup
            const id = 2;
            const role = { name: 'admin' };

            // exercise and verify
            await expect(RoleService.update(id, role)).to.reject(
                Error,
                APIError.RESOURCE_DUPLICATE().message
            );
        });

        it(
            'should not remove a role that does not exist',
            async () => {
                // setup
                const id = 0;

                // exercice and verify
                await expect(RoleService.remove(id)).to.reject(
                    Error,
                    APIError.RESOURCE_NOT_FOUND().message
                );
            },
            { seeds: [], overwrite: true }
        );

        it(
            'should not remove a role that is still related to users',
            async () => {
                // setup
                const id = 1;

                // exercice and verify
                await expect(RoleService.remove(id)).to.reject(
                    Error,
                    APIError.RESOURCE_RELATION().message
                );
            },
            { seeds: ['users', 'users_roles'] }
        );

        it(
            'should remove a role and unrelate its permissions',
            async knex => {
                // setup
                const id = 1;

                // exercise
                const result = await RoleService.remove(id);

                // verify
                expect(result).to.be.equal(1);
                const permissions = await knex('roles_permissions')
                    .select('permission_id')
                    .where({ role_id: id });
                expect(permissions.length).to.equal(0);
            },
            { seeds: ['permissions', 'roles_permissions'] }
        );

        it(
            "should not upsert a role's permissions if the role doesn't exist",
            async () => {
                // setup
                const id = 0;

                // exercice and verify
                await expect(RoleService.upsertPermissions(id, [])).to.reject(
                    Error,
                    APIError.RESOURCE_NOT_FOUND().message
                );
            },
            { models: ['authorization/permission'] }
        );

        it(
            "should not upsert a role's permissions if the permissions doesn't exist",
            async () => {
                // setup
                const id = 1;
                const permissionIds = [2, 5, 6, 17]; // last permission id does not exist

                // exercice and verify
                await expect(RoleService.upsertPermissions(id, permissionIds)).to.reject(
                    Error,
                    APIError.RESOURCE_NOT_FOUND().message
                );
            },
            { seeds: ['permissions'], models: ['authorization/permission'] }
        );

        it(
            "should upsert a role's permissions ",
            async () => {
                // setup
                const expectedRole = {
                    id: 2,
                    name: 'guest',
                    description: 'guest'
                };
                const permissions = [2, 5, 6];

                // exercice
                const result = await RoleService.upsertPermissions(expectedRole.id, permissions);

                // verify
                expect(result.permissions.length).to.equal(permissions.length);
                result.permissions.forEach(permission => {
                    expect(permission).to.be.instanceOf(PermissionModel);
                    expect(permissions).to.include(permission.id);
                });
                Object.entries(expectedRole).forEach(([property, value]) =>
                    expect(result[property]).to.be.equal(value)
                );
            },
            { seeds: ['permissions'], models: ['authorization/permission'] }
        );
    },
    {
        seeds: ['roles'],
        models: ['authorization/role']
    }
);
