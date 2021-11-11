const TestRunner = require('test/fixtures/test-runner');
const UserService = require('modules/authorization/services/user');
const UserModel = require('models/authorization/user');
const RoleModel = require('models/authorization/role');
const APIError = require('errors/api-error');

const { describe, it, expect } = (exports.lab = TestRunner.script());
const usernameErrorMessage = 'That username already exists';
const emailErrorMessage = 'That email already exists';

describe(
    'Service: user',
    () => {
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
            result.forEach(({ id }) => expect(expectedIds.includes(id)).to.be.true());
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

            //TODO find a way to omit password from the model
            // verify
            expect(result).to.be.instanceOf(UserModel);
            Object.entries(expectedUser).forEach(([property, value]) =>
                expect(result[property]).to.be.equal(value)
            );
            //expect(result.password).to.be.undefined();
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

            //TODO find a way to omit password from the model
            // verify
            expect(result).to.be.instanceOf(UserModel);
            Object.entries(expectedUser).forEach(([property, value]) =>
                expect(result[property]).to.be.equal(value)
            );
            //expect(result.password).to.be.undefined();
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

                //TODO find a way to omit password from the model
                // verify
                expect(result).to.be.instanceOf(UserModel);
                expect(result.roles).to.be.array();
                expect(result.roles.length).to.equal(expectedUser.roles.length);
                expect(result.roles[0]).to.be.instanceOf(RoleModel);
                Object.entries(expectedUser).forEach(([property, value]) =>
                    expect(result[property]).to.be.equal(value)
                );
                //expect(result.password).to.be.undefined();
            },
            { seeds: ['roles', 'users_roles'] }
        );

        it(
            'should create a new user',
            async () => {
                // setup
                const newUser = {
                    name: 'nice name',
                    username: 'username',
                    email: 'email@gmail.com',
                    password: 'password'
                };

                // exercise
                const result = await UserService.create(newUser);

                //TODO find  a way to omit password from the model
                // verify
                expect(result).to.be.instanceOf(UserModel);
                expect(result.id).to.be.number();
                Object.entries(newUser).forEach(([property, value]) =>
                    expect(result[property]).to.be.equal(value)
                );
                //expect(result.password).to.be.undefined();
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
                username: 'super username',
                email: 'email@gmail.com'
            };

            // exercise
            const result = await UserService.update(id, user);

            //TODO find  a way to omit password from the model
            // verify
            expect(result).to.be.instanceOf(UserModel);
            expect(result.id).to.be.equal(id);
            Object.entries(user).forEach(([property, value]) =>
                expect(result[property]).to.be.equal(value)
            );
            //expect(result.password).to.be.undefined();
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
    },
    {
        seeds: ['users'],
        models: ['authorization/user']
    }
);
