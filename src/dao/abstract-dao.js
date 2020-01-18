/**
 * A generic abstract DAO that encapsulate a provided Model Entity with generic methods to query the database
 * 
 * Open for extension, closed for modification
 * 
 * @abstract AbstractDao
 */
class AbstractDao {
    /**
     * Constructor to be called in subclasses
     * 
     * @param {Object} model - The Model Entity to be used
     */
    constructor(model) {
        this.model = model;
    }

    /**
     * Method to get this DAO Model Entity
     * 
     * To be used in Service, to bind this model to a trasaction {@link https://vincit.github.io/objection.js/}
     * 
     * @returns {Object} This model
     */
    getModel() {
        return this.model;
    }

    /**
     * Performs a query that fetch all rows of this Model database table
     *
     * @returns {Promise<Object[]>} A Promise to be either resolved with an array of all table data ordered by id 
     * or rejected with an Error
     */
    list() {
        return this.model.query().orderBy('id');
    }

    /**
     * Performs a query that fetch a especific row in this Model database table
     *
     * @param {number} id - Id number to identify the table entry
     * @returns {Promise<Object>} A Promise to be either resolved with the queried data or rejected with an Error
     */
    findById(id) {
        return this.model.query().findById(id);
    }

    /**
     * Performs a query that fetch a especific row in this Model database table
     *
     * @param {string} field - Identify the column name of the table
     * @param {(string|number|boolean)} value - Value associated with that column
     * @returns {Promise<Object>} A Promise to be either resolved with the queried data or rejected with an Error
     */
    findBy(field, value) {
        return this.model.query().findOne(field, value);
    }

    /**
     * Performs a query that create a new row in this Model database table 
     *
     * @param {Object} txModel - A copy of the Model that was bound to a transaction
     * @param {Object} model - The object with the data to be inserted in the database
     * @returns {Promise<Object>} A Promise to be either resolved with the recently inserted data or rejected with an Error
     */
    create(txModel, model) {
        return txModel.query().insert(model);
    }

    /**
     * Performs a query that update an existing row in this Model database table 
     *
     * @param {Object} txModel - A copy of the Model that was bound to a transaction
     * @param {number} id - Id number to identify the table entry 
     * @param {Object} model - The object with the updated data
     * @returns {Promise<number>} A Promise to be either resolved with the number of updated rows or rejected with an Error
     */
    edit(txModel, id, model) {
        return txModel.query().patch(model).where({ id });
    }

    /**
     * Performs a query that delete an existing row in this Model database table 
     *
     * @param {Object} txModel - A copy of the Model that was bound to a transaction
     * @param {number} id - Id number to identify the table entry 
     * @returns {Promise<number>} A Promise to be either resolved with the number of deleted rows or rejected with an Error
     */
    delete(txModel, id) {
        return txModel.query().deleteById(id);
    }
}
/** 
 * @module AbstractDao 
 */
export { AbstractDao };
