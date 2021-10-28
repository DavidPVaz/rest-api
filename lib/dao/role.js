const AbstractDao = require('dao/abstract-dao');
const Role = require('models/authorization/role');
/**
 * A more especific type of `DAO`, intended to work with `Role` Model.
 * @extends {AbstractDao}
 */
class RoleDao extends AbstractDao {
    /**
     * Creates an instance of `UserDao`.
     * Call to super with the `User` Model.
     */
    constructor() {
        super(Role);
    }
}

module.exports = new RoleDao();
