const AbstractDao = require('dao/abstract-dao');
const Resource = require('models/authorization/resource');
/**
 * A more especific type of `DAO`, intended to work with `Resource` Model.
 * @extends {AbstractDao}
 */
class ResourceDao extends AbstractDao {
    /**
     * Creates an instance of `UserDao`.
     * Call to super with the `User` Model.
     */
    constructor() {
        super(Resource);
    }
}

module.exports = new ResourceDao();
