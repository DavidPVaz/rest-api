import express from 'express';
import routes from './routes';

const router = express.Router();

router.get(routes.getUserList.path, routes.getUserList.handler);
router.get(routes.getUser.path, routes.getUser.handler);
router.post(routes.postUser.path, routes.postUser.middleware, routes.postUser.handler);
router.put(routes.putUser.path, routes.putUser.middleware, routes.putUser.handler);
router.delete(routes.deleteUser.path, routes.deleteUser.handler);

export { router };
