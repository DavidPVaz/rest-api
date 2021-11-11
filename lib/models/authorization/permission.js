/**
 * @module Permission
 * @file A BaseModel subclass represents a database table.
 * @link https://vincit.github.io/objection.js/
 */
const BaseModel = require('models/base');
const Actions = require('enums/actions');

/**
 * Permission model class
 * @class Permission
 * @extends {BaseModel}
 */
class Permission extends BaseModel {
    /**
     * Gets the database table name
     * @readonly
     * @static
     * @memberof Permission
     * @returns {string} the database table name
     */
    static get tableName() {
        return 'permissions';
    }

    /**
     * Gets the table id column
     * @readonly
     * @static
     * @memberof Permission
     * @returns {string} the table id column
     */
    static get idColumn() {
        return 'id';
    }

    /**
     * Get the model properties to perform search on
     * @readonly
     * @static
     * @memberof Permission
     * @returns {Array.<string>} the model properties
     */
    static get searchFields() {
        return ['description', 'action'];
    }

    /**
     * Get the json schema for model validation
     * @readonly
     * @static
     * @memberof Permission
     * @returns {Object} the json schema
     */
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['action', 'resourceId', 'description'],
            properties: {
                id: {
                    type: 'integer'
                },
                resourceId: {
                    type: 'integer'
                },
                action: {
                    type: 'string',
                    enum: Object.values(Actions),
                    default: Actions.READ
                },
                description: {
                    type: 'string',
                    maxLength: Permission.DESCRIPTION_MAX_LENGTH
                }
            }
        };
    }

    /**
     * Gets the model relations
     * @readonly
     * @static
     * @memberof Permission
     * @returns {Object} the model relations
     */
    static get relationMappings() {
        return {
            resource: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: 'authorization/resource',
                join: {
                    from: 'permissions.resourceId',
                    to: 'resources.id'
                }
            },
            roles: {
                relation: BaseModel.ManyToManyRelation,
                modelClass: 'authorization/role',
                join: {
                    from: 'permissions.id',
                    through: {
                        from: 'roles_permissions.permissionId',
                        to: 'roles_permissions.roleId'
                    },
                    to: 'roles.id'
                }
            }
        };
    }
}

module.exports = Permission;

/**
 * @type {number}
 */
Permission.DESCRIPTION_MAX_LENGTH = 2048;
