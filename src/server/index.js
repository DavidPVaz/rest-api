import https from 'https';
import express from 'express';
import cors from 'cors';
import { router } from '../routes';
import tlsCredentials from '../../config';

const app = express();

app.disable('x-powered-by');
app.disable('etag');

app.use(express.json());
app.use(cors({
    origin: '*',
    methods: [ 'GET', 'POST', 'PUT', 'DELETE' ]
}));

app.use(router);

const server = https.createServer(tlsCredentials, app);
/** 
* @module Server 
*/
export { server };
