import https from 'https';
import express from 'express';
import cors from 'cors';
/*
import { Router } from '../routes';
*/
import tlsCredentials from '../../config';


import Routes from '../routes/enum';
import UserController from '../controller/user';

/*
import { validateLoginParameters } from '../../utils/validation';
*/

const app = express();

app.disable('x-powered-by');
app.disable('etag');

app.use(express.json());
app.use(cors({
    origin: '*',
    methods: [ 'GET', 'POST', 'PUT', 'DELETE' ],
    maxAge: 3600
}));


app.get(process.env.API_BASE + Routes.getUserList, UserController.list);
app.get(process.env.API_BASE + Routes.getUser, UserController.get);
app.post(process.env.API_BASE + Routes.postUser, UserController.create);
app.put(process.env.API_BASE + Routes.putUser, UserController.edit);
app.delete(process.env.API_BASE + Routes.deleteUser, UserController.deleteUser);

/*
app.post('/api', (req, res) => {
    const { error } = validateLoginParameters(req);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    return res.send("Yay");

});
*/

const server = https.createServer(tlsCredentials, app);

export { server };
