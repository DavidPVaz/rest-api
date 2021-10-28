const AbstractDao = require('dao/abstract-dao');
const Permission = require('models/authorization/permission');
/**
 * A more especific type of `DAO`, intended to work with `Permission` Model.
 * @extends {AbstractDao}
 */
class PermissionDao extends AbstractDao {
    /**
     * Creates an instance of `UserDao`.
     * Call to super with the `User` Model.
     */
    constructor() {
        super(Permission);
    }
}

module.exports = new PermissionDao();
