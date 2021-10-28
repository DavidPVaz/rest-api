/**
 * @module Role
 * @file A BaseModel subclass represents a database table.
 * @link https://vincit.github.io/objection.js/
 */
const BaseModel = require('models/base');

/**
 * Role model class
 * @class Role
 * @extends {BaseModel}
 */
class Role extends BaseModel {
    /**
     * Gets the database table name
     * @readonly
     * @static
     * @memberof Role
     * @returns {string} the database table name
     */
    static get tableName() {
        return 'roles';
    }

    /**
     * Gets the table id column
     * @readonly
     * @static
     * @memberof Role
     * @returns {string} the table id column
     */
    static get idColumn() {
        return 'id';
    }

    /**
     * Get the model properties to perform search on
     * @readonly
     * @static
     * @memberof Role
     * @returns {Array.<string>} the model properties
     */
    static get searchFields() {
        return ['name', 'description'];
    }

    /**
     * Get the json schema for model validation
     * @readonly
     * @static
     * @memberof Role
     * @returns {Object} the json schema
     */
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['name'],
            properties: {
                id: {
                    type: 'integer'
                },
                name: {
                    type: 'string',
                    minLength: Role.NAME_MIN_LENGTH,
                    maxLength: Role.NAME_MAX_LENGTH
                },
                description: {
                    type: 'string',
                    maxLength: Role.DESC_MAX_LENGTH
                }
            }
        };
    }

    /**
     * Gets the model relations
     * @readonly
     * @static
     * @memberof Role
     * @returns {Object} the model relations
     */
    static get relationMappings() {
        return {
            users: {
                relation: BaseModel.ManyToManyRelation,
                modelClass: 'authorization/user',
                join: {
                    from: 'roles.id',
                    through: {
                        from: 'users_roles.roleId',
                        to: 'users_roles.userId'
                    },
                    to: 'users.id'
                }
            },
            permissions: {
                relation: BaseModel.ManyToManyRelation,
                modelClass: 'authorization/permission',
                join: {
                    from: 'roles.id',
                    through: {
                        from: 'roles_permissions.roleId',
                        to: 'roles_permissions.permissionId'
                    },
                    to: 'permissions.id'
                }
            }
        };
    }
}

module.exports = Role;

/**
 * @type {number}
 */
Role.NAME_MIN_LENGTH = 3;

/**
 * @type {number}
 */
Role.NAME_MAX_LENGTH = 32;

/**
 * @type {number}
 */
Role.DESC_MAX_LENGTH = 1024;
