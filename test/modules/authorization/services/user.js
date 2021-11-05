const TestRunner = require('test/fixtures/test-runner');
const UserService = require('modules/authorization/services/user');
const UserModel = require('models/authorization/user');
const RoleModel = require('models/authorization/role');
const APIError = require('errors/api-error');
//const { stub, match, spy, useFakeTimers } = require('sinon');

const { describe, it, expect } = (exports.lab = TestRunner.script());

describe(
    'Service: user',
    () => {
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

                //TODO find a way to omit password from the model
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
    },
    {
        seeds: ['users'],
        models: ['authorization/user']
    }
);
