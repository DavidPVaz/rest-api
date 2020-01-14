import { Model } from 'objection';
import { knex } from '../../db/knex';

Model.knex(knex);

class BaseModel extends Model {

    static get modelPaths() {
        return [ __dirname ];
    }

    $beforeInsert() {
        this.created_at = new Date();
    }

    $beforeUpdate() {
        this.updated_at = new Date();
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
