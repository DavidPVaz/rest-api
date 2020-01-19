/** 
 * @file This module assigns each configuration object to a Router HTTPS request method.
 * 
 * @see module:Routes
 */
import express from 'express';
import routes from './routes';

const router = express.Router();

router.post(routes.login.path, routes.login.middleware, routes.login.handler);

router.get(routes.getUserList.path, routes.getUserList.middleware, routes.getUserList.handler);
router.get(routes.getUser.path, routes.getUser.middleware, routes.getUser.handler);
router.post(routes.postUser.path, routes.postUser.middleware, routes.postUser.handler);
router.put(routes.putUser.path, routes.putUser.middleware, routes.putUser.handler);
router.delete(routes.deleteUser.path, routes.deleteUser.middleware, routes.deleteUser.handler);
/** 
 * @module Router
 */
export { router };
