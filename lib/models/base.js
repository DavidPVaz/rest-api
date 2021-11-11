/**
 * @module BaseModel
 * @file The BaseModel is a super class for all Models, where shared configuration is defined.
 * @link https://vincit.github.io/objection.js/
 */
const { Model } = require('objection');
const OmitQueryBuilderMixin = require('./omit-mixin');

class BaseModel extends Model {
    static get modelPaths() {
        return [__dirname];
    }

    static get QueryBuilder() {
        return OmitQueryBuilderMixin(Model.QueryBuilder);
    }

    /**
     * Converts the JSON object from the internal to the external format.
     * @memberof BaseModel
     * @param {Object} json the object in the internal format
     * @return {Object} the object in the external format
     */
    $formatJson(json) {
        const result = super.$formatJson(json);

        Object.entries(result).forEach(([key, value]) => {
            if (value === null) {
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
