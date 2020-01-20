import { AbstractDao } from './abstract-dao';
import { User } from '../model/user';
/**
 * A more especific type of `DAO`, intended to work with `User` Model.
 *
 * @extends {AbstractDao}
 */
class UserDao extends AbstractDao {
    /**
     * Creates an instance of `UserDao`.
     * 
     * Call to super with the `User` Model.
     */
    constructor() {
        super(User);
    }
}
/** 
 * @module UserDao 
 */
export default new UserDao();
