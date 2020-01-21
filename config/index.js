/** 
 * @module Config
 */
import fs from 'fs';
import crypto from 'crypto';
/** 
 * `TLS` configuration object.
 * 
 * @property {string} key  - TLS key.
 * @property {string} cert - TLS certificate.
 */
const tls = {
    key: fs.readFileSync('config/tls/server.key'),
    cert: fs.readFileSync('config/tls/server.crt')
};
/** 
 * `Secret` used to generate Json Web Token.
 */
const secret = crypto.randomBytes(256).toString('base64');
/** 
 * Server `CORS`
 */
const cors = {
    origin: [ '*' ],
    maxAge: 3600
};
/** 
 * Server `HOST`
 */
const host = process.env.API_HOST || 'localhost';
/** 
 * Server `PORT`
 */
const port = process.env.API_PORT || 8888;

export default {
    tls,
    secret,
    host,
    port,
    cors
};
