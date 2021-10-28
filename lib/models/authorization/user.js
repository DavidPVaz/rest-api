/**
 * @module User
 * @file A BaseModel subclass represents a database table.
 * @link https://vincit.github.io/objection.js/
 */
const BaseModel = require('models/base');

class User extends BaseModel {
    static get tableName() {
        return 'users';
    }

    static get idColumn() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['name', 'username', 'password', 'email'],
            properties: {
                id: { type: 'integer' },
                active: {
                    type: 'boolean'
                },
                name: {
                    type: 'string',
                    minLength: User.NAME_MIN_LENGTH,
                    maxLength: User.NAME_MAX_LENGTH
                },
                username: {
                    type: 'string',
                    minLength: User.USERNAME_MIN_LENGTH,
                    maxLength: User.USERNAME_MAX_LENGTH
                },
                email: {
                    type: 'string',
                    format: 'email'
                },
                password: {
                    type: 'string',
                    minLength: User.PASSWORD_MIN_LENGTH,
                    maxLength: User.PASSWORD_MAX_LENGTH
                }
            }
        };
    }

    $formatJson(json) {
        const { password, ...result } = super.$formatJson(json);
        return result;
    }
}

module.exports = User;

/**
 * @type {number}
 */
User.NAME_MIN_LENGTH = 6;

/**
 * @type {number}
 */
User.NAME_MAX_LENGTH = 64;

/**
 * @type {number}
 */
User.USERNAME_MIN_LENGTH = 3;

/**
 * @type {number}
 */
User.USERNAME_MAX_LENGTH = 32;

/**
 * @type {number}
 */
User.PASSWORD_MIN_LENGTH = 8;

/**
 * @type {number}
 */
User.PASSWORD_MAX_LENGTH = 60;

/**
 * @type {number}
 */
User.EMAIL_MAX_LENGTH = 64;
