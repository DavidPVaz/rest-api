import fs from 'fs';
import crypto from 'crypto';
/** 
 * TLS configuration object.
 * 
 * @property {string} key  - TLS key.
 * @property {string} cert - TLS certificate.
 */
const tls = {
    key: fs.readFileSync('config/tls/server.key'),
    cert: fs.readFileSync('config/tls/server.crt')
};
/** 
 * Secret used to generate JWT.
 */
const secret = Buffer.from(crypto.randomBytes(256).toString('base64'), 'base64');

export default {
    key: tls.key,
    cert: tls.cert
};

export { secret };
