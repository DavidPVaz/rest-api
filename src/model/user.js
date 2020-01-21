/** 
 * @file A BaseModel subclass represents a database table.
 * 
 * @link https://vincit.github.io/objection.js/
 */
import { BaseModel } from './base-model';

class User extends BaseModel {

    static get tableName() {
        return 'users';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: [ 'username', 'password', 'email' ],
            properties: {
                id: { type: 'integer' },
                username: { type: 'string' },
                password: { type: 'string' },
                email: { type: 'string' },
                admin: { type: 'boolean' }
            }
        };
    }
    
    $formatJson(json) {
        const { password, admin, ...result } = super.$formatJson(json);

        return result;
    }
}

export { User };
