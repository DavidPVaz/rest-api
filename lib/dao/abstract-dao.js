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
    list() {
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
     * @param {string} field - Identify the column name of the table.
     * @param {(string|number} value - Value associated with that column.
     * @return {Objection.QueryBuilder} The associated query.
     */
    findOne(field, value) {
        return this.model.query().findOne(field, value);
    }

    /**
     * Performs a query that `create` a new row in this Model database table.
     * @param {Object} txModel - A copy of the Model that was bound to a transaction.
     * @param {Object} mentity - The object with the data to be inserted in the database.
     * @return {Objection.QueryBuilder} The associated query.
     */
    create(txModel, entity) {
        return txModel.query().insert(entity);
    }

    /**
     * Performs a query that `update` an existing row in this Model database table.
     * @param {Object} txModel - A copy of the Model that was bound to a transaction.
     * @param {number} id - Id number to identify the table entry.
     * @param {Object} entity - The object with the updated data.
     * @return {Objection.QueryBuilder} The associated query.
     */
    edit(txModel, id, entity) {
        return txModel.query().patch(entity).findById(id);
    }

    /**
     * Performs a query that `delete` an existing row in this Model database table.
     * @param {Object} txModel - A copy of the Model that was bound to a transaction.
     * @param {number} id - Id number to identify the table entry.
     * @return {Objection.QueryBuilder} The associated query.
     */
    delete(txModel, id) {
        return txModel.query().deleteById(id);
    }
};
