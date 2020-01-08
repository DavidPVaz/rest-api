import https from 'https';
import express from 'express';
import cors from 'cors';
import tlsCredentials from '../../config';

/*
import { validateLoginParameters } from '../../utils/validation';
*/
import UserController from '../controller/user';

const app = express();

app.disable('x-powered-by');
app.disable('etag');

app.use(express.json());
app.use(cors({
    origin: '*',
    methods: [ 'GET', 'POST', 'PUT', 'DELETE' ],
    maxAge: 3600
}));

app.get('/api/user/:username', UserController.get);
app.get('/api/user', UserController.list);
app.post('/api/user', UserController.create);
app.put('/api/user/:username', UserController.edit);
app.delete('/api/user/:username', UserController.deleteUser);
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
