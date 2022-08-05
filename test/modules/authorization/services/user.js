const Config = require('config');
const TestRunner = require('test/fixtures/test-runner');
const UserService = require('modules/authorization/services/user');
const UserModel = require('models/authorization/user');
const RoleModel = require('models/authorization/role');
const Authentication = require('utils/auth');
const APIError = require('errors/api-error');

const { describe, it, expect } = (exports.lab = TestRunner.script());
const usernameErrorMessage = 'That username already exists';
const emailErrorMessage = 'That email already exists';

describe(
    'Service: user',
    () => {
        it('should authenticate an user', async () => {
            // setup
            const user = {
                username: 'admin',
                password: 'adminadmin'
            };
            const expected = Authentication.getToken(1, Config.authentication.renewIn);

            // exercise
            const result = await UserService.authenticate(user);

            // verify
            expect(result).to.be.equal(expected);
        });

        it('does not authenticate an user with invalid username', async () => {
            // setup
            const user = {
                username: 'invalid',
                password: 'admin'
            };

            // exercise and verify
            await expect(UserService.authenticate(user)).to.reject(
                Error,
                APIError.AUTH_INVALID_CREDENTIALS().message
            );
        });

        it('does not authenticate an user with invalid password', async () => {
            // setup
            const user = {
                username: 'admin',
                password: 'invalid'
            };

            // exercise and verify
            await expect(UserService.authenticate(user)).to.reject(
                Error,
                APIError.AUTH_INVALID_CREDENTIALS().message
            );
        });

        it('should count users', async () => {
            // setup
            const expectedCount = 2;

            // exercise
            const result = await UserService.count();

            // verify
            expect(result).to.be.number();
            expect(result).to.be.equal(expectedCount);
        });

        it('should list users', async () => {
            // setup
            const expectedIds = [1, 2];

            // exercise
            const result = await UserService.list();

            // verify
            expect(result).to.be.array();
            expect(result).to.have.length(expectedIds.length);
            result.forEach(user => {
                expect(expectedIds.includes(user.id)).to.be.true();
                expect(user.password).to.be.undefined();
            });
        });

        it('should find an user by id', async () => {
            // setup
            const expectedUser = {
                id: 1,
                name: 'Admin User',
                username: 'admin',
                email: 'admin@gmail.com',
                active: 1 // true
            };

            // exercise
            const result = await UserService.findById(expectedUser.id);

            // verify
            expect(result).to.be.instanceOf(UserModel);
            expect(result.password).to.be.undefined();
            Object.entries(expectedUser).forEach(([property, value]) =>
                expect(result[property]).to.be.equal(value)
            );
        });

        it('should not find an user that does not exist', async () => {
            // setup
            const id = 0;

            // exercise and verify
            await expect(UserService.findById(id)).to.reject(
                Error,
                APIError.RESOURCE_NOT_FOUND().message
            );
        });

        it('should find an user by some value', async () => {
            // setup
            const expectedUser = {
                id: 1,
                name: 'Admin User',
                username: 'admin',
                email: 'admin@gmail.com',
                active: 1 // true
            };

            // exercise
            const result = await UserService.findOne({ email: expectedUser.email });

            // verify
            expect(result).to.be.instanceOf(UserModel);
            expect(result.password).to.be.undefined();
            Object.entries(expectedUser).forEach(([property, value]) =>
                expect(result[property]).to.be.equal(value)
            );
        });

        it(
            'should find an user by some value and eager fetch his roles',
            async () => {
                // setup
                const criteria = { withRoles: true };
                const expectedUser = {
                    id: 2,
                    name: 'Guest User',
                    username: 'guest',
                    email: 'guest@gmail.com',
                    active: 1, // true
                    roles: [
                        {
                            id: 2,
                            name: 'guest',
                            description: 'guest',
                            createdAt: null,
                            updatedAt: null
                        }
                    ]
                };

                // exercise
                const result = await UserService.findOne({ email: expectedUser.email }, criteria);

                // verify
                expect(result).to.be.instanceOf(UserModel);
                expect(result.password).to.be.undefined();
                expect(result.roles).to.be.array();
                expect(result.roles.length).to.equal(expectedUser.roles.length);
                expect(result.roles[0]).to.be.instanceOf(RoleModel);
                Object.entries(expectedUser).forEach(([property, value]) =>
                    expect(result[property]).to.be.equal(value)
                );
            },
            { seeds: ['roles', 'users_roles'] }
        );

        it(
            'should create a new user',
            async () => {
                // setup
                const password = 'password';
                const newUser = {
                    name: 'nice name',
                    username: 'username',
                    email: 'CAPSEMAIL@gmail.com'
                };

                // exercise
                const result = await UserService.create({ password, ...newUser });

                // verify
                expect(result).to.be.instanceOf(UserModel);
                expect(result.id).to.be.number();
                Object.entries(newUser).forEach(([property, value]) =>
                    expect(result[property]).to.be.equal(
                        property === 'email' ? value.toLowerCase() : value
                    )
                );
            },
            { seeds: [], overwrite: true }
        );

        it('should not create a new user if we already have an user with the same username', async () => {
            // setup
            const newUser = {
                name: 'nice name',
                username: 'admin',
                email: 'email@gmail.com',
                password: 'password'
            };

            // exercise and verify
            await expect(UserService.create(newUser)).to.reject(Error, usernameErrorMessage);
        });

        it('should not create a new user if we already have an user with the same email', async () => {
            // setup
            const newUser = {
                name: 'nice name',
                username: 'potato',
                email: 'admin@gmail.com',
                password: 'password'
            };

            // exercise and verify
            await expect(UserService.create(newUser)).to.reject(Error, emailErrorMessage);
        });

        it('should update a user', async () => {
            // setup
            const id = 2;
            const user = {
                name: 'nice name',
                password: 'pretty pass'
            };

            // exercise
            const result = await UserService.update(id, user);

            // verify
            expect(result).to.be.instanceOf(UserModel);
            expect(result.id).to.be.equal(id);
            Object.entries(user).forEach(([property, value]) =>
                expect(result[property]).to.be.equal(value)
            );
        });

        it(
            'should not update a user that does not exist',
            async () => {
                // setup
                const id = 0;
                const user = {};

                // exercise and verify
                await expect(UserService.update(id, user)).to.reject(
                    Error,
                    APIError.RESOURCE_NOT_FOUND().message
                );
            },
            { seeds: [], overwrite: true }
        );

        it('should not update a new user if we already have an user with the same username', async () => {
            // setup
            const id = 2;
            const user = { username: 'admin' };

            // exercise and verify
            await expect(UserService.update(id, user)).to.reject(Error, usernameErrorMessage);
        });

        it('should not update a new user if we already have an user with the same email', async () => {
            // setup
            const id = 2;
            const user = { email: 'admin@gmail.com' };

            // exercise and verify
            await expect(UserService.update(id, user)).to.reject(Error, emailErrorMessage);
        });

        it('should remove an user', async () => {
            // setup
            const id = 2;

            // exercise
            const result = await UserService.remove(id);

            // verify
            expect(result).to.be.equal(1);
        });

        it(
            'should not remove an user that does not exist',
            async () => {
                // setup
                const id = 0;

                // exercice and verify
                await expect(UserService.remove(id)).to.reject(
                    Error,
                    APIError.RESOURCE_NOT_FOUND().message
                );
            },
            { seeds: [], overwrite: true }
        );

        it("should not upsert a user's roles if the user doesn't exist", async () => {
            // setup
            const id = 0;

            // exercice and verify
            await expect(UserService.upsertRoles(id, [])).to.reject(
                Error,
                APIError.RESOURCE_NOT_FOUND().message
            );
        });

        it(
            "should not upsert a user's roles if the role doesn't exist",
            async () => {
                // setup
                const id = 1;
                const roleIds = [1, 3]; // last role id does not exist

                // exercice and verify
                await expect(UserService.upsertRoles(id, roleIds)).to.reject(
                    Error,
                    APIError.RESOURCE_NOT_FOUND().message
                );
            },
            { seeds: ['roles'], models: ['authorization/role'] }
        );

        it(
            "should upsert a role's permissions ",
            async () => {
                // setup
                const expectedUser = {
                    id: 1,
                    username: 'admin',
                    email: 'admin@gmail.com'
                };
                const roleIds = [2];

                // exercice
                const result = await UserService.upsertRoles(expectedUser.id, roleIds);

                // verify
                expect(result.roles.length).to.equal(roleIds.length);
                result.roles.forEach(role => {
                    expect(role).to.be.instanceOf(RoleModel);
                    expect(roleIds).to.include(role.id);
                });
                Object.entries(expectedUser).forEach(([property, value]) =>
                    expect(result[property]).to.be.equal(value)
                );
            },
            { seeds: ['roles'], models: ['authorization/role'] }
        );
    },
    {
        seeds: ['users'],
        models: ['authorization/user']
    }
);
