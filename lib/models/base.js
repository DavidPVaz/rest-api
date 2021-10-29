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

    static get QueryBuilder() {
        return Model.QueryBuilder;
    }

    /**
     * Converts the JSON object from the internal to the external format.
     * @memberof BaseModel
     * @param {Object} json the object in the internal format
     * @return {Object} the object in the external format
     */
    $formatJson(json) {
        const result = super.$formatJson(json);

        if (this.constructor.hiddenFields) {
            this.constructor.hiddenFields.forEach(field => delete result[field]);
        }

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
