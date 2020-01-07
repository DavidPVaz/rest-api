import https from 'https';
import express from 'express';
import cors from 'cors';
import tlsCredentials from '../../config';

const app = express();

app.use(cors({
    origin: '*',
    methods: [ 'GET', 'POST', 'PUT', 'DELETE' ],
    maxAge: 3600
}));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const server = https.createServer(tlsCredentials, app);

export { server };
