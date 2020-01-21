/** 
 * @module Server 
 */
import Glue from '@hapi/glue';
import Config from '../../config';
import Plugins from '../plugins';

const manifest = {
    server: {
        host: Config.host,
        port: Config.port,
        tls: Config.tls,
        routes: {
            cors: Config.cors
        }
    },
    register: { plugins: Plugins }
};

export default async () => Glue.compose(manifest);
