import { Dao } from './generic-dao';
import { User } from '../model/user';

class UserDao extends Dao {
    constructor() {
        super(User);
    }
}

export default new UserDao();
