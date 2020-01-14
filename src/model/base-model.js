import { Model } from 'objection';
import { knex } from '../../db/knex';

Model.knex(knex);

class BaseModel extends Model {

    static get modelPaths() {
        return [ __dirname ];
    }

    $beforeInsert() {
        this.createdAt = new Date();
    }

    $beforeUpdate() {
        this.updatedAt = new Date();
    }

    $formatJson(json) {
        const result = super.$formatJson(json);

        Object.keys(result).forEach(key => {
            if (result[key] === null) {
                delete result[key];
            }
        });

        return result;
    }
}

export { BaseModel };
