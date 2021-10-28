const TestRunner = require('test/fixtures/test-runner');
const UserService = require('modules/authorization/service/user');
//const { stub, match, spy, useFakeTimers } = require('sinon');
//const ApiError = require('errors/api-error');

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
    },
    {
        seeds: ['users']
    }
);
