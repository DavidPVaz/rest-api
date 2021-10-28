/**
 * @module BaseModel
 * @file The BaseModel is a super class for all Models, where shared configuration is defined.
 * @link https://vincit.github.io/objection.js/
 */
const { Model } = require('objection');

class BaseModel extends Model {
    static get modelPaths() {
        return [__dirname];
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

module.exports = BaseModel;

/**
 * Maximum range number for postgresql integer numeric type
 * @type {number}
 */
BaseModel.MAX_ID = 2147483647;
