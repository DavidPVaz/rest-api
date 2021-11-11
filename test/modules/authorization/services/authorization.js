const TestRunner = require('test/fixtures/test-runner');
const AuthorizationService = require('modules/authorization/services/authorization');
const APIError = require('errors/api-error');

const { describe, it, expect } = (exports.lab = TestRunner.script());

describe(
    'Service: authorization',
    () => {
        it('authorizes a user that has a role with the right permissions', async () => {
            // exercise
            const result = await AuthorizationService.canUser('admin', 'create', 'user');

            // validate
            expect(result).to.be.true();
        });

        it('authorizes a user that has multiple roles with the right permissions', async () => {
            // exercise
            const result = await AuthorizationService.canUser('admin', 'read', 'role');

            // validate
            expect(result).to.be.true();
        });

        it('does not authorize a user that has no roles with the right permissions', async () => {
            // exercise
            const result = await AuthorizationService.canUser('guest', 'create', 'user');

            // validate
            expect(result).to.be.false();
        });

        it('handles authorization for a non existing user', async () => {
            // exercise and validate
            const result = await AuthorizationService.canUser('invalid user', 'read', 'role');

            // validate
            expect(result).to.be.false();
        });

        it('does not authorize an inactive user', async () => {
            // exercise
            const result = await AuthorizationService.canUser('notactive', 'read', 'role');

            // validate
            expect(result).to.be.false();
        });

        it('handles authorization for a non existing role', async () => {
            // exercise and validate
            await expect(AuthorizationService.canRole('invalid', 'read', 'role')).to.reject(
                Error,
                APIError.RESOURCE_NOT_FOUND().message
            );
        });

        it('handles authorization for a non existing resource', async () => {
            // exercise and validate
            await expect(
                AuthorizationService.canRole('admin', 'read', 'invalid resource')
            ).to.reject(Error, APIError.RESOURCE_NOT_FOUND().message);
        });
    },
    {
        seeds: ['users', 'roles', 'resources', 'permissions', 'users_roles', 'roles_permissions'],
        models: ['authorization/user', 'authorization/role', 'authorization/resource']
    }
);
