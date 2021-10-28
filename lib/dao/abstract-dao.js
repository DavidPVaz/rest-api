/**
 * A generic `abstract DAO` that encapsulate a provided Model Entity with `generic methods` to query the database.
 * Open for extension, closed for modification.
 * @abstract AbstractDao
 */
module.exports = class AbstractDao {
    /**
     * Constructor to be called in subclasses.
     * @param {Object} model - The Model to be used.
     */
    constructor(model) {
        this.model = model;
    }

    /**
     * Gets this DAO Model.
     * To be used in `Service` for `trasaction` binding or to create a query. {@link https://vincit.github.io/objection.js/}
     * @return {Object} `this.model`.
     */
    getModel() {
        return this.model;
    }

    /**
     * Performs a query that `fetch` all rows of this Model database tables
     * @return {Objection.QueryBuilder} The associated query.
     */
    findAll() {
        return this.model.query().orderBy('id');
    }

    /**
     * Performs a query that `fetch` a especific row in this Model database table.
     * @param {number} id - Id number to identify the table entry.
     * @return {Objection.QueryBuilder} The associated query.
     */
    findById(id) {
        return this.model.query().findById(id);
    }

    /**
     * Performs a query that `fetch` a especific row in this Model database table.
     * @param {Object|string|number} values - any values used to query.
     * @return {Objection.QueryBuilder} The associated query.
     */
    findOne(...values) {
        return this.model.query().findOne(...values);
    }

    /**
     * Performs a query that `create` a new row in this Model database table.
     * @param {Object} mentity - The object with the data to be inserted in the database.
     * @return {Objection.QueryBuilder} The associated query.
     */
    create(entity) {
        return this.model.query().insert(entity);
    }

    /**
     * Performs a query that `update` an existing row in this Model database table.
     * @param {number} id - Id number to identify the table entry.
     * @param {Object} entity - The object with the updated data.
     * @return {Objection.QueryBuilder} The associated query.
     */
    edit(id, entity) {
        return this.model.query().patch(entity).findById(id);
    }

    /**
     * Performs a query that `delete` an existing row in this Model database table.
     * @param {number} id - Id number to identify the table entry.
     * @return {Objection.QueryBuilder} The associated query.
     */
    delete(id) {
        return this.model.query().deleteById(id);
    }
};
