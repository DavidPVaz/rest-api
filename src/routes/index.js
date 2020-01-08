import express from 'express';
import Routes from './routes';

const Router = express.Router();

Router.get(Routes.getUserList.path, Routes.getUserList.handler);
Router.get(Routes.getUser.path, Routes.getUser.handler);
Router.post(Routes.postUser.path, Routes.postUser.middleware, Routes.postUser.handler);
Router.put(Routes.putUser.path, Routes.putUser.middleware, Routes.putUser.handler);
Router.delete(Routes.deleteUser.path, Routes.deleteUser.handler);

export { Router };
