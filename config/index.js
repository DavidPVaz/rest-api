import fs from 'fs';
import crypto from 'crypto';

const tls = {
    key: fs.readFileSync('config/tls/server.key'),
    cert: fs.readFileSync('config/tls/server.crt')
};

const secret = Buffer.from(crypto.randomBytes(256).toString('base64'), 'base64');

export default {
    key: tls.key,
    cert: tls.cert,
    secret
};
