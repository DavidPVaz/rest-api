/**
 * @module User
 * @file A BaseModel subclass represents a database table.
 * @link https://vincit.github.io/objection.js/
 */
const BaseModel = require('models/base');

class User extends BaseModel {
    /**
     * Gets the database table name
     * @readonly
     * @static
     * @memberof User
     * @returns {string} the database table name
     */
    static get tableName() {
        return 'users';
    }

    /**
     * Gets the table id column
     * @readonly
     * @static
     * @memberof User
     * @returns {string} the table id column
     */
    static get idColumn() {
        return 'id';
    }

    /**
     * Get the model properties to perform search on
     * @readonly
     * @static
     * @memberof User
     * @returns {Array.<string>} the model properties
     */
    static get searchFields() {
        return ['name', 'username', 'email'];
    }

    /**
     * Get the json schema for model validation
     * @readonly
     * @static
     * @memberof User
     * @returns {Object} the json schema
     */
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

    /**
     * Gets the model relations
     * @readonly
     * @static
     * @memberof User
     * @returns {Object} the model relations
     */
    static get relationMappings() {
        return {
            roles: {
                relation: BaseModel.ManyToManyRelation,
                modelClass: 'authorization/role',
                join: {
                    from: 'users.id',
                    through: {
                        from: 'users_roles.userId',
                        to: 'users_roles.roleId'
                    },
                    to: 'roles.id'
                }
            }
        };
    }

    /**
     * Converts the JSON object from the external to the internal format.
     * @memberof UserModel
     * @param {Object} json the object in the external format
     * @return {Object} the object in the internal format
     */
    $parseJson(json) {
        const result = super.$formatJson(json);

        if (result.email) {
            result.email = result.email.toLowerCase();
        }

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
