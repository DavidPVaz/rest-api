import express from 'express';
import Routes from './enum';
import UserController from '../controller/user';

const Router = express.Router();

Router.get(Routes.getUserList, [ UserController.list ]);
Router.get(Routes.getUser, [ UserController.get ]);
Router.post(Routes.postUser, [ UserController.create ]);
Router.put(Routes.putUser, [ UserController.edit ]);
Router.delete(Routes.deleteUser, [ UserController.deleteUser ]);

export { Router };
