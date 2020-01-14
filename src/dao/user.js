import { Dao } from './generic-dao';
import { User } from '../model/user';

const UserDao = new Dao(User);

export { UserDao };
